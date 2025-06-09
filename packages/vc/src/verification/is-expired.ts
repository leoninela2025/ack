import type { W3CCredential } from "../types"

/**
 * Check if a credential is expired
 *
 * @param credential - The {@link W3CCredential} to check
 * @returns `true` if the credential is expired, `false` otherwise
 */
export function isExpired(credential: W3CCredential): boolean {
  if (!credential.expirationDate) {
    return false
  }

  const expirationDate = new Date(credential.expirationDate)

  if (isNaN(expirationDate.getTime())) {
    // Expiration date is invalid, so we consider the credential not expired
    return false
  }

  return expirationDate < new Date()
}
