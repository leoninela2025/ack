import {
  createDidDocumentFromKeypair,
  createDidKeyUri,
  createJwtSigner,
  generateKeypair
} from "agentcommercekit"
import type {
  DidDocument,
  DidUri,
  JwtSigner,
  KeypairAlgorithm
} from "agentcommercekit"

export interface Owner {
  did: DidUri
  didDocument: DidDocument
  signer: JwtSigner
  algorithm: KeypairAlgorithm
}

export async function createOwner(): Promise<Owner> {
  const keypair = await generateKeypair("secp256k1")
  const did = createDidKeyUri(keypair)
  const didDocument = createDidDocumentFromKeypair({
    did,
    keypair
  })
  const signer = createJwtSigner(keypair)
  const algorithm = keypair.algorithm

  return {
    did,
    didDocument,
    signer,
    algorithm
  }
}
