import { generateKeypair as ed25519 } from "./curves/ed25519"
import { generateKeypair as secp256k1 } from "./curves/secp256k1"
import { base58ToBytes, bytesToBase58 } from "./encoding/base58"
import { base64ToBytes, bytesToBase64 } from "./encoding/base64"
import { bytesToJwk, jwkToBytes } from "./encoding/jwk"
import type { PrivateKeyJwk } from "./encoding/jwk"
import type { Keypair, KeypairAlgorithm, KeypairBase58 } from "./types"

/**
 * Generate a Keypair for a given algorithm
 *
 * @param algorithm - The algorithm to use (`secp256k1` or `Ed25519`)
 * @param privateKeyBytes - The private key bytes to use (optional)
 * @returns A Keypair
 */
export async function generateKeypair(
  algorithm: KeypairAlgorithm,
  privateKeyBytes?: Uint8Array
): Promise<Keypair> {
  if (algorithm === "secp256k1") {
    return secp256k1(privateKeyBytes)
  }

  return ed25519(privateKeyBytes)
}

/**
 * Convert a Keypair to a base58-encoded string format
 *
 * @param keypair - The Keypair to convert
 * @returns A base58-encoded string representation of the Keypair
 */
export function keypairToBase58(keypair: Keypair): KeypairBase58 {
  return {
    publicKey: bytesToBase58(keypair.publicKey),
    privateKey: bytesToBase58(keypair.privateKey),
    algorithm: keypair.algorithm
  }
}

/**
 * Convert a base58-encoded string format back to a Keypair
 *
 * @param base58 - The base58-encoded Keypair
 * @returns The reconstructed Keypair
 */
export function keypairFromBase58(base58: KeypairBase58): Keypair {
  return {
    publicKey: base58ToBytes(base58.publicKey),
    privateKey: base58ToBytes(base58.privateKey),
    algorithm: base58.algorithm
  }
}

/**
 * Convert a Keypair to a JWK format
 *
 * @param keypair - The Keypair to convert
 * @returns A JSON Web Key representation of the Keypair
 */
export function keypairToJwk(keypair: Keypair): PrivateKeyJwk {
  const publicKeyJwk = bytesToJwk(keypair.publicKey, keypair.algorithm)
  return {
    ...publicKeyJwk,
    d: bytesToBase64(keypair.privateKey)
  }
}

/**
 * Convert a JWK to a Keypair
 *
 * @param jwk - The JWK to convert
 * @returns A Keypair
 */
export function jwkToKeypair(jwk: PrivateKeyJwk): Keypair {
  return {
    publicKey: jwkToBytes(jwk),
    privateKey: base64ToBytes(jwk.d),
    algorithm: jwk.crv
  }
}
