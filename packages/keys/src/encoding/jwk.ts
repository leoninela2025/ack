import { base64ToBytes, bytesToBase64 } from "./base64"
import type { KeypairAlgorithm } from "../types"

/**
 * JWK-encoding, specifically limited to public keys
 */
export type PublicKeyJwkSecp256k1 = {
  kty: "EC"
  crv: "secp256k1"
  x: string // base64url encoded x-coordinate
  y: string // base64url encoded y-coordinate
}

export type PublicKeyJwkEd25519 = {
  kty: "OKP"
  crv: "Ed25519"
  x: string // base64url encoded x-coordinate
}

export type PublicKeyJwk = PublicKeyJwkSecp256k1 | PublicKeyJwkEd25519

/**
 * JWK-encoding for private keys
 */
export type PrivateKeyJwk = PublicKeyJwk & {
  d: string // base64url encoded private key
}

/**
 * Check if an object is a valid public key JWK
 */
export function isPublicKeyJwk(jwk: unknown): jwk is PublicKeyJwk {
  if (typeof jwk !== "object" || jwk === null) {
    return false
  }

  const obj = jwk as Record<string, unknown>

  if (obj.kty !== "EC" && obj.kty !== "OKP") {
    return false
  }

  if (obj.crv !== "secp256k1" && obj.crv !== "Ed25519") {
    return false
  }

  if (typeof obj.x !== "string" || obj.x.length === 0) {
    return false
  }

  // For secp256k1, y coordinate is required
  if (obj.crv === "secp256k1") {
    if (typeof obj.y !== "string" || obj.y.length === 0) {
      return false
    }
  }

  // For Ed25519, y coordinate should not be present
  if (obj.crv === "Ed25519" && "y" in obj) {
    return false
  }

  return true
}

/**
 * Check if an object is a valid private key JWK
 */
export function isPrivateKeyJwk(jwk: unknown): jwk is PrivateKeyJwk {
  if (!isPublicKeyJwk(jwk)) {
    return false
  }

  const obj = jwk as Record<string, unknown>
  return typeof obj.d === "string" && obj.d.length > 0
}

/**
 * Convert public key bytes to a JWK format
 */
export function bytesToJwk(
  bytes: Uint8Array,
  algorithm: KeypairAlgorithm
): PublicKeyJwk {
  if (algorithm === "Ed25519") {
    return {
      kty: "OKP",
      crv: "Ed25519",
      x: bytesToBase64(bytes)
    } as const
  }

  if (bytes.length !== 65) {
    throw new Error("Invalid secp256k1 public key length")
  }

  // Skip the first byte (0x04) and take 32 bytes for x, then 32 bytes for y
  const xBytes = bytes.slice(1, 33)
  const yBytes = bytes.slice(33)
  return {
    kty: "EC",
    crv: "secp256k1",
    x: bytesToBase64(xBytes),
    y: bytesToBase64(yBytes)
  } as const
}

/**
 * Convert a JWK to public key bytes
 */
export function jwkToBytes(jwk: PublicKeyJwk): Uint8Array {
  const xBytes = base64ToBytes(jwk.x)

  // For secp256k1, we need to reconstruct the full public key
  if (jwk.crv === "secp256k1") {
    const fullKey = new Uint8Array(65)
    fullKey[0] = 0x04 // Add the prefix byte
    fullKey.set(xBytes, 1) // Add the x-coordinate
    fullKey.set(base64ToBytes(jwk.y), 33) // Add the y-coordinate
    return fullKey
  }

  // For Ed25519, the x field is the complete public key
  return xBytes
}
