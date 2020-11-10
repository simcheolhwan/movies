type CrewID = keyof Omit<Crew, "id">
type Q = { crew: [CrewID, string]; cast: boolean }
