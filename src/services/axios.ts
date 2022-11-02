import axios from "axios"
import { parseCookies } from "nookies"

interface HeadersData {
	authorization: string
}

export const api = axios.create()

api.interceptors.request.use((config) => {
	const { "findzy.token": token } = parseCookies()

	if (token) {
		config.headers = {
			...config.headers,
			authorization: `Bearer ${token}`,
		}
	}

	return config
})
