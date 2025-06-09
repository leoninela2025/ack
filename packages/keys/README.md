# @agentcommercekit/keys

Methods for dealing with cryptographic keys on multiple curves (secp256k1, Ed25519).

This package is part of the [Agent Commerce Kit](https://www.agentcommercekit.com).

## Installation

```sh
npm i @agentcommercekit/keys
# or
pnpm add @agentcommercekit/keys
```

## Usage

```ts
import {
  generateKeypair,
  keypairToBase58,
  keypairToJwk,
  formatPublicKey
} from "@agentcommercekit/keys"

// Generate and format keypairs
const keypair = await generateKeypair("secp256k1")
const base58Keypair = keypairToBase58(keypair)
const jwkKeypair = keypairToJwk(keypair)

// Format public keys
const hexPublicKey = formatPublicKey(keypair, "hex")
const jwkPublicKey = formatPublicKey(keypair, "jwk")
const multibasePublicKey = formatPublicKey(keypair, "multibase")
const base58PublicKey = formatPublicKey(keypair, "base58")
```

## API

### Keypair Operations

- `generateKeypair(algorithm: KeypairAlgorithm, privateKeyBytes?: Uint8Array): Promise<Keypair>`
- `keypairToBase58(keypair: Keypair): KeypairBase58`
- `keypairFromBase58(base58: KeypairBase58): Keypair`
- `keypairToJwk(keypair: Keypair): PrivateKeyJwk`
- `jwkToKeypair(jwk: PrivateKeyJwk): Keypair`

### Public Key Formatting

- `formatPublicKey<T extends PublicKeyFormat>(keypair: Keypair, format: T): PublicKeyTypeMap[T]`
- `formatPublicKeyHex(keypair: Keypair): string`
- `formatPublicKeyJwk(keypair: Keypair): PublicKeyJwk`
- `formatPublicKeyMultibase(keypair: Keypair): string`
- `formatPublicKeyBase58(keypair: Keypair): string`
- `getCompressedPublicKey(keypair: Keypair): Uint8Array`

### Additional Exports

Encoding utilities are also available via subpath exports:

```ts
import { bytesToBase58, base58ToBytes } from "@agentcommercekit/keys/encoding"
```

## License (MIT)

Copyright (c) 2025 [Catena Labs, Inc](https://catenalabs.com).
