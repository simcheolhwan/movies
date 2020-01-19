interface CreditsCollection {
  movie: CreditsDB
  tv: CreditsDB
}

interface CreditsDB {
  [id: string]: Credits
}

interface Credits {
  cast: Person[]
  crew: Crew[]
}

interface Person {
  id: number
  name: string
  profile_path: string
}

interface Crew extends Person {
  job: string
}
