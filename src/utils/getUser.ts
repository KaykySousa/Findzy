import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import validateToken from "./validateToken"

export default async function getUser(token: string) {
	try {
		const decodedToken = validateToken(token)

		if (!decodedToken) throw new CustomError("Token invalid")

		const user = await prisma.user.findUnique({
			where: { id: decodedToken.sub },
			select: {
				name: true,
				email: true,
				birthdate: true,
			},
		})

		if (!user) throw new CustomError("User not found")

		return user
	} catch (error) {
		return undefined
	}
}
