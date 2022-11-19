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

		const companies = await prisma.company.findMany({
			where: {
				name: {
					contains: searchName,
				},
			},
			select: {
				id: true,
				name: true,
				profile_picture_url: true,
			},
		})

		return res.status(200).json({ companies })
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
