import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import styles from "./NavBar.module.scss"
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
    <header className={styles.container}>
      <div className={styles.logoBox}>
        <div className={styles.logo}>
          <Link href="/" passHref>
            <h2 className={styles.title}> AuthSys </h2>
          </Link>
        </div>
      </div>
      <nav className={styles.navigation}>
        <ul className={styles.list}>
          <Link href="/">
            <a className={styles.link}>Home</a>
          </Link>
          {user && (
            <Link href="/profile">
              <a className={styles.link}>Profile</a>
            </Link>
          )}
          {!user && (
            <Link href="/auth">
              <a className={styles.link}>Login</a>
            </Link>
          )}
        </ul>
      </nav>

      {user && (
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.btn__primary}`}
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? "Loading..." : "Log out"}
          </button>
        </div>
      )}
    </header>
  )
}
