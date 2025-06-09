import { describe, expect, test } from "vitest"
import { createStatusListCredential } from "./status-list-credential"

describe("createStatusListCredential", () => {
  test("should create a valid status list credential", () => {
    const issuer = "did:web:issuer.example:com"

    const params = {
      url: "https://example.com/status-list",
      encodedList: "mockEncodedList",
      issuer
    }

    const credential = createStatusListCredential(params)

    expect(credential.type).toContain("StatusList2021Credential")
    expect(credential.issuer).toEqual({ id: issuer })
    expect(credential.credentialSubject).toBeDefined()
    expect(credential.credentialSubject.type).toBe("StatusList2021")
    expect(credential.credentialSubject.statusPurpose).toBe("revocation")
    expect(credential.credentialSubject.encodedList).toBe(params.encodedList)
  })
})
