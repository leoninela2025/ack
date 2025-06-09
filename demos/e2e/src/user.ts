import {
  createDidPkhDocument,
  createJwtSigner,
  generateKeypair
} from "agentcommercekit"
import { publicKeyToAddress } from "./utils/evm-address"
import type {
  DidDocument,
  DidPkhChainId,
  DidResolver,
  DidUri,
  JwtSigner,
  Keypair
} from "agentcommercekit"

interface ConstructorParams {
  wallet: Keypair
  preferredChainId: DidPkhChainId
  did: DidUri
  didDocument: DidDocument
  resolver: DidResolver
}

export class User {
  readonly wallet: Keypair
  readonly preferredChainId: DidPkhChainId
  readonly did: DidUri
  readonly didDocument: DidDocument
  readonly signer: JwtSigner

  private constructor({
    did,
    didDocument,
    resolver,
    wallet,
    preferredChainId
  }: ConstructorParams) {
    // Wallet
    this.wallet = wallet
    this.preferredChainId = preferredChainId
    this.signer = createJwtSigner(wallet)

    // DID
    this.did = did
    this.didDocument = didDocument
    resolver.addToCache(did, didDocument)
  }

  static async create(
    resolver: DidResolver,
    chainId: DidPkhChainId
  ): Promise<User> {
    const wallet = await generateKeypair("secp256k1")
    const address = publicKeyToAddress(wallet.publicKey)
    const { did, didDocument } = createDidPkhDocument({
      address,
      chainId,
      keypair: wallet
    })

    return new User({
      wallet,
      did,
      didDocument,
      resolver,
      preferredChainId: chainId
    })
  }
}
