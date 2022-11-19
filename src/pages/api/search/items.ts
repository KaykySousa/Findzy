import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import handleError from "@/utils/handleError"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method !== "POST") {
			throw new CustomError("Method not allowed", {
				statusCode: 405,
			})
		}

		const { searchName } = req.body

		if (!searchName) throw new CustomError("Missing parameters")

		const itemsSearch = await prisma.item.findMany({
			where: {
				OR: [
					{
						name: {
							search: searchName,
						},
					},
					{
						name: {
							contains: searchName,
						},
					},
				],
			},
			select: {
				id: true,
				name: true,
				color: true,
				description: true,
				local: true,
				images: {
					select: {
						image_url: true,
					},
				},
			},
		})

		if (!itemsSearch) throw new CustomError("Items not found")

		const items = itemsSearch.map((item) => {
			return {
				...item,
				images: item.images.map((image) => image.image_url),
			}
		})

		return res.status(200).json({ items })
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
