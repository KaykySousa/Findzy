import prisma from "@/prisma/client"
import CustomError from "./CustomError"

export default async function getItems() {
	try {
		const items = await prisma.item.findMany({
			include: {
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
