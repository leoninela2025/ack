import { getBase58Codec } from "@solana/codecs-strings"
import { fromString } from "uint8arrays/from-string"
import { toString } from "uint8arrays/to-string"

/**
 * Convert bytes to a base58btc string (used for DID:key URIs)
 */
export function bytesToBase58btc(bytes: Uint8Array): string {
  return toString(bytes, "base58btc")
}

/**
 * Convert a base58btc string to bytes (used for DID:key URIs)
 */
export function base58btcToBytes(base58: string): Uint8Array {
  return fromString(base58, "base58btc")
}

/**
 * Convert bytes to a Solana base58 string (used for Solana addresses)
 */
export function bytesToBase58(bytes: Uint8Array): string {
  const codec = getBase58Codec()
  return codec.decode(bytes)
}

/**
 * Convert a Solana base58 string to bytes (used for Solana addresses)
 */
export function base58ToBytes(base58: string): Uint8Array {
  const codec = getBase58Codec()
  return new Uint8Array(codec.encode(base58))
}

/**
 * Check if a string is valid base58 encoded
 */
export function isBase58(str: unknown): str is string {
  if (typeof str !== "string") {
    return false
  }
  try {
    // Try to decode it - if it succeeds, it's valid base58
    const codec = getBase58Codec()
    codec.encode(str)
    return true
  } catch {
    return false
  }
}
