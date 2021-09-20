import { useState } from "react"
import { useRouter } from "next/router"

import AuthApi from "@/client/Auth"
import Layout from "@/components/layout"

export default function PasswordResetPage({ token }) {
  const router = useRouter()
  const [data, setData] = useState({
    resetToken: token && token.id,
    newPassword: "",
    repeatPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (event) => {
    if (error) setError("")
    setData((state) => ({ ...state, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await AuthApi.resetPassword(data)
      setLoading(false)
      router.push("/")
    } catch (error) {
      if (error.response.data.error) {
        switch (error.response.data.error) {
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
          case "expired_token":
            setError("Expired session, please make a new password request !")
            break
          default:
            setError("An unknown error occured !")
        }
      } else {
        setError("An unknow error occured !")
      }
      setLoading(false)
    }
  }

  return (
    <Layout user={null}>
      <form method="PATCH" onSubmit={handleSubmit}>
        <h1> Please reset your password ! </h1>
        <input readOnly value={token.email} />
        <input
          type="password"
          name="newPassword"
          placeholder="Enter a new password !"
          value={data.newPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="repeatPassword"
          placeholder="Re enter your new password"
          value={data.repeatPassword}
          onChange={handleChange}
        />
        {loading && <p> loading </p>}
        {error && <p> {error} </p>}
        <button
          type="submit"
          disabled={
            data.newPassword !== data.repeatPassword ||
            data.newPassword.length < 8 ||
            loading
          }
        >
          Submit
        </button>
      </form>
    </Layout>
  )
}

import Backend from "@/server/index"
import Database from "@/server/database"
import { isUUID } from "@/lib/validator"

export const getServerSideProps = async (context) => {
  if (await Backend.getAuthenticatedUser(context)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const token =
    context.params.token &&
    isUUID(context.params.token) &&
    (await Database.PasswordResetToken.findByPk(context.params.token))

  if (!token || token.createdAt < Date.now() - 60 * 60 * 1000) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const user = await token.getUser()

  return {
    props: {
      token: {
        id: token.token,
        email: user.email,
      },
    },
  }
}
