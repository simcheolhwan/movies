interface CreditsCollection {
  movie: CreditsDB
  tv: CreditsDB
}

interface CreditsDB {
  [id: string]: Credits
}

interface Credits {
  cast: People[]
  crew: Crew[]
}

interface People {
  id: number
  name: string
  profile_path: string
}

interface Crew extends People {
  job: string
}
