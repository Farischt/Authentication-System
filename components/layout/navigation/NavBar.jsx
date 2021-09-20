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
        <Link href="/">
          <a> Home </a>
        </Link>
        {!user && (
          <>
            <Link href="/auth">
              <a> Login </a>
            </Link>
            <Link href="/auth/register">
              <a> Sign up </a>
            </Link>
          </>
        )}
      </nav>
      {user && (
        <>
          <p> Connected as {user.first_name} </p>{" "}
          {loading && <p> Loading... </p>}
          <button onClick={handleLogout} disabled={loading}>
            Log out
          </button>
        </>
      )}
    </div>
  )
}
