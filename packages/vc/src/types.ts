import type {
  JwtCredentialPayload,
  Verifiable,
  W3CCredential
} from "did-jwt-vc"

export type CredentialSubject = W3CCredential["credentialSubject"]
export type { JwtCredentialPayload, Verifiable, W3CCredential }
