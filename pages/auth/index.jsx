import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { toast } from "react-toastify"

import AuthApi from "@/client/Auth"
import Layout from "@/components/layout"

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
      const res = await AuthApi.login(credentials)
      setLoading(false)
      toast.info(`Welcome back ${res.data.first_name}`)
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
    <Layout user={null}>
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
        <Link href="/auth/password">
          <a> Forgot password ? </a>
        </Link>
        <button type="submit"> Login </button>
        <Link href="/auth/register">
          <a> Or sign up </a>
        </Link>
      </form>
    </Layout>
  )
}

import { RedirectAuthenticatedUser } from "@/lib/auth"

export const getServerSideProps = async (context) => {
  return (
    (await RedirectAuthenticatedUser(context)) || {
      props: { authorized: true },
    }
  )
}
