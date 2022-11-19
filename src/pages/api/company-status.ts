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

		const { companyId, status } = req.body

		const company = await prisma.company.update({
			where: {
				id: companyId,
			},
			data: {
				status,
			},
			select: {
				name: true,
				status: true,
			},
		})

		return res.status(201).json({ company })
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export default handler
