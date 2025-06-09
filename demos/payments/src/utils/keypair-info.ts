import {
  bytesToHexString,
  createDidPkhUri,
  createJwtSigner,
  generateKeypair,
  hexStringToBytes
} from "agentcommercekit"
import { privateKeyToAccount } from "viem/accounts"
import { publicKeyToAddress } from "viem/utils"
import { chainId } from "@/constants"
import type {
  DidUri,
  JwtSigner,
  Keypair,
  KeypairAlgorithm
} from "agentcommercekit"
import type { Account } from "viem/accounts"

export type KeypairInfo = {
  publicKeyHex: `0x${string}`
  did: DidUri
  keypair: Keypair
  jwtSigner: JwtSigner
  crypto: {
    address: `0x${string}`
    account: Account
  }
}

/**
 * Generates a KeypairInfo object from a private key bytes and algorithm.
 *
 * @param privateKeyHex - The private key for the Keypair,  hex string format. Optional, if not presented a new one will be generated
 * @param alg - The algorithm for the Keypair. Defaults to secp256k1
 * @returns A KeypairInfo object
 */
export async function getKeypairInfo(
  privateKeyHex: string,
  alg: KeypairAlgorithm = "secp256k1"
): Promise<KeypairInfo> {
  const keypair = await generateKeypair(alg, hexStringToBytes(privateKeyHex))
  const address = publicKeyToAddress(`0x${bytesToHexString(keypair.publicKey)}`)
  const account = privateKeyToAccount(
    `0x${bytesToHexString(keypair.privateKey)}`
  )
  const did = createDidPkhUri(address, chainId)
  const jwtSigner = createJwtSigner(keypair)

  return {
    publicKeyHex: `0x${bytesToHexString(keypair.publicKey)}`,
    keypair,
    did,
    jwtSigner,
    crypto: {
      address,
      account
    }
  }
}

/**
 * Generates a new private key, and returns it in hex string format.
 */
export async function generatePrivateKeyHex() {
  const { privateKey } = await generateKeypair("secp256k1")
  return `0x${bytesToHexString(privateKey)}`
}
