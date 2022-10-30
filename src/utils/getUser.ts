import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"

export default async function getUser(id: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
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
