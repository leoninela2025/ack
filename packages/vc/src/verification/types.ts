import type { CredentialSubject } from "../types"
import type { Resolvable } from "@agentcommercekit/did"

export type ClaimVerifier = {
  accepts(type: string[]): boolean
  verify(
    credentialSubject: CredentialSubject,
    resolver: Resolvable
  ): Promise<void>
}
