import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import handleError from "@/utils/handleError"
import imageUploader from "@/utils/imageUploader"
import { NextApiHandler } from "next"

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
	if (req.method === "POST") {
		try {
			const createdItem = await create(req.body)
			return res.status(201).json(createdItem)
		} catch (e) {
			const { error, statusCode } = handleError(e)
			return res.status(statusCode).json({ error })
		}
	} else if (req.method === "PATCH") {
		try {
			const updatedItem = await update(req.body)
			return res.status(200).json(updatedItem)
		} catch (e) {
			const { error, statusCode } = handleError(e)
			return res.status(statusCode).json({ error })
		}
	} else if (req.method === "DELETE") {
		try {
			const removedItem = await remove(req.body)
			return res.status(200).json(removedItem)
		} catch (e) {
			const { error, statusCode } = handleError(e)
			return res.status(statusCode).json({ error })
		}
	} else {
		return res.status(405).json({ error: "Method not allowed" })
	}
}

async function create({
	category,
	color,
	description,
	local,
	name,
	images,
	companyId,
}: BodyData) {
	try {
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

		let imagesUrl: ImagesUrlData[] = []

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

		return item
	} catch (error) {
		throw error
	}
}

async function update({
	category,
	color,
	description,
	local,
	name,
	images,
	companyId,
	itemId,
}: BodyData & { itemId: string }) {
	try {
		let imagesUrl: ImagesUrlData[] = []

		if (
			!category ||
			!color ||
			!description ||
			!local ||
			!name ||
			!images ||
			!companyId ||
			!itemId
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

		await prisma.itemImage.deleteMany({
			where: {
				item_id: itemId,
			},
		})

		const item = await prisma.item.update({
			where: {
				id: itemId,
			},
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

		return item
	} catch (error) {
		throw error
	}
}

async function remove({ itemId }: { itemId: string }) {
	try {
		if (!itemId) {
			throw new CustomError("Missing parameters")
		}

		const deletedItem = await prisma.item.delete({
			where: {
				id: itemId,
			},
		})

		return deletedItem
	} catch (error) {
		throw error
	}
}

export default handler
