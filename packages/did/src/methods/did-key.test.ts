import { generateKeypair, keypairFromBase58 } from "@agentcommercekit/keys"
import { describe, expect, it } from "vitest"
import { createDidKeyUri, isDidKeyUri } from "./did-key"
import { getDidResolver } from "../did-resolvers/get-did-resolver"
import type { DidUri } from "../did-uri"
import type { KeypairBase58 } from "@agentcommercekit/keys"

const KNOWN_DID_KEYS: { did: DidUri; keypairBase58: KeypairBase58 }[] = [
  {
    did: "did:key:zQ3shuYfyvoY2K83PxQrDr7wS8anFwjVGoKsnEDNjgrn19Udv",
    keypairBase58: {
      publicKey: "29bWy5f4YzUpWiKAoU34PJzQpHyJJWmqFJHcwPX6svznC",
      privateKey: "9Y3KWxCfMccnzGm3ztk8VxgpVpfn5Cf4WJUYtFYs5Fte",
      algorithm: "secp256k1"
    }
  },
  {
    did: "did:key:z6MkqknXmyEp9pQt6cQJLib7KkrSMvFQEKaDJsmw3amDQwzh",
    keypairBase58: {
      publicKey: "CJXVBizNpGvQz7Zbf9dGUfJSYLyYpSKrcrs1DJoCVjDK",
      privateKey: "GyoKth6SiFGEbsSxT7D9dhF9jSCk7W6MLP7Z5815Rkbg",
      algorithm: "Ed25519"
    }
  }
]

describe("createDidKeyUri()", () => {
  it.each(KNOWN_DID_KEYS)(
    `generates a valid did:key from a $keypairBase58.algorithm public key`,
    async ({ did, keypairBase58 }) => {
      const keypair = keypairFromBase58(keypairBase58)
      const didKey = createDidKeyUri(keypair)

      expect(didKey).toMatch(/^did:key:z[1-9A-HJ-NP-Za-km-z]+$/)
      expect(didKey).toBe(did)

      // Sanity check, resolve the did to ensure it's a valid did:key document
      const didResolver = getDidResolver()
      const resolvedDid = await didResolver.resolve(didKey)
      expect(resolvedDid.didDocument).toBeDefined()
      expect(resolvedDid.didDocument?.id).toBe(did)
    }
  )

  it("uses the compressed public key", async () => {
    const keypair = await generateKeypair("secp256k1")
    const didKey = createDidKeyUri(keypair)
    expect(didKey).toMatch(/^did:key:z[1-9A-HJ-NP-Za-km-z]+$/)
  })
})

describe("isDidKeyUri", () => {
  it("returns true for valid did:key", () => {
    expect(isDidKeyUri("did:key:z123")).toBe(true)
  })

  it("returns false for invalid did:key", () => {
    expect(isDidKeyUri("invalid-did-key")).toBe(false)
  })
})
