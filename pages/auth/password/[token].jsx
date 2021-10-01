import { useState } from "react"
import { useRouter } from "next/router"
import { toast } from "react-toastify"

import styles from "@/styles/pages/auth/password/token.module.scss"
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
      toast.success("Your password has been changed !")
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
      <div className={styles.container}>
        <form className={styles.form} method="PATCH" onSubmit={handleSubmit}>
          <h1 className={styles.title}> Please reset your password ! </h1>
          <input readOnly value={token.email} className={styles.input} />
          <input
            type="password"
            name="newPassword"
            placeholder="Enter a new password !"
            className={styles.input}
            value={data.newPassword}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="repeatPassword"
            placeholder="Re enter your new password"
            className={styles.input}
            value={data.repeatPassword}
            onChange={handleChange}
            required
          />
          {loading && <p className={styles.loading}> loading </p>}
          {error && <p className={styles.error}> {error} </p>}
          <button
            type="submit"
            className={`${styles.btn} ${styles.btn__primary}`}
            disabled={
              data.newPassword !== data.repeatPassword ||
              data.newPassword.length < 8 ||
              loading
            }
          >
            Submit
          </button>
        </form>
      </div>
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
