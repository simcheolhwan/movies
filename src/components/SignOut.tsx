import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { auth } from '../api/firebase'
import { useApp } from '../api/hooks'

const SignOut = () => {
  const { authenticated, setAuthenticated } = useApp()

  useEffect(() => {
    const signout = async () => {
      await auth.signOut()
      setAuthenticated(false)
    }

    signout()
    // eslint-disable-next-line
  }, [])

  return !authenticated ? <Redirect to="/" /> : null
}

export default SignOut
