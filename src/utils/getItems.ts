import prisma from "@/prisma/client"
import CustomError from "./CustomError"

export default async function getItems(companyId: string) {
	try {
		const items = await prisma.item.findMany({
			where: {
				company_id: companyId,
			},
			select: {
				color: true,
				description: true,
				id: true,
				local: true,
				name: true,
				images: {
					select: {
						image_url: true,
					},
				},
			},
		})

		if (!items) throw new CustomError("User not found")

		return items.map((item) => {
			return {
				...item,
				images: item.images.map((image) => image.image_url),
			}
		})
	} catch (error) {
		return undefined
	}
}
