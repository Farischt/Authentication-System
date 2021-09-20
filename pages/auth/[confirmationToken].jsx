import Link from "next/link"

import Layout from "@/components/layout"

export default function AccountConfirmationPage({ email, first_name }) {
  return (
    <Layout user={null}>
      <h1> Your account is verified ! </h1>
      <p>
        {" "}
        Hey {first_name} ! You're email {email} has been verified, you're
        account is ready ! Next step :{" "}
        <Link href="/auth">
          <a> login </a>
        </Link>{" "}
      </p>
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
