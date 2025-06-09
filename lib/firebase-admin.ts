import path from "path"
import { readFileSync } from "fs"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Ruta al archivo de credenciales (deberías poner esta ruta en una variable de entorno)
const serviceAccountPath = process.env.FIREBASE_ADMIN_CREDENTIALS_PATH || path.resolve(process.cwd(), "mbarete-inventario-firebase-adminsdk-fbsvc-e003f92700.json")
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"))

// Inicializar Firebase Admin (solo si no está ya inicializado)
const apps = getApps()

if (!apps.length) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  })
}

const db = getFirestore()

export { db }
