import fileToBase64 from "@/utils/fileToBase64"
import { UserCircleIcon } from "@heroicons/react/24/outline"
import { ChangeEvent, DragEvent, useEffect, useState } from "react"
import Button from "./design/Button"

interface ImageUploadProps {
	title: string
	dropMessage: string
	buttonTitle: string
	loading?: boolean
	onClose?: () => void
	onUploadButton: (image: string) => any
}

export default function ImageUpload({
	onUploadButton,
	title,
	dropMessage,
	buttonTitle,
	loading,
	onClose,
}: ImageUploadProps) {
	const [preview, setPreview] = useState<string | undefined>()
	const [inputFile, setInputFile] = useState("")
	const [file, setFile] = useState<File | undefined>()

	useEffect(() => {
		if (!file) return
		fileToBase64(file).then((fileBase64) => {
			setPreview(fileBase64)
		})
	}, [file])

	function handleDragOver(e: DragEvent<HTMLDivElement>) {
		e.preventDefault()
		e.stopPropagation()
	}

	function handleDrop(e: DragEvent<HTMLDivElement>) {
		e.preventDefault()
		e.stopPropagation()

		const files = e.dataTransfer.files
		if (!files) return
		setFile(files[0])
	}

	function handleChangeFile(e: ChangeEvent<HTMLInputElement>) {
		const files = e.target.files
		if (!files) return
		setFile(files[0])
	}

	return (
		<div
			className="fixed top-0 left-0 z-40 flex h-screen w-full items-center justify-center bg-black bg-opacity-70 p-4 backdrop-blur-[2px]"
			onClick={onClose}
		>
			<div
				className="relative flex w-full max-w-2xl flex-col rounded-md bg-white p-4"
				onClick={(e) => {
					e.stopPropagation()
				}}
			>
				<p className="mb-4 text-center text-lg font-bold">{title}</p>
				<div
					className="mb-4 flex h-60 w-full flex-col items-center justify-center gap-y-4 rounded-md border border-dashed border-gray-500 bg-gray-300 p-4 text-xl text-gray-500 md:h-80"
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				>
					{preview ? (
						<img
							src={preview}
							alt="Imagem carregada"
							className="h-full w-full object-contain"
						/>
					) : (
						<>
							<UserCircleIcon className="hidden h-12 w-12 md:block" />
							<div className="flex flex-col items-center justify-center gap-y-2 md:flex-row">
								<span className="">{dropMessage}</span>
								<span className="md:lowercase">
									&nbsp;OU&nbsp;
								</span>
								<label className="cursor-pointer text-purple-700 hover:text-purple-800 md:lowercase">
									Selecione
									<input
										type="file"
										className="hidden"
										value={inputFile}
										onChange={(e) => {
											setInputFile(e.target.value)
											handleChangeFile(e)
										}}
									/>
								</label>
							</div>
						</>
					)}
				</div>
				<Button
					onClick={() => {
						if (!file) return
						fileToBase64(file).then((fileBase64) => {
							onUploadButton(fileBase64!)
						})
					}}
					loading={loading}
				>
					{buttonTitle}
				</Button>
			</div>
		</div>
	)
}
