import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { auth } from '../api/firebase'
import { useApp } from '../api/hooks'

const SignOut = ({ history }) => {
  const { authenticated, setAuthenticated } = useApp()

  useEffect(() => {
    const signout = async () => {
      await auth.signOut()
      setAuthenticated(false)
    }

    signout()
    // eslint-disable-next-line
  }, [])

  return !authenticated ? <Redirect to="/" replace /> : null
}

export default SignOut
