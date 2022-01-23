import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../api/firebase"
import { useAuth } from "../api/hooks"

const SignOut = () => {
  const navigate = useNavigate()
  const [, setAuthenticated] = useAuth()

  useEffect(() => {
    const signout = async () => {
      await auth.signOut()
      setAuthenticated(false)
    }

    signout()
    navigate("/", { replace: true })
  }, [navigate, setAuthenticated])

  return null
}

export default SignOut
