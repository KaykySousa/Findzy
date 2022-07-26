interface CustomErrorOptions extends ErrorOptions {
	statusCode?: number
}

export default class CustomError extends Error {
	statusCode?: number

	constructor(message?: string, options?: CustomErrorOptions) {
		super(message, options)
		this.statusCode = options?.statusCode
	}
}
