import { addressFromDidPkhUri, isDidPkhUri } from "agentcommercekit"
import { isAddress } from "viem/utils"

export function asAddress(address: string) {
  address = isDidPkhUri(address) ? addressFromDidPkhUri(address) : address
  if (!isAddress(address)) {
    throw new Error("Invalid address")
  }
  return address
}
