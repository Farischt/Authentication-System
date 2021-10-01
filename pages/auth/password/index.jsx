import { useState } from "react"
import { toast } from "react-toastify"

import styles from "@/styles/pages/auth/password/index.module.scss"
import AuthApi from "@/client/Auth"
import Layout from "@/components/layout"

export default function PasswordRequestPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleEmailChange = (event) => {
    if (error) setError("")
    if (success) setSuccess("")
    setEmail(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await AuthApi.requestPassowrd(email)
      setSuccess("An email has been sent !")
      toast.success("An email has been sent !")
      setLoading(false)
    } catch (err) {
      if (err.response.data.error) {
        switch (err.response.data.error) {
          case "invalid_email":
            setError("Your email is invalid !")
            break
          case "already_sent":
            setError("An email has already been sent !")
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
        <form className={styles.form} method="POST" onSubmit={handleSubmit}>
          <h1 className={styles.title}> You forgot your password ? </h1>
          <input
            type="email"
            placeholder="Enter your email address..."
            className={styles.input}
            value={email}
            onChange={handleEmailChange}
            required
          />
          {loading && <p className={styles.loading}> Loading... </p>}
          {error && <p className={styles.error}> {error} </p>}
          {success && <p className={styles.success}> {success} </p>}
          <button
            className={`${styles.btn} ${styles.btn__primary}`}
            type="submit"
            disabled={loading || email.length < 2}
          >
            Submit
          </button>
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
