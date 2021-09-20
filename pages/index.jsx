import Layout from "@/components/layout"

export default function Home({ user }) {
  return (
    <Layout user={user}>
      <div>
        <h1> Fullstack Auth System</h1>
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
