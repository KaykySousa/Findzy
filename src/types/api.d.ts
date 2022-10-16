export interface LoginResponseData {
	token: string
	accountType: string
	data: {
		name: string
		email: string
	}
}

export interface UserRegisterResponseData {
	token: string
	user: {
		name: string
		email: string
		birthdate: string
	}
}

export interface CompanyRegisterResponseData {
	token: string
	user: {
		name: string
		email: string
		birthdate: string
	}
}
