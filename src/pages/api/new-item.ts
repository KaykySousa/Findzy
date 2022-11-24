import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import handleError from "@/utils/handleError"
import imageUploader from "@/utils/imageUploader"
import { NextApiHandler, PageConfig } from "next"

interface ImagesUrlData {
	image_url: string
}

interface BodyData {
	category: string
	color: string
	description: string
	local: string
	name: string
	companyId: string
	images: string[]
}

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method !== "POST") {
			throw new CustomError("Method not allowed", {
				statusCode: 405,
			})
		}

		let imagesUrl: ImagesUrlData[] = []

		const {
			category,
			color,
			description,
			local,
			name,
			images,
			companyId,
		}: BodyData = req.body

		if (
			!category ||
			!color ||
			!description ||
			!local ||
			!name ||
			!images ||
			!companyId
		) {
			throw new CustomError("Missing parameters")
		}

		await new Promise((resolve, reject) => {
			images.map(async (image) => {
				const { secure_url: imageUrl } = await imageUploader(
					image,
					"findzy-items"
				)
				console.log(imageUrl)
				imagesUrl.push({ image_url: imageUrl })
				if (imagesUrl.length === images.length) {
					resolve(imagesUrl)
				}
			})
		})

		const item = await prisma.item.create({
			data: {
				category,
				color,
				description,
				local,
				name,
				images: {
					createMany: {
						data: imagesUrl,
					},
				},
				company_id: companyId,
			},
		})

		return res.status(201).json(item)
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export const config: PageConfig = {
	api: {
		bodyParser: {
			sizeLimit: "16mb",
		},
	},
}

export default handler
