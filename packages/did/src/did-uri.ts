export type DidUri = `did:${string}:${string}`

/**
 * Check if a value is a did uri
 *
 * @param val - The value to check
 * @returns `true` if the value is a did uri, `false` otherwise
 */
export function isDidUri(val: unknown): val is DidUri {
  return (
    typeof val === "string" &&
    val.startsWith("did:") &&
    val.split(":").length >= 3
  )
}
