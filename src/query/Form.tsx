import { useState } from "react"

interface Props {
  onSubmit: React.Dispatch<React.SetStateAction<Q["crew"]>>
}

const Form = ({ onSubmit }: Props) => {
  const [key, setKey] = useState<CrewID>("job")
  const [value, setValue] = useState("")

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    onSubmit([key, value])
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={key} onChange={(e) => setKey(e.target.value as CrewID)}>
        <option value="name">Name</option>
        <option value="job">Job</option>
      </select>

      <input type="search" value={value} onChange={(e) => setValue(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  )
}

export default Form
