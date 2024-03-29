import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import getCompanyById from "@/utils/getCompanyById"
import handleError from "@/utils/handleError"
import imageUploader from "@/utils/imageUploader"
import validateToken from "@/utils/validateToken"
import { NextApiHandler } from "next"

interface ImagesUrlData {
	image_url: string
}

interface BodyData {
	message: string
	images: string[]
	denouncedId: string
}

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method !== "POST") {
			throw new CustomError("Method not allowed", {
				statusCode: 405,
			})
		}

		const token = req.headers.authorization?.replace("Bearer ", "")

		const decodedToken = validateToken(token)

		if (!decodedToken) {
			throw new CustomError("Token not provided")
		}

		const company = await getCompanyById(decodedToken.sub!)

		if (!company) {
			throw new CustomError("Unauthorized", {
				statusCode: 401,
			})
		}

		const { message, images, denouncedId }: BodyData = req.body

		if (!message || !images.length || !denouncedId)
			throw new CustomError("Missing parameters")

		const imagesUrl: ImagesUrlData[] = []

		await new Promise((resolve, reject) => {
			images.map(async (image) => {
				const { secure_url: imageUrl } = await imageUploader(
					image,
					"findzy-reports"
				)
				console.log(imageUrl)
				imagesUrl.push({ image_url: imageUrl })
				if (imagesUrl.length === images.length) {
					resolve(imagesUrl)
				}
			})
		})

		const userReport = await prisma.userReport.create({
			data: {
				message,
				images: {
					createMany: {
						data: imagesUrl,
					},
				},
				denounced_id: denouncedId,
				denouncer_id: company.id,
			},
			include: {
				denounced: {
					select: {
						name: true,
					},
				},
			},
		})

		return res.status(201).json({ report: userReport })
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
