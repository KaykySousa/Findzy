type FileToBase64 = (file: File) => Promise<string | undefined>

const fileToBase64: FileToBase64 = (file) => {
	const fileReader = new FileReader()
	fileReader.readAsDataURL(file)

	return new Promise((resolve, reject) => {
		fileReader.onloadend = () => {
			resolve(fileReader.result?.toString())
		}
	})
}

export default fileToBase64
