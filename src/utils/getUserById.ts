import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import { Prisma, User } from "@prisma/client"

export default async function getUserById(
	id: string,
	select?: Prisma.UserSelect
) {
	try {
		const user = await prisma.user.findUnique({
			where: { id },
			select: select || {
				birthdate: true,
				email: true,
				id: true,
				name: true,
			},
		})

		if (!user) throw new CustomError("User not found")

		return user as User
	} catch (error) {
		return undefined
	}
}
