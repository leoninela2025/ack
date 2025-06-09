import path from "node:path"
import { didPkhChainIds } from "agentcommercekit"
import { createPublicClient, http } from "viem"
import { baseSepolia } from "viem/chains"

/**
 * URLs for the Server and Receipt Service
 */
export const SERVER_URL = "http://localhost:4567"
export const RECEIPT_SERVICE_URL = "http://localhost:4568"
export const PAYMENT_SERVICE_URL = "http://localhost:4569"
export const X402_FACILITATOR_URL = "http://localhost:3002"
export const X402_FACILITATOR_SPENDER_ADDRESS = "0x1f47CEd308dcA4a1e656D6Ab5259d7D8814b7B47"

/**
 * .env file location
 */
const currentDir = path.dirname(new URL(import.meta.url).pathname)
export const envFilePath = path.resolve(currentDir, "..", ".env")

/**
 * Configure the EVM chain you'd like to use:
 */
export const chain = baseSepolia
export const chainId = didPkhChainIds.evm.baseSepolia
export const usdcAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
export const publicClient = createPublicClient({
  chain,
  transport: http()
})
