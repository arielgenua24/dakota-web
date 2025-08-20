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
  category?: string,
): Promise<ProductsResponse> => {
  const app = getFirebaseApp();
  const db = getFirestore(app);

  // Leemos SOLO el documento parsed_data_1 (simplificación temporal).
  const firstDocRef = doc(db, "cached_products", "parsed_data_1");
  const firstSnap = await getDoc(firstDocRef);

  if (!firstSnap.exists()) {
    console.warn("[firebaseCache] parsed_data_1 no existe en cached_products");
  }

  const raw = firstSnap.data() as { data?: unknown } | undefined;
  const container = raw?.data ?? raw ?? {};

  // Tomamos todos los valores que parezcan productos válidos.
  let products: Product[] = Object.values(container as Record<string, unknown>).filter(
    (v): v is Product => typeof v === "object" && v !== null && "id" in v && "name" in v,
  );

  console.log("[firebaseCache] productos parseados:", products.length);

  if (category) {
    products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  const total = products.length;
  const totalPages = 1; // simplificación
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    products: products.slice(start, end),
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};
