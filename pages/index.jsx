import Layout from "@/components/layout"
import Link from "next/link"

import styles from "@/styles/pages/index.module.scss"

export default function Home({ user }) {
  return (
    <Layout user={user}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}> Welcome to AuthSys </h1>
          <p className={styles.text}>
            A FullStack authentication application made from scratch by{" "}
            <strong>
              {" "}
              <a
                className={styles.link}
                href="https://github.com/Farischt"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                Farischt{" "}
              </a>{" "}
            </strong>
          </p>
          <p className={styles.text}>
            <a
              className={styles.link}
              href="https://github.com/Farischt/Authentication-System"
              target="_blank"
              rel="noreferrer"
            >
              Documentation here !
            </a>
          </p>
          {!user ? (
            <Link href="/auth" passhref>
              <button
                className={`${styles.btn} ${styles.btn__primary} ${styles.center}`}
              >
                Get Started !
              </button>
            </Link>
          ) : (
            <p className={styles.text}> Logged in as {user.first_name} </p>
          )}
        </div>
      </div>
    </Layout>
  )
}

import Backend from "@/server/index"

export const getServerSideProps = async (context) => {
  const user = await Backend.getAuthenticatedUser(context)

  return {
    props: {
      user: user && {
        first_name: user.first_name,
      },
    },
  }
}
