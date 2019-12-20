import React, { useState } from 'react'
import Form from './Form'
import Results from './Results'

const Query = () => {
  const [params, setParams] = useState<Q>(['job', ''])

  return (
    <>
      <Form onSubmit={setParams} />
      <Results q={params} />
    </>
  )
}

export default Query
