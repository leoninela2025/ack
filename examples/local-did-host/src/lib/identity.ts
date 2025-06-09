import {
  createDidWebDocumentFromKeypair,
  createDidWebUri
} from "@agentcommercekit/did"
import { createJwtSigner } from "@agentcommercekit/jwt"
import { generateKeypair } from "@agentcommercekit/keys"
import { hexStringToBytes } from "@agentcommercekit/keys/encoding"
import type { DidDocument, DidUri } from "@agentcommercekit/did"
import type { JwtAlgorithm, JwtSigner } from "@agentcommercekit/jwt"
import type { KeypairAlgorithm } from "@agentcommercekit/keys"

export interface Identity {
  did: DidUri
  didDocument: DidDocument
  signer: JwtSigner
  alg: JwtAlgorithm
}

export function getIdentityDid(baseUrl: string): DidUri {
  return createDidWebUri(baseUrl)
}

interface GetIdentityOptions {
  baseUrl: string
  privateKey: `0x${string}`
  controller?: DidUri
  alg?: KeypairAlgorithm
}

export async function getIdentity({
  baseUrl,
  privateKey,
  controller,
  alg = "secp256k1"
}: GetIdentityOptions): Promise<Identity> {
  const keypair = await generateKeypair(alg, hexStringToBytes(privateKey))
  const signer = createJwtSigner(keypair)

  const { did, didDocument } = createDidWebDocumentFromKeypair({
    keypair,
    baseUrl,
    controller
  })

  return {
    did,
    didDocument,
    signer,
    alg
  }
}
