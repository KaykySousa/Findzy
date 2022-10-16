import { cloudinary } from "@/services/cloudinary"

export default async function imageUploader(imageBase64: string) {
	const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
		upload_preset: "findzy-company-profile-pictures",
		transformation: [{ quality: "auto" }],
	})

	return uploadResponse
}
