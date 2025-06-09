import { formatPublicKey } from "@agentcommercekit/keys"
import type { DidDocument } from "./did-document"
import type { DidUri } from "./did-uri"
import type {
  Keypair,
  KeypairAlgorithm,
  PublicKeyFormat,
  PublicKeyTypeMap
} from "@agentcommercekit/keys"
import type { VerificationMethod } from "did-resolver"

/**
 * Combined verification method configuration
 */
export const keyConfig = {
  secp256k1: {
    type: "EcdsaSecp256k1VerificationKey2019",
    context: ["https://w3id.org/security#EcdsaSecp256k1VerificationKey2019"]
  },
  Ed25519: {
    type: "Ed25519VerificationKey2018",
    context: ["https://w3id.org/security#Ed25519VerificationKey2018"]
  }
} as const

type PublicKeyWithFormat = {
  [K in PublicKeyFormat]: {
    format: K
    algorithm: KeypairAlgorithm
    value: PublicKeyTypeMap[K]
  }
}[PublicKeyFormat]

interface CreateVerificationMethodOptions {
  did: DidUri
  publicKey: PublicKeyWithFormat
}

/**
 * Build a verification method from options
 */
export function createVerificationMethod({
  did,
  publicKey
}: CreateVerificationMethodOptions): VerificationMethod {
  const verificationMethod: VerificationMethod = {
    id: `${did}#${publicKey.format}-1`,
    type: keyConfig[publicKey.algorithm].type,
    controller: did
  }

  // Add public key in the requested format
  switch (publicKey.format) {
    case "hex":
      verificationMethod.publicKeyHex = publicKey.value
      break
    case "jwk":
      verificationMethod.publicKeyJwk = publicKey.value
      break
    case "multibase":
      verificationMethod.publicKeyMultibase = publicKey.value
      break
    case "base58":
      verificationMethod.publicKeyBase58 = publicKey.value
      break
  }

  return verificationMethod
}

/**
 * Base options for creating a DID document
 */
export interface CreateDidDocumentOptions {
  /**
   * The DID to include in the DID document
   */
  did: DidUri
  /**
   * The public key to include in the DID document
   */
  publicKey: PublicKeyWithFormat

  /**
   * Additional URIs that are equivalent to this DID
   */
  alsoKnownAs?: string[]
  /**
   * The controller of the DID document
   */
  controller?: DidUri
  /**
   * Services associated with the DID
   */
  service?: DidDocument["service"]
  /**
   * Additional contexts to include in the DID document
   */
  additionalContexts?: string[]
  /**
   * Optional verification method to use instead of building one
   */
  verificationMethod?: VerificationMethod
}

/**
 * Create a DID document from a public key
 *
 * @param options - The {@link CreateDidDocumentOptions} to use
 * @returns A {@link DidDocument}
 */
export function createDidDocument({
  did,
  publicKey,
  controller,
  alsoKnownAs,
  service,
  additionalContexts,
  verificationMethod
}: CreateDidDocumentOptions): DidDocument {
  verificationMethod ??= createVerificationMethod({
    did,
    publicKey
  })

  const contexts = [
    "https://www.w3.org/ns/did/v1",
    ...keyConfig[publicKey.algorithm].context,
    ...(additionalContexts ?? [])
  ]

  const document: DidDocument = {
    "@context": contexts,
    id: did,
    verificationMethod: [verificationMethod],
    authentication: [verificationMethod.id],
    assertionMethod: [verificationMethod.id]
  }

  if (controller) {
    document.controller = controller
  }

  if (alsoKnownAs) {
    document.alsoKnownAs = alsoKnownAs
  }

  if (service) {
    document.service = service
  }

  return document
}

export type CreateDidDocumentFromKeypairOptions = Omit<
  CreateDidDocumentOptions,
  "publicKey"
> & {
  /**
   * The keypair to create the did document from
   */
  keypair: Keypair
  /**
   * The format of the public key
   */
  format?: PublicKeyFormat
}

/**
 * Create a DID document from a Keypair
 *
 * @param options - The {@link CreateDidDocumentFromKeypairOptions} to use
 * @returns A {@link DidDocument}
 */
export function createDidDocumentFromKeypair({
  keypair,
  format = "jwk",
  ...options
}: CreateDidDocumentFromKeypairOptions): DidDocument {
  switch (format) {
    case "hex":
      return createDidDocument({
        ...options,
        publicKey: {
          format: "hex",
          algorithm: keypair.algorithm,
          value: formatPublicKey(keypair, "hex")
        }
      })
    case "jwk":
      return createDidDocument({
        ...options,
        publicKey: {
          format: "jwk",
          algorithm: keypair.algorithm,
          value: formatPublicKey(keypair, "jwk")
        }
      })
    case "multibase":
      return createDidDocument({
        ...options,
        publicKey: {
          format: "multibase",
          algorithm: keypair.algorithm,
          value: formatPublicKey(keypair, "multibase")
        }
      })
    case "base58":
      return createDidDocument({
        ...options,
        publicKey: {
          format: "base58",
          algorithm: keypair.algorithm,
          value: formatPublicKey(keypair, "base58")
        }
      })
    default:
      throw new Error(`Invalid format`)
  }
}
