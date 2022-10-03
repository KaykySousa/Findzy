import { api } from "@/services/axios"
import { ChangeEvent, FormEvent, useState } from "react"

export default function PictureUpload() {
	const [file, setFile] = useState<File | undefined>()
	const [inputFileState, setInputFileState] = useState("")
	const [previewSrc, setPreviewSrc] = useState<string | undefined>()

	async function handleUpload(e: FormEvent) {
		e.preventDefault()

		if (!file) return

		const fileReader = new FileReader()

		fileReader.readAsDataURL(file)

		fileReader.onloadend = async () => {
			try {
				const res = await api.post("/api/image-upload", {
					file: fileReader.result,
				})

				setPreviewSrc(fileReader.result?.toString())

				console.log("RESPONSE FROM BACK-END: ", res)
			} catch (error) {
				console.error(error)
			}
		}
	}

	function handleChangeFile(e: ChangeEvent<HTMLInputElement>) {
		const files = e.target.files
		if (!files) return
		setFile(files[0])
		console.log(files[0])
	}

	return (
		<form
			onSubmit={handleUpload}
			className="flex min-h-screen w-full flex-col items-center justify-center"
		>
			<label className="">
				UPLOAD IMAGE
				<input
					type="file"
					className=""
					onChange={(e) => {
						setInputFileState(e.target.value)
						handleChangeFile(e)
					}}
					value={inputFileState}
				/>
			</label>

			{previewSrc && <img src={previewSrc} />}

			<button
				type="submit"
				className="mt-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
			>
				UPLOAD
			</button>
		</form>
	)
}
