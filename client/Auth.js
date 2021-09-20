import axios from "axios"

class AuthApi {
  constructor() {
    this.URI = "/api/auth"
  }

  async login(credentials) {
    return credentials && (await axios.post(`${this.URI}/login`, credentials))
  }

  async register(credentials) {
    return (
      credentials && (await axios.post(`${this.URI}/register`, credentials))
    )
  }

  async logout() {
    return await axios.post(`${this.URI}/logout`)
  }

  async requestPassowrd(email) {
    return await axios.post(`${this.URI}/password/request`, {
      email,
    })
  }

  async resetPassword(passwordsData) {
    return await axios.patch(`${this.URI}/password/confirm`, passwordsData)
  }
}

export default new AuthApi()
