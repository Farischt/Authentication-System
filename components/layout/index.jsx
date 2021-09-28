import Navbar from "./navigation/NavBar"
import styles from "./index.module.scss"

export default function Layout({ children, user }) {
  return (
    <>
      <Navbar user={user} />
      <div className={styles.main}>{children}</div>
    </>
  )
}
