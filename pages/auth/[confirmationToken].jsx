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
import Database from "@/server/database"

export const getServerSideProps = async (context) => {
  if (await Backend.getAuthenticatedUser(context)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const { confirmationToken } = context.params
  const validToken =
    confirmationToken &&
    (await Database.AccountConfirmationToken.findByPk(confirmationToken))

  if (!validToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const user = await Database.User.get(validToken.user_id)

  if (!user || user.verified) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }
  user.verified = true
  await user.save()
  // await validToken.destroy()

  return {
    props: {
      success: true,
      email: user.email,
      first_name: user.first_name,
    },
  }
}
