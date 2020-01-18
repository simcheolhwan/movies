interface IndexedCredits {
  isFetched: boolean
  collection: CreditsCollection
  collect: (media_type: MediaType, creditsDB: CreditsDB) => Promise<void>
}
