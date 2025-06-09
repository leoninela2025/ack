import { getCompressedPublicKey } from "@agentcommercekit/keys"
import { bytesToMultibase } from "@agentcommercekit/keys/encoding"
import * as varint from "varint"
import type { Keypair } from "@agentcommercekit/keys"

/**
 * @see {@link https://w3c-ccg.github.io/did-key-spec/}
 *
 * did-key-format := did:key:MULTIBASE(base58-btc, MULTICODEC(public-key-type, raw-public-key-bytes))
 *
 * @example
 * Ed25519: did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK
 */

/**
 * The `did:key` Uri type
 */
export type DidKeyUri = `did:key:z${string}`

export const KEY_CONFIG = {
  secp256k1: {
    multicodecPrefix: 0xe7,
    keyLength: 33
  },
  Ed25519: {
    multicodecPrefix: 0xed,
    keyLength: 32
  }
} as const

/**
 * Checks if a given item is a valid did:key URI, according to the following format:
 *  did-key-format := did:key:<mb-value>
 *  mb-value       := z[a-km-zA-HJ-NP-Z1-9]+
 *
 * @param did - The value to check
 * @returns `true` if the value is a did:key URI, `false` otherwise
 */
export function isDidKeyUri(did: unknown): did is DidKeyUri {
  if (typeof did !== "string" || !did.startsWith("did:key:z")) {
    return false
  }

  const mbValue = did.slice(8) // Get everything after "did:key:z"
  return /^[a-km-zA-HJ-NP-Z1-9]+$/.test(mbValue)
}

/**
 * Creates a did:key URI from a keypair
 *
 * @param keypair - The keypair to create a did:key URI from
 * @returns A did:key URI
 */
export function createDidKeyUri(keypair: Keypair): DidKeyUri {
  const keyConfig = KEY_CONFIG[keypair.algorithm]
  const publicKey = getCompressedPublicKey(keypair)

  if (publicKey.length !== keyConfig.keyLength) {
    throw new Error(
      `Invalid key length for ${keypair.algorithm}. Expected ${keyConfig.keyLength} bytes, got ${publicKey.length}`
    )
  }

  const prefix = varint.encode(keyConfig.multicodecPrefix)
  const publicKeyWithPrefix = new Uint8Array([...prefix, ...publicKey])
  return `did:key:${bytesToMultibase(publicKeyWithPrefix)}`
}
