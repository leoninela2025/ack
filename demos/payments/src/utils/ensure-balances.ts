import { waitForEnter } from "@repo/cli-tools"
import { createPublicClient, erc20Abi, http } from "viem"
import { formatUnits } from "viem/utils"
import type { Chain } from "viem"

/**
 * Ensure the client wallet has a non-zero balance of USDC and ETH
 */
export async function ensureNonZeroBalances(
  chain: Chain,
  address: `0x${string}`,
  usdcAddress: `0x${string}`
) {
  // 2. Make sure the client wallet has been funded
  console.log("ADDRESS: " + address)
  let balanceUsdc = await getErc20Balance(chain, address, usdcAddress)
  let balanceEth = await getEthBalance(chain, address)

  while (balanceUsdc.value === BigInt(0)) {
    console.log(
      "We need to fund this address with testnet USDC and testnet ETH:",
      address
    )

    console.log(
      "You can get testnet tokens from the following faucets:",
      "ETH: https://docs.base.org/chain/network-faucets",
      "USDC: https://faucet.circle.com/"
    )
    console.log("Once funded, press enter to check balance again")
    // await waitForEnter()
    console.log("Attempting to fetch USDC balance...")
    balanceUsdc = await getErc20Balance(chain, address, usdcAddress)
    console.log("USDC balance fetched:", balanceUsdc)
    console.log("Attempting to fetch ETH balance...")
    balanceEth = await getEthBalance(chain, address)
    console.log("ETH balance fetched:", balanceEth)
  }

  console.log("Client wallet balances:")
  console.log("  USDC: ", formatUnits(balanceUsdc.value, balanceUsdc.decimals))
  console.log("   ETH: ", formatUnits(balanceEth.value, balanceUsdc.decimals))

  return { balanceUsdc, balanceEth }
}

async function getEthBalance(chain: Chain, address: `0x${string}`) {
  const publicClient = createPublicClient({
    chain,
    transport: http()
  })

  const balance = await publicClient.getBalance({
    address
  })

  return {
    value: balance,
    decimals: 18
  }
}

async function getErc20Balance(
  chain: Chain,
  address: `0x${string}`,
  contractAddress: `0x${string}`
) {
  const publicClient = createPublicClient({
    chain,
    transport: http()
  })

  // eslint-disable-next-line @cspell/spellchecker
  const [balance, decimals] = await publicClient.multicall({
    contracts: [
      {
        address: contractAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address]
      },
      {
        address: contractAddress,
        abi: erc20Abi,
        functionName: "decimals"
      }
    ]
  })

  console.log(balance)

  if (balance.status !== "success" || decimals.status !== "success") {
    throw new Error("Failed to fetch token data")
  }

  return {
    value: balance.result,
    decimals: decimals.result
  }
}
