import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import validateToken from "./validateToken"

export default async function getCompany(token: string) {
	try {
		const decodedToken = validateToken(token)

		if (!decodedToken) throw new CustomError("Token invalid")

		const company = await prisma.company.findUnique({
			where: { id: decodedToken.sub },
			select: {
				name: true,
				email: true,
			},
		})

		if (!company) throw new CustomError("Company not found")

		return company
	} catch (error) {
		return undefined
	}
}
