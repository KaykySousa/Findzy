import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"

export default async function getAdmin(id: string) {
	try {
		const admin = await prisma.admin.findUnique({
			where: { id },
			select: {
				email: true,
				id: true,
				name: true,
			},
		})

		if (!admin) throw new CustomError("Admin not found")

		return admin
	} catch (error) {
		return undefined
	}
}
