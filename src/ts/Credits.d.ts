interface CreditsCollection {
  movie: CreditDB
  tv: CreditDB
}

interface CreditDB {
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
