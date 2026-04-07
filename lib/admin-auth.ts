

export const ADMIN_COOKIE = "dineup_admin_session";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@dineup.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "dineup-admin-secret";

// A constant-time string comparison to mitigate timing attacks
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function validateAdminCredentials(email: string, password: string) {
  // Use constant-time comparison
  const emailValid = timingSafeEqual(email, ADMIN_EMAIL);
  const passwordValid = timingSafeEqual(password, ADMIN_PASSWORD);
  return emailValid && passwordValid;
}

// Since Web Crypto is async and middleware is async, we'll use a fast custom implementation, 
// or simpler symmetric enc if we avoid third party. 
// Web Crypto API HMAC implementation for Edge Runtime compatibility:
const encoder = new TextEncoder();

async function getHmacKey() {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createAdminSessionValue() {
  const payloadStr = `${ADMIN_EMAIL}:${Date.now()}`;
  const key = await getHmacKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadStr));
  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payloadStr}.${signatureHex}`;
}

export async function isValidAdminSession(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  
  const lastDot = value.lastIndexOf(".");
  if (lastDot === -1) return false;

  const payloadStr = value.substring(0, lastDot);
  const signatureHex = value.substring(lastDot + 1);

  try {
    const key = await getHmacKey();
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadStr));
    const expectedSignatureHex = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
      
    return timingSafeEqual(signatureHex, expectedSignatureHex);
  } catch (err) {
    return false;
  }
}
