import { createCredential } from "../create-credential"
import type { StatusList2021Credential } from "./types"

type CreateStatusListCredentialParams = {
  /**
   * The URL of the status list.
   */
  url: string
  /**
   * The encoded list of the status list.
   */
  encodedList: string
  /**
   * The issuer of the status list credential.
   */
  issuer: string
}

/**
 * Generates a status list credential.
 *
 * @param params - The {@link CreateStatusListCredentialParams} to use
 * @returns A {@link StatusList2021Credential}
 */
export function createStatusListCredential({
  url,
  encodedList,
  issuer
}: CreateStatusListCredentialParams): StatusList2021Credential {
  return createCredential({
    id: url,
    type: "StatusList2021Credential",
    issuer,
    subject: `${url}#list`,
    attestation: {
      type: "StatusList2021",
      statusPurpose: "revocation",
      encodedList
    }
  })
}
