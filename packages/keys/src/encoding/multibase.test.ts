import { describe, expect, it } from "vitest"
import {
  bytesToMultibase,
  getMultibaseEncoding,
  isMultibase,
  multibaseToBytes
} from "./multibase"
import type { MultibaseEncoding } from "./multibase"

describe("multibase", () => {
  // Test data: "Hello, World!" in different encodings
  const testBytes = new TextEncoder().encode("Hello, World!")
  const testMultibases = {
    base58btc: "z72k1xXWG59fYdzSNoA",
    base64url: "uSGVsbG8sIFdvcmxkIQ",
    base16: "f48656c6c6f2c20576f726c6421"
  } as const

  describe("bytesToMultibase", () => {
    it("should encode bytes to base58btc by default", () => {
      const result = bytesToMultibase(testBytes)
      expect(result).toBe(testMultibases.base58btc)
    })

    it.each(Object.entries(testMultibases))(
      "should encode bytes to %s",
      (encoding, expected) => {
        const result = bytesToMultibase(
          testBytes,
          encoding as MultibaseEncoding
        )
        expect(result).toBe(expected)
      }
    )
  })

  describe("multibaseToBytes", () => {
    it.each(Object.entries(testMultibases))(
      "should decode %s multibase string to bytes",
      (encoding, multibase) => {
        const result = multibaseToBytes(multibase)
        expect(result).toEqual(testBytes)
      }
    )

    it("should throw on empty string", () => {
      expect(() => multibaseToBytes("")).toThrow("Empty multibase string")
    })

    it("should throw on invalid prefix", () => {
      expect(() => multibaseToBytes("xinvalid")).toThrow(
        "Unsupported multibase prefix"
      )
    })

    it("should throw on invalid base58btc", () => {
      expect(() => multibaseToBytes("zinvalid")).toThrow()
    })
  })

  describe("getMultibaseEncoding", () => {
    it.each(Object.entries(testMultibases))(
      "should detect %s encoding",
      (encoding, multibase) => {
        const result = getMultibaseEncoding(multibase)
        expect(result).toBe(encoding)
      }
    )

    it("should return undefined for empty string", () => {
      expect(getMultibaseEncoding("")).toBeUndefined()
    })

    it("should return undefined for invalid prefix", () => {
      expect(getMultibaseEncoding("xinvalid")).toBeUndefined()
    })
  })

  describe("isMultibase", () => {
    it.each(Object.entries(testMultibases))(
      "should validate %s multibase string",
      (encoding, multibase) => {
        expect(isMultibase(multibase)).toBe(true)
      }
    )

    it("should reject non-string values", () => {
      expect(isMultibase(null)).toBe(false)
      expect(isMultibase(undefined)).toBe(false)
      expect(isMultibase(123)).toBe(false)
      expect(isMultibase({})).toBe(false)
    })

    it("should reject empty string", () => {
      expect(isMultibase("")).toBe(false)
    })

    it("should reject string with invalid prefix", () => {
      expect(isMultibase("xinvalid")).toBe(false)
    })

    it("should reject string with invalid encoding", () => {
      expect(isMultibase("zinvalid")).toBe(false)
    })
  })

  describe("roundtrip", () => {
    it.each(Object.entries(testMultibases))(
      "should roundtrip through %s encoding",
      (encoding, multibase) => {
        const bytes = multibaseToBytes(multibase)
        const result = bytesToMultibase(bytes, encoding as MultibaseEncoding)
        expect(result).toBe(multibase)
      }
    )
  })
})
