import { adminAuth } from "./firebase-admin";

export async function verifyAuth(req: Request) {
  const authHeader = req.headers.get("authorization");
  
  // Parse cookies from request headers
  const cookieHeader = req.headers.get("cookie");
  let cookieToken = null;
  if (cookieHeader) {
    const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => {
      const [key, ...v] = c.split('=');
      return [key, v.join('=')];
    }));
    cookieToken = cookies['auth'];
  }

  // Use Authorization header if present, otherwise fallback to the HttpOnly cookie
  const idToken = authHeader?.startsWith("Bearer ") ? authHeader.split("Bearer ")[1] : cookieToken;

  if (!idToken) {
    return { uid: null, error: "Missing authorization token" };
  }

  // CSRF Protection
  // If the request is a state-changing method and relies on cookies, we verify the origin
  if (cookieToken && ["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host") || req.headers.get("x-forwarded-host");
    
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          console.warn(`CSRF attempt blocked. Origin: ${origin}, Host: ${host}`);
          return { uid: null, error: "CSRF protection failed: Invalid origin" };
        }
      } catch (e) {
        console.warn(`Invalid origin header: ${origin}`, e);
        return { uid: null, error: "CSRF protection failed: Invalid origin header" };
      }
    } else if (!origin && req.headers.get("sec-fetch-site") === "cross-site") {
      // Modern browsers send sec-fetch-site
      return { uid: null, error: "CSRF protection failed: Cross-site request" };
    }
  }

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
