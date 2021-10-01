import { useState } from "react"
import Link from "next/link"
import { toast } from "react-toastify"

import styles from "@/styles/pages/auth/register.module.scss"
import AuthApi from "@/client/Auth"
import Layout from "@/components/layout"

export default function RegisterPage({}) {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    repeatPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (event) => {
    if (error) setError("")
    setUser((state) => ({ ...state, [event.target.name]: event.target.value }))
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await AuthApi.register(user)
      setLoading(false)
      toast.success("Successfully signed up !")
    } catch (error) {
      if (error.response.data.error) {
        switch (error.response.data.error) {
          case "email_taken":
            setError("Email adress already used !")
            break
          case "password_lowercase_weakness":
            setError(
              "Your password must contain at least one lowercase caracter !"
            )
            break
          case "password_uppercase_weakness":
            setError(
              "Your password must contain at least one uppercase caracter !"
            )
            break
          case "password_number_weakness":
            setError("Your password must contain at least one digit !")
            break
          case "password_special_weakness":
            setError(
              "Your password must contain at least one special caracter !"
            )
            break
          default:
            setError("An unknown error has occured !")
        }
      } else {
        setError("An unknow error has occured !")
      }
      setLoading(false)
    }
  }

  return (
    <Layout user={null}>
      <div className={styles.container}>
        <form className={styles.form} method="POST" onSubmit={handleRegister}>
          <h1 className={styles.title}> Sign up </h1>
          <input
            type="text"
            name="first_name"
            placeholder="First name"
            className={styles.input}
            value={user.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last name"
            className={styles.input}
            value={user.last_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={styles.input}
            value={user.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            value={user.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <input
            type="password"
            name="repeatPassword"
            placeholder="Password"
            className={styles.input}
            value={user.repeatPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
          {loading && <p className={styles.loading}> Loading... </p>}
          {error && <p className={styles.error}> {error} </p>}
          <button
            type="submit"
            className={`${styles.btn} ${styles.btn__primary}`}
            disabled={
              user.password !== user.repeatPassword ||
              user.password.length < 8 ||
              loading
            }
          >
            Submit
          </button>
          <Link href="/auth">
            <a className={styles.link}> Or login </a>
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
