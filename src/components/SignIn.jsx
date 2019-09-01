import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { auth } from '../api/firebase'
import { useApp } from '../api/hooks'

const SignIn = ({ history }) => {
  const { authenticated, setAuthenticated } = useApp()
  const [values, setValues] = useState({ email: '', password: '' })
  const { email, password } = values

  const handleChange = e => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const submit = async e => {
    e.preventDefault()
    try {
      await auth.signInWithEmailAndPassword(email, password)
      setAuthenticated(true)
    } catch (error) {
      alert(error.message)
    }
  }

  return authenticated ? (
    <Redirect to="/" replace />
  ) : (
    <form onSubmit={submit}>
      <input type="email" name="email" value={email} onChange={handleChange} />
      <input
        type="password"
        name="password"
        value={password}
        onChange={handleChange}
      />
      <button type="submit" />
    </form>
  )
}

export default SignIn
