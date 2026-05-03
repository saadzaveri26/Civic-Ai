import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

/**
 * Initializes Firebase Admin SDK for server-side token verification.
 * Uses GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_KEY env var.
 * Falls back to application default credentials (works on GCP).
 */
function initAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // If a service account key JSON is provided as an env var
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
      return initializeApp({ credential: cert(serviceAccount) });
    } catch {
      // Fall through to default credentials
    }
  }

  // Application Default Credentials (works on GCP, or with GOOGLE_APPLICATION_CREDENTIALS)
  return initializeApp();
}

const adminApp = initAdmin();

/**
 * Firebase Admin Auth instance for verifying ID tokens server-side.
 */
export const adminAuth = getAuth(adminApp);
