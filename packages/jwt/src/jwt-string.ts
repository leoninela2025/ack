/**
 * A JWT String, which at a minimum has 3 segments
 */
export type JwtString = `${string}.${string}.${string}`

/**
 * Checks if a string is formatted correctly as a JWT string. This
 * does not verify the JWT's integrity, only that it is formatted correctly.
 *
 * @param value - The value to check
 * @returns `true` if the value is a valid JWT string, `false` otherwise
 */
export function isJwtString(value: unknown): value is JwtString {
  return (
    typeof value === "string" &&
    /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/.test(value)
  )
}
