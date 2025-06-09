export function buildUrl(host: string, port: string | number, path: string) {
  const url = new URL(path, `http://${host}:${port}`)
  return url.toString()
}
