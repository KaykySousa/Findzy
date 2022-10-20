import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import handleError from "@/utils/handleError"
import imageUploader from "@/utils/imageUploader"
import { NextApiHandler } from "next"

interface imagesUrlData {
	image_url: string
}

const handler: NextApiHandler = async (req, res) => {
	try {
		console.log("FUNCIONA")
		if (req.method !== "POST") {
			throw new CustomError("Method not allowed", {
				statusCode: 405,
			})
		}

		let imagesUrl: imagesUrlData[] = []

		const { category, color, description, local, name, images } = req.body

		if (!category || !color || !description || !local || !name || !images) {
			throw new CustomError("Missing parameters")
		}

		;(images as string[]).map(async (image) => {
			const { secure_url: imageUrl } = await imageUploader(image)
			imagesUrl.push({ image_url: imageUrl })
		})

		const item = await prisma.item.create({
			data: {
				color,
				description,
				local,
				name,
				image: {
					createMany: {
						data: [
							{
								image_url: "lfasjhfkashfkashfaksf",
							},
						],
					},
				},
			},
		})

		return res.status(201).json(item)
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
