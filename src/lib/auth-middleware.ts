import { adminAuth } from "./firebase-admin";

export async function verifyAuth(req: Request) {
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { uid: null, error: "Missing or invalid authorization header" };
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    if (!adminAuth) {
      console.error("Firebase Admin not initialized. Cannot verify auth token.");
      return { uid: null, error: "Internal server error: Auth not initialized" };
    }
    
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return { uid: decodedToken.uid, error: null };
  } catch (error) {
    console.error("Error verifying auth token", error);
    return { uid: null, error: "Invalid token" };
  }
}
