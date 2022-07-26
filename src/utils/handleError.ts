import CustomError from "@/utils/CustomError"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"

export default function handleError(error: unknown) {
	if (error instanceof Error) {
		let message = error.message || "Erro desconhecido"
		let statusCode

		if (error instanceof CustomError) {
			statusCode = error.statusCode
		}

		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				message = `E-mail já cadastrado`
			}
		}

		return {
			error: message[0].toUpperCase() + message.slice(1),
			statusCode: statusCode || 400,
		}
	}

	if (typeof error !== "string") {
		return {
			error: JSON.stringify(error),
			statusCode: 400,
		}
	}

	return {
		error: error || "Erro desconhecido",
		statusCode: 400,
	}
}
