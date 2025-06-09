import { describe, expect, it } from "vitest"
import {
  isJwtAlgorithm,
  jwtAlgorithms,
  resolveJwtAlgorithm
} from "./jwt-algorithm"

describe("isJwtAlgorithm", () => {
  it("returns true for valid JWT algorithms", () => {
    for (const algorithm of jwtAlgorithms) {
      expect(isJwtAlgorithm(algorithm)).toBe(true)
    }
  })

  it("returns false for invalid JWT algorithms", () => {
    expect(isJwtAlgorithm("invalid")).toBe(false)
  })
})

describe("resolveJwtAlgorithm", () => {
  it("returns the correct JWT algorithm", () => {
    expect(resolveJwtAlgorithm("ES256K")).toBe("ES256K")
  })

  it("returns the correct aliased algorithm for secp256k1", () => {
    expect(resolveJwtAlgorithm("secp256k1")).toBe("ES256K")
  })

  it("returns the correct aliased algorithm for Ed25519", () => {
    expect(resolveJwtAlgorithm("Ed25519")).toBe("EdDSA")
  })

  it("throws an error for an unsupported algorithm", () => {
    expect(() => resolveJwtAlgorithm("invalid")).toThrow(
      "Unsupported algorithm: 'invalid'"
    )
  })
})
