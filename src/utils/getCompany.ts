import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"

export default async function getCompany(id: string) {
	try {
		const company = await prisma.company.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				email: true,
				address: {
					select: {
						cep: true,
						city: true,
						district: true,
						id: true,
						number: true,
						street: true,
						uf: true,
					},
				},
				profile_picture_url: true,
				phone: true,
			},
		})

		if (!company) throw new CustomError("Company not found")

		return company
	} catch (error) {
		return undefined
	}
}
