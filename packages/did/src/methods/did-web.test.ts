import { generateKeypair } from "@agentcommercekit/keys"
import { bytesToHexString } from "@agentcommercekit/keys/encoding"
import { describe, expect, it } from "vitest"
import { createDidWebDocument, createDidWebUri } from "./did-web"

describe("createDidWeb", () => {
  it("creates a did:web for a simple url with no path", () => {
    const url = new URL("https://example.com")
    const did = createDidWebUri(url)
    expect(did).toBe("did:web:example.com")
  })

  it("creates a did:web for a url with a path", () => {
    const url = new URL("https://example.com/path/to/resource")
    const did = createDidWebUri(url)
    expect(did).toBe("did:web:example.com:path:to:resource")
  })

  it("creates a did:web for a url with a port", () => {
    const url = new URL("https://example.com:8080/path/to/resource")
    const did = createDidWebUri(url)
    expect(did).toBe("did:web:example.com%3A8080:path:to:resource")
  })
})

describe("createDidWebDocument", () => {
  it("generates a valid Did and Did document", async () => {
    const keypair = await generateKeypair("secp256k1")
    const publicKeyHex = bytesToHexString(keypair.publicKey)

    const { did, didDocument } = createDidWebDocument({
      publicKey: {
        format: "hex",
        value: publicKeyHex,
        algorithm: keypair.algorithm
      },
      baseUrl: "https://example.com"
    })

    expect(did).toEqual("did:web:example.com")

    expect(didDocument).toEqual({
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security#EcdsaSecp256k1VerificationKey2019"
      ],
      id: "did:web:example.com",
      verificationMethod: [
        {
          id: "did:web:example.com#hex-1",
          type: "EcdsaSecp256k1VerificationKey2019",
          controller: "did:web:example.com",
          publicKeyHex: publicKeyHex.replace(/^0x/, "")
        }
      ],
      authentication: ["did:web:example.com#hex-1"],
      assertionMethod: ["did:web:example.com#hex-1"]
    })
  })
})
