import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import { Admin, Prisma } from "@prisma/client"

export default async function getAdminById(
	id: string,
	select?: Prisma.AdminSelect
) {
	try {
		const admin = await prisma.admin.findUnique({
			where: { id },
			select: select || {
				email: true,
				id: true,
				name: true,
			},
		})

		if (!admin) throw new CustomError("Admin not found")

		return admin as Admin
	} catch (error) {
		return undefined
	}
}
