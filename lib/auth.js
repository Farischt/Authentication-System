import Backend from "@/server/index"

/**
 * @param  {NextPageContext} context
 */
export const RedirectAuthenticatedUser = async (context) => {
  if (await Backend.getAuthenticatedUser(context)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      authorized: true,
    },
  }
}
