import Link from "next/link"

import styles from "@/styles/pages/auth/confirmation.module.scss"
import Layout from "@/components/layout"

export default function AccountConfirmationPage({ email, first_name }) {
  return (
    <Layout user={null}>
      <div className={styles.container}>
        <div className={styles.main}>
          <h1 className={styles.title}> Your account is verified ! </h1>
          <p className={styles.text}>
            {" "}
            Hey {first_name} ! You're email {email} has been verified, you're
            account is ready ! Next step :{" "}
          </p>
          <Link href="/auth" passHref>
            <button
              className={styles.link}
              className={`${styles.btn} ${styles.btn__primary} ${styles.center}`}
            >
              {" "}
              Login{" "}
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

import Backend from "@/server/index"
import { confirmUserAccount } from "@/lib/auth"

export const getServerSideProps = async (context) => {
  if (await Backend.getAuthenticatedUser(context)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return await confirmUserAccount(context)
}
