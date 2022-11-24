import prisma from "@/prisma/client"
import CustomError from "@/utils/CustomError"
import handleError from "@/utils/handleError"

import validateToken from "@/utils/validateToken"
import type { NextApiHandler, PageConfig } from "next"

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method !== "PATCH") {
			throw new CustomError("Method not allowed", {
				statusCode: 405,
			})
		}

		const token = req.headers.authorization?.replace("Bearer ", "")

		const decodedToken = validateToken(token)

		if (!decodedToken) {
			throw new CustomError("Token not provided")
		}

		const id = decodedToken.sub

		const { name, email } = req.body

		const user = await prisma.user.update({
			data: {
				name,
				email,
			},
			where: {
				id,
			},
			select: {
				email: true,
				name: true,
				id: true,
			},
		})

		return res.status(200).json({ user })
	} catch (e) {
		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export const config: PageConfig = {
	api: {
		bodyParser: {
			sizeLimit: "4mb",
		},
	},
}

export default handler
