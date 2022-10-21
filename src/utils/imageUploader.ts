import { cloudinary } from "@/services/cloudinary"
import { UploadApiResponse } from "cloudinary"

type PresetType = "findzy-company-profile-pictures" | "findzy-items"

type ImageUploader = (
	imageBase64: string,
	preset: PresetType
) => Promise<UploadApiResponse>

const imageUploader: ImageUploader = async (imageBase64, preset) => {
	const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
		upload_preset: preset,
		transformation: [{ quality: "auto" }],
	})

	return uploadResponse
}

export default imageUploader
