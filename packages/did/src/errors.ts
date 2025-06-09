export class DidResolutionError extends Error {}

export class DidDocumentNotFoundError extends DidResolutionError {
  constructor(message = "DID document not found") {
    super(message)
    this.name = "DidDocumentNotFoundError"
  }
}

export class UnsupportedDidMethodError extends DidResolutionError {
  constructor(message = "Unsupported DID method") {
    super(message)
    this.name = "UnsupportedDidMethodError"
  }
}

export class InvalidDidUriError extends DidResolutionError {
  constructor(message = "Invalid DID URI") {
    super(message)
    this.name = "InvalidDidUriError"
  }
}

export class InvalidDidControllerError extends DidResolutionError {
  constructor(message = "Invalid DID controller") {
    super(message)
    this.name = "InvalidDidControllerError"
  }
}
