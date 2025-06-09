export class CredentialVerificationError extends Error {}

export class InvalidCredentialError extends CredentialVerificationError {
  constructor(message = "Invalid credential") {
    super(message)
    this.name = "InvalidCredentialError"
  }
}

export class InvalidControllerClaimError extends CredentialVerificationError {
  constructor(message = "Invalid controller claim") {
    super(message)
    this.name = "InvalidControllerClaimError"
  }
}

export class InvalidCredentialSubjectError extends CredentialVerificationError {
  constructor(message = "Invalid credential subject") {
    super(message)
    this.name = "InvalidCredentialSubjectError"
  }
}

export class UnsupportedProofTypeError extends CredentialVerificationError {
  constructor(message = "Unsupported proof type") {
    super(message)
  }
}

export class InvalidProofError extends CredentialVerificationError {
  constructor(message = "Invalid proof") {
    super(message)
  }
}

export class CredentialExpiredError extends CredentialVerificationError {
  constructor(message = "Credential is expired") {
    super(message)
  }
}

export class CredentialRevokedError extends CredentialVerificationError {
  constructor(message = "Credential is revoked") {
    super(message)
  }
}

export class UntrustedIssuerError extends CredentialVerificationError {
  constructor(message = "Issuer is not a known trusted issuer") {
    super(message)
  }
}

export class UnsupportedCredentialTypeError extends CredentialVerificationError {
  constructor(message = "Unsupported credential type") {
    super(message)
  }
}
