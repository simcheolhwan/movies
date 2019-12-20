import React, { useState } from 'react'

interface Props {
  onSubmit: React.Dispatch<React.SetStateAction<Q>>
}

const Form = ({ onSubmit }: Props) => {
  const [key, setKey] = useState<Q[0]>('job')
  const [value, setValue] = useState('')

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    onSubmit([key, value])
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={key} onChange={e => setKey(e.target.value as Q[0])}>
        <option value="name">Name</option>
        <option value="job">Job</option>
      </select>

      <input
        type="search"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  )
}

export default Form
