import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

import AuthApi from "@/client/Auth"

export default function LoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCredentialsChange = (event) => {
    if (error) setError("")

    setCredentials((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await AuthApi.login(credentials)
      setLoading(false)
      router.push("/")
    } catch (error) {
      if (error.response.data.error) {
        switch (error.response.data.error) {
          case "invalid_credentials":
            setError("Invalid credentials !")
            break
          default:
            setError("An unknown error occured !")
        }
      } else {
        setError("An unknown error occured !")
      }
      setLoading(false)
    }
  }

  return (
    <form method="POST" onSubmit={handleLogin}>
      <h1> Login Page </h1>
      <input
        type="text"
        name="email"
        placeholder="Email..."
        value={credentials.email}
        onChange={handleCredentialsChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password..."
        value={credentials.password}
        onChange={handleCredentialsChange}
        required
      />
      {loading && <p> Loading... </p>}
      {error && <p> {error} </p>}
      <Link href="/auth/register">
        <a> Register </a>
      </Link>
      <button type="submit"> Login </button>
    </form>
  )
}

import Backend from "@/server/index"

export const getServerSideProps = async (context) => {
  if (await Backend.getAuthenticatedUser(context)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      authorized: true,
    },
  }
}
