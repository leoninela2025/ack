# ACK Identity Protocol (ACK-ID) TypeScript SDK

> Verifiable Identity for Agent Interactions

The Agent Commerce Kit Identity Protocol (ACK-ID) TypeScript SDK provides tools for establishing verifiable relationships between AI agents and their controlling entities using W3C Verifiable Credentials.

ACK-ID is part of the [Agent Commerce Kit](https://www.agentcommercekit.com).

## Installation

```sh
npm i @agentcommercekit/ack-id
# or
pnpm add @agentcommercekit/ack-id
```

## Usage

### Creating Controller Credentials

```ts
import { createControllerCredential } from "@agentcommercekit/ack-id"
import { createDidWebUri } from "@agentcommercekit/did"

// Create DIDs for agent and controller
const controllerDid = createDidWebUri("https://controller.example.com")
const agentDid = createDidWebUri("https://agent.example.com")

// Create a credential establishing the controller relationship
const credential = createControllerCredential({
  subject: agentDid,
  controller: controllerDid,
  // Optional id and issuer can be provided
  id: "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
  issuer: controllerDid // Defaults to controller if not provided
})
```

### Verifying a controller credential

```ts
import { getControllerClaimVerifier } from "@agentcommercekit/ack-id"
import { getDidResolver } from "@agentcommercekit/did"
import { verifyParsedCredential } from "@agentcommercekit/vc"

// Get the verifier for controller credentials
const verifier = getControllerClaimVerifier()
const resolver = getDidResolver()

// Verify the credential using verification logic from vc package.
try {
  await verifyParsedCredential(controllerCredential, {
    resolver,
    verifiers: [verifier],
    trustedIssuers: [controllerDid] // Optional: list of trusted issuers
  })
  console.log("Credential verified successfully")
} catch (error) {
  console.error("Verification failed:", error)
}
```

### Type Guards for Credential Validation

```ts
import {
  isControllerCredential,
  isControllerClaim
} from "@agentcommercekit/ack-id"

// Check if a credential is specifically a controller credential
isControllerCredential(credential)

// Check if a credential subject has the controller claim structure
isControllerClaim(credential.credentialSubject)
```

## API Reference

### Controller Credentials

- `createControllerCredential(params: CreateControllerCredentialParams): W3CCredential` - Creates a verifiable credential that establishes a controller relationship
- `isControllerCredential(credential: unknown): credential is ControllerCredential` - Type guard for controller credentials
- `isControllerClaim(credentialSubject: CredentialSubject): boolean` - Type guard for controller claims
- `getControllerClaimVerifier(): ClaimVerifier` - Returns a verifier that can validate controller claims

### Schema Validation

```ts
// Zod schema
import { controllerClaimSchema } from "@agentcommercekit/ack-id/schemas/zod"

// Valibot schema
import { controllerClaimSchema } from "@agentcommercekit/ack-id/schemas/valibot"
```

## Agent Commerce Kit Version

This SDK supports Agent Commerce Kit version `2025-05-04`.

See the ACK [Versioning](https://agentcommercekit.com/resources/versioning) documentation for more information.

## License (MIT)

Copyright (c) 2025 [Catena Labs, Inc](https://catenalabs.com).
