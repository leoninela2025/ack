import type { DidDocument } from "./did-document"
import type { DidUri } from "./did-uri"

export interface DidUriWithDocument {
  did: DidUri
  didDocument: DidDocument
}
