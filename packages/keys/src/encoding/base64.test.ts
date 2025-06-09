import { describe, expect, test } from "vitest"
import { base64ToBytes, bytesToBase64, isBase64 } from "./base64"

describe("base64 encoding and decoding", () => {
  test("converts bytes to base64 string", () => {
    const bytes = new Uint8Array([1, 2, 3, 4])
    const base64 = bytesToBase64(bytes)
    expect(base64).toBe("AQIDBA")
  })

  test("converts base64 string to bytes", () => {
    const base64 = "AQIDBA"
    const bytes = base64ToBytes(base64)
    expect(bytes).toEqual(new Uint8Array([1, 2, 3, 4]))
  })

  test("roundtrip base64 encoding", () => {
    const original = new Uint8Array([1, 2, 3, 4])
    const base64 = bytesToBase64(original)
    const bytes = base64ToBytes(base64)
    expect(bytes).toEqual(original)
  })
})

describe("isBase64", () => {
  test("returns true for valid base64 strings", () => {
    expect(isBase64("AQIDBA")).toBe(true)
    expect(isBase64("SGVsbG8sIFdvcmxkIQ")).toBe(true) // "Hello, World!"
  })

  test("returns false for invalid base64 strings", () => {
    expect(isBase64("not base64")).toBe(false)
    expect(isBase64("AQIDBA!")).toBe(false)
    expect(isBase64(123)).toBe(false)
  })
})
