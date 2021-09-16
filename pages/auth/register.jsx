import { useState } from "react"
import Link from "next/link"

import AuthApi from "@/client/Auth"

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
    <form method="POST" onSubmit={handleRegister}>
      <h1> Sign up </h1>
      <input
        type="text"
        name="first_name"
        placeholder="First name"
        value={user.first_name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="last_name"
        placeholder="Last name"
        value={user.last_name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={user.password}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="repeatPassword"
        placeholder="Password"
        value={user.repeatPassword}
        onChange={handleChange}
        required
      />
      {loading && <p> loading </p>}
      {error && <p> {error} </p>}
      <Link href="/auth">
        <a> Log in </a>
      </Link>
      <button
        type="submit"
        disabled={
          user.password !== user.repeatPassword || user.password.length < 8
        }
      >
        {" "}
        Send{" "}
      </button>
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
