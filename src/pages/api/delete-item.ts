import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import handleError from "@/utils/handleError"
import { NextApiHandler } from "next"

interface ImagesUrlData {
	image_url: string
}

interface BodyData {
	itemId: string
}

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method !== "POST") {
			throw new CustomError("Method not allowed", {
				statusCode: 405,
			})
		}

		let imagesUrl: ImagesUrlData[] = []

		const { itemId }: BodyData = req.body

		if (!itemId) {
			throw new CustomError("Missing parameters")
		}

		const deletedItem = await prisma.item.delete({
			where: {
				id: itemId,
			},
			select: {
				category: true,
				color: true,
				description: true,
				id: true,
			},
		})

		return res.status(201).json(deletedItem)
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
