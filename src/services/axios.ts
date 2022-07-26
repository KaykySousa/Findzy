import axios from "axios"
import { parseCookies } from "nookies"

const { "findzy.token": token } = parseCookies()

export const api = axios.create()

if (token) {
	api.defaults.headers.common["authorization"] = `Bearer ${token}`
}
