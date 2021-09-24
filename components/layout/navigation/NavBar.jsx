import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import AuthApi from "@/client/Auth"

export default function NavBar({ user }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await AuthApi.logout()
      setLoading(false)
      router.replace(router.asPath)
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  return (
    <div>
      <nav>
        {user && <p> Welcome back {user.first_name} </p>}
        <Link href="/">
          <a>Home</a>
        </Link>
        {user && (
          <Link href="/profile">
            <a>Profile</a>
          </Link>
        )}
      </nav>
      {!user && (
        <div>
          <Link href="/auth">
            <a>Login</a>
          </Link>
        </div>
      )}
      {user && (
        <div>
          <button onClick={handleLogout} disabled={loading}>
            {loading ? "Loading..." : "Log out"}
          </button>
        </div>
      )}
    </div>
  )
}
