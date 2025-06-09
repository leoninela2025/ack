import { BitBuffer } from "bit-buffers"

export function compressBitString(bitString: string) {
  const indices = []

  for (let i = 0; i < bitString.length; i++) {
    if (bitString[i] === "1") {
      indices.push(i)
    }
  }

  return BitBuffer.fromIndexArray(indices, bitString.length).toBitstring()
}
