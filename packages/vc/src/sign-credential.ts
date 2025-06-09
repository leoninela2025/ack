import { isJwtString, resolveJwtAlgorithm } from "@agentcommercekit/jwt"
import { createVerifiableCredentialJwt, verifyCredential } from "did-jwt-vc"
import type { Verifiable, W3CCredential } from "./types"
import type { Resolvable } from "@agentcommercekit/did"
import type { JwtAlgorithm, JwtSigner, JwtString } from "@agentcommercekit/jwt"

interface SignCredentialOptions {
  /**
   * The algorithm to use for the JWT
   */
  alg?: JwtAlgorithm
  /**
   * The DID of the credential issuer
   */
  did: string
  /**
   * The signer to use for the JWT
   */
  signer: JwtSigner
  /**
   * A resolver to use for parsing the signed credential
   */
  resolver: Resolvable
}

type SignedCredential<T extends W3CCredential> = {
  /**
   * The signed {@link Verifiable<W3CCredential>} credential
   */
  verifiableCredential: Verifiable<T>
  /**
   * The JWT string representation of the signed credential
   */
  jwt: JwtString
}

/**
 * Signs a credential with a given issuer.
 *
 * @param credential - The {@link W3CCredential} to sign
 * @param options - The {@link SignCredentialOptions} to use
 * @returns A {@link SignedCredential}
 */
export async function signCredential<T extends W3CCredential>(
  credential: T,
  options: SignCredentialOptions
): Promise<SignedCredential<T>> {
  options.alg = options.alg ? resolveJwtAlgorithm(options.alg) : options.alg
  const jwt = await createVerifiableCredentialJwt(credential, options)

  if (!isJwtString(jwt)) {
    throw new Error("Failed to sign credential")
  }

  const { verifiableCredential } = await verifyCredential(jwt, options.resolver)

  return { jwt, verifiableCredential: verifiableCredential as Verifiable<T> }
}
