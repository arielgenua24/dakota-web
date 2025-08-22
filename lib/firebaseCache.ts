import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Types replicated to avoid circular dependencies. Keep in sync with use-products definitions.
export type ProductSize = {
  size: number | string;
  quantity: number;
};

export type Product = {
  id: number;
  name: string;
  category: string;
  specialTag: string;
  images: {
    img1: string;
    img2: string;
    img3: string;
  };
  price: number;
  state: string;
  sizes: ProductSize[];
};

export type PaginationData = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProductsResponse = {
  products: Product[];
  pagination: PaginationData;
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_CACHE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_CACHE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_CACHE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_CACHE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_CACHE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_CACHE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_CACHE_MEASUREMENT_ID,
};

function getFirebaseApp() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0];
}

/**
 * Obtiene productos desde la colección `cached_products` en Firestore.
 * Agrupa los productos de todos los documentos (parsed_data_n), aplica filtros
 * y devuelve la paginación esperada por la UI.
 */
export const fetchCachedProducts = async (
  page = 1,
  limit = 12,
  _category?: string,
): Promise<ProductsResponse> => {
  const app = getFirebaseApp();
  const db = getFirestore(app);
  // Referencia intencional para evitar warning de variable no usada
  void _category;

  // Leemos el documento correspondiente a la página actual: parsed_data_{page}
  const docRef = doc(db, "cached_products", `parsed_data_${page}`);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    console.warn(`[firebaseCache] parsed_data_${page} no existe en cached_products`);
    return {
      products: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: page, // No hay más páginas por cargar
      },
    };
  }

  const raw = snap.data() as { data?: unknown } | undefined;
  const container = raw?.data ?? raw ?? {};

  // Tomamos todos los valores que parezcan productos válidos.
  const products: Product[] = Object.values(container as Record<string, unknown>).filter(
    (v): v is Product => typeof v === "object" && v !== null && "id" in v && "name" in v,
  );

  console.log("[firebaseCache] productos parseados:", products.length);

  // Nota: no filtramos por categoría aquí; la UI se encarga de filtrar tras cada inyección de chunk.

  const total = products.length;
  const totalPages = page + 1; // Asumimos que podría existir parsed_data_{page+1}; si no, devolveremos totalPages=page en la próxima llamada

  return {
    products, // devolvemos todo el chunk del documento
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};
