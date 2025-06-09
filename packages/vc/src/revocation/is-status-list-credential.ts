import * as v from "valibot"
import { isCredential } from "../is-credential"
import { statusList2021ClaimSchema } from "../schemas/valibot"
import type { StatusList2021Credential } from "./types"
import type { CredentialSubject } from "../types"

function isStatusList2021Claim(
  credentialSubject: CredentialSubject
): credentialSubject is v.InferOutput<typeof statusList2021ClaimSchema> {
  return v.is(statusList2021ClaimSchema, credentialSubject)
}

/**
 * Check if a credential is a status list credential
 *
 * @param credential - The credential to check
 * @returns `true` if the credential is a status list credential, `false` otherwise
 */
export function isStatusListCredential(
  credential: unknown
): credential is StatusList2021Credential {
  if (!isCredential(credential)) {
    return false
  }
  return isStatusList2021Claim(credential.credentialSubject)
}
