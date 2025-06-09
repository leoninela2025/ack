import { verifyCredential } from "did-jwt-vc"
import type { Verifiable, W3CCredential } from "../types"
import type { Resolvable } from "@agentcommercekit/did"

/**
 * Parse a JWT credential
 *
 * @param jwt - The JWT string to parse
 * @param resolver - The resolver to use for did resolution
 * @returns A {@link Verifiable<W3CCredential>}
 */
export async function parseJwtCredential(
  jwt: string,
  resolver: Resolvable
): Promise<Verifiable<W3CCredential>> {
  const result = await verifyCredential(jwt, resolver)

  return result.verifiableCredential
}
