import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import { Company, Prisma } from "@prisma/client"

export default async function getCompanyById(
	id: string,
	select?: Prisma.CompanySelect
) {
	try {
		const company = await prisma.company.findUnique({
			where: { id },
			select: select || {
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
				cnpj: true,
				email: true,
				id: true,
				name: true,
				phone: true,
				profile_picture_url: true,
				status: true,
			},
		})

		if (!company) throw new CustomError("Company not found")

		return company as Company
	} catch (error) {
		return undefined
	}
}
