import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { toast } from "react-toastify"

import styles from "@/styles/pages/auth/index.module.scss"
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
      <div className={styles.container}>
        <form className={styles.form} method="POST" onSubmit={handleLogin}>
          <h1 className={styles.title}> Login </h1>
          <input
            type="email"
            name="email"
            placeholder="Email..."
            className={styles.input}
            value={credentials.email}
            onChange={handleCredentialsChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password..."
            className={styles.input}
            value={credentials.password}
            onChange={handleCredentialsChange}
            required
            minLength={8}
          />
          {loading && <p className={styles.loading}> Loading... </p>}
          {error && <p className={styles.error}> {error} </p>}
          <Link href="/auth/password">
            <a className={styles.link}> Forgot password ? </a>
          </Link>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btn__primary}`}
            disabled={
              credentials.email.length < 2 ||
              credentials.password.length < 8 ||
              loading
            }
          >
            Login
          </button>
          <Link href="/auth/register">
            <a className={styles.link}> Or sign up </a>
          </Link>
        </form>
      </div>
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
