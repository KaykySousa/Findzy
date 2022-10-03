import { cloudinary } from "@/services/cloudinary"
import CustomError from "@/utils/CustomError"
import handleError from "@/utils/handleError"
import type { NextApiHandler, PageConfig } from "next"

const handler: NextApiHandler = async (req, res) => {
	try {
		if (req.method !== "POST") {
			throw new CustomError("Method not allowed", {
				statusCode: 405,
			})
		}

		const { file } = req.body

		if (!file) throw new CustomError("Missing parameters")

		const uploadRes = await cloudinary.uploader.upload(file, {
			upload_preset: "findzy-company-profile-pictures",
			transformation: [{ quality: "auto" }],
		})

		console.log(uploadRes)

		return res.status(200).json({ file, uploadRes })
	} catch (e) {
		console.log(e)

		const { error, statusCode } = handleError(e)
		return res.status(statusCode).json({ error })
	}
}

export const config: PageConfig = {
	api: {
		bodyParser: {
			sizeLimit: "2mb",
		},
	},
}

export default handler
