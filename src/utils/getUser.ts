import { decode, verify } from "jsonwebtoken"

import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"

export default async function getUser(token: string) {
	try {
		if (!token) throw new CustomError("No token provided")

		try {
			verify(token, String(process.env.JWT_SECRET_KEY))
		} catch (e) {
			throw new CustomError("Token invalid")
		}

		const decodedToken = decode(token, {
			json: true,
		})

		if (decodedToken?.iss !== "Findzy" || !decodedToken?.sub) {
			throw new CustomError("Token invalid")
		}

		const user = await prisma.user.findUnique({
			where: { id: decodedToken.sub },
			select: {
				name: true,
				email: true,
				birthdate: true,
			},
		})

		if (!user) throw new CustomError("User not found")

		return {
			...user,
			exp: decodedToken.exp,
		}
	} catch (error) {
		return undefined
	}
}
