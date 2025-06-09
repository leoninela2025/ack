import { ES256KSigner, EdDSASigner } from "did-jwt"
import type { Keypair } from "@agentcommercekit/keys"
import type { Signer } from "did-jwt"

export type JwtSigner = Signer

/**
 * Create a JWT-compatible signer from a Keypair
 *
 * This function creates the appropriate signer based on the key pair's algorithm:
 * - secp256k1 -> ES256KSigner
 * - Ed25519 -> EdDSASigner
 *
 * @param keypair - The Keypair to create a signer from
 * @returns A JWT-compatible signer
 */
export function createJwtSigner(keypair: Keypair): JwtSigner {
  switch (keypair.algorithm) {
    case "secp256k1":
      return ES256KSigner(keypair.privateKey)
    case "Ed25519":
      return EdDSASigner(keypair.privateKey)
    default:
      throw new Error("Unsupported algorithm", keypair.algorithm)
  }
}
