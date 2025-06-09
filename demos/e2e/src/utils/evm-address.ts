import { bytesToHexString } from "agentcommercekit"
import { publicKeyToAddress as viemPublicKeyToAddress } from "viem/accounts"

/**
 * Converts an secp256k1 public key byte array to an EVM address by converting
 * to an `0x`-prefixed hex string and using viem's `publicKeyToAddress` function.
 */
export function publicKeyToAddress(publicKeyBytes: Uint8Array) {
  return viemPublicKeyToAddress(`0x${bytesToHexString(publicKeyBytes)}`)
}
