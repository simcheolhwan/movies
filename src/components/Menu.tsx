import { Link } from "react-router-dom"
import { useAuth } from "../api/hooks"

const Menu = () => {
  const [authenticated] = useAuth()

  const list = !authenticated
    ? [{ label: "Sign in", to: "/signin" }]
    : [
        { label: "Collect", to: "/collect" },
        { label: "Query", to: "/query" },
        { label: "Sign out", to: "/signout" },
      ]

  return (
    <>
      {list.map(({ label, to }) => (
        <Link to={to} key={to}>
          {label}
        </Link>
      ))}
    </>
  )
}

export default Menu
