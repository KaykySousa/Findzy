import CustomError from "@/utils/CustomError"
import { decode, JwtPayload, verify } from "jsonwebtoken"

type decodedTokenData =
	| (JwtPayload & {
			accountType?: "user" | "company" | "admin"
	  })
	| null

export default function validateToken(token: string | undefined) {
	try {
		if (!token) throw new CustomError("No token provided")

		try {
			verify(token, String(process.env.JWT_SECRET_KEY))
		} catch (e) {
			throw new CustomError("Token invalid")
		}

		const decodedToken: decodedTokenData = decode(token, {
			json: true,
		})

		if (decodedToken?.iss !== "Findzy" || !decodedToken?.sub) {
			throw new CustomError("Token invalid")
		}

		return decodedToken
	} catch (error) {
		return undefined
	}
}
