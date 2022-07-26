export interface LoginResponseData {
	token: string
	user: {
		name: string
		email: string
		birthdate: string
	}
}

export interface RegisterResponseData {
	token: string
	user: {
		name: string
		email: string
		birthdate: string
	}
}
