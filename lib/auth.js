import Backend from "@/server/index"
import Database from "@/server/database"
import { isUUID } from "./validator"

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
}

/**
 * @param  {NextPageContext} context
 */
export const confirmUserAccount = async (context) => {
  const { confirmationToken } = context.params

  const validToken =
    confirmationToken &&
    isUUID(confirmationToken) &&
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
