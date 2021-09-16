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

  async requestPassowrd() {}

  async resetPassword() {}
}

export default new AuthApi()
