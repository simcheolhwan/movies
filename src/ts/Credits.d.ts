interface CreditDB {
  [id: string]: Credit
}

interface CreditsDB {
  movie: CreditDB
  tv: CreditDB
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
