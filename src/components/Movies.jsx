import React, { useState, useEffect } from 'react'
import { db } from '../firebase'

const Movies = () => {
  const [list, setList] = useState([])

  useEffect(() => {
    db.ref('movies').on('value', snapshot => setList(snapshot.val()))
  }, [])

  return (
    <ul>
      {Object.entries(list).map(([key, value]) => (
        <li key={key}>
          <Movie {...value} />
        </li>
      ))}
    </ul>
  )
}

const width = 342 / 2
const Movie = ({ title, poster_path }) => (
  <article>
    <img
      src={`http://image.tmdb.org/t/p/w${2 * width}${poster_path}`}
      width={width}
      alt=""
    />
    <h1>{title}</h1>
  </article>
)

export default Movies
