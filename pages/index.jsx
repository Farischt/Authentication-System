import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import AuthApi from "@/client/Auth"

export default function Home({ user }) {
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
      <h1> Fullstack Auth System</h1>
      {!user && (
        <nav>
          <Link href="/auth/register">
            <a> register </a>
          </Link>
          <br /> {/* to be deleted */}
          <Link href="/auth">
            <a> login </a>
          </Link>
        </nav>
      )}
      {user && (
        <>
          <p> Connected as {user.first_name} </p>{" "}
          <button onClick={handleLogout} disabled={loading}>
            {loading ? "Loading..." : "Log out"}
          </button>
        </>
      )}
    </div>
  )
}

import Backend from "@/server/index"

export const getServerSideProps = async (context) => {
  const user = await Backend.getAuthenticatedUser(context)

  return {
    props: {
      user: user && {
        first_name: user.first_name,
      },
    },
  }
}
