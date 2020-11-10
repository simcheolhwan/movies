import React, { useEffect } from "react"
import { Redirect } from "react-router-dom"
import { auth } from "../api/firebase"
import { useAuth } from "../api/hooks"

const SignOut = () => {
  const [authenticated, setAuthenticated] = useAuth()

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
