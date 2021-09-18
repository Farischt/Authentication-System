import cookie from "cookie"
import Database from "@/server/database"

class Backend {
  /**
   * @param  {NextApiContext} context
   * @returns {String}
   */
  getIpAddress(context) {
    console.log(context.req.socket.remoteAddress)
    return context.req.socket.remoteAddress
  }

  /**
   * @param  {NextApiContext} context
   * @param  {String} token
   */
  async login(context, token) {
    context.res.setHeader(
      "Set-Cookie",
      cookie.serialize("authToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 60 * 60,
        path: "/",
      })
    )
  }

  /**
   * @param  {NextApiContext} context
   * @returns {Object}
   */
  async logout(context) {
    const token =
      context.req.cookies.authToken &&
      (await Database.AuthToken.findByPk(context.req.cookies.authToken))
    token && (await token.destroy())

    context.res.setHeader(
      "Set-Cookie",
      cookie.serialize("authToken", null, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      })
    )
  }

  /**
   * @param  {NextApiContext} context
   * @returns {Object}
   */
  async getAuthenticatedUser(context) {
    if (!context.req.cookies.authToken) return null

    const token = await Database.AuthToken.findByPk(
      context.req.cookies.authToken
    )

    if (!token) return null
    else if (this.hasAuthTokenExpired(token)) {
      context.res.setHeader(
        "Set-Cookie",
        cookie.serialize("authToken", null, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 0,
          path: "/",
        })
      )
      await token.destroy()
      return null
    }

    return (await Database.User.findByPk(token.user_id)) || null
  }

  /**
   * @param  {Object} token
   * @returns {Boolean}
   */
  hasAuthTokenExpired(token) {
    return Date.now() - new Date(token.createdAt).getTime() + 60 * 60 <= 0
  }
}

export default new Backend()
