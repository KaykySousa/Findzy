import { Button, Input, Select } from "@/components/design"
import { ImageUpload } from "@/components/index"
import { api } from "@/services/axios"
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	DevicePhoneMobileIcon,
	DocumentDuplicateIcon,
	IdentificationIcon,
	PlusIcon,
	SunIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { useState } from "react"

export default function NewItem() {
	const [name, setName] = useState("")
	const [category, setCategory] = useState("")
	const [color, setColor] = useState("")
	const [local, setLocal] = useState("")
	const [description, setDescription] = useState("")
	const [images, setImages] = useState<string[]>([])

	const [formStep, setFormStep] = useState(0)

	const [showImageUpload, setShowImageUpload] = useState(false)

	async function handleSubmit() {
		try {
			console.log("okokok")
			const item = await api.post("/api/new-item", {
				name,
				category,
				color,
				local,
				description,
				images,
			})

			console.log(item)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className="flex min-h-screen w-full justify-center">
			<div className="flex w-full max-w-3xl flex-1 flex-col p-5">
				<div className="relative flex w-full items-center justify-center">
					<h1 className="text-lg font-bold text-purple-700">
						NOVO ITEM
					</h1>

					<Link href="/company">
						<a className="absolute right-0">
							<XMarkIcon className=" h-6 w-6 text-red-600" />
						</a>
					</Link>
				</div>

				<form
					className="mt-5 flex flex-1"
					id="newItemForm"
					onSubmit={(e) => {
						e.preventDefault()
						if (formStep + 1 === 2) {
							console.log("ahhhhhh")
							handleSubmit()
						} else {
							setFormStep(formStep + 1)
						}
					}}
				>
					{formStep === 0 && (
						<div className="flex flex-1 flex-col gap-y-5">
							<p className="text-center font-bold text-gray-800">
								Para começar, insira as informações básicas do
								item
							</p>
							<Input
								textLabel="Produto"
								placeholder="Ex.: Carteira"
								value={name}
								onChange={(e) => {
									setName(e.target.value)
								}}
								required
							/>
							<Select
								textLabel="Categoria"
								defaultOption="Selecione"
								options={[
									"Eletrônicos",
									"Documentos",
									"Roupas",
									"Bolsas, Mochilas ou Carteiras",
									"Outro",
								]}
								value={category}
								onChange={(e) => {
									setCategory(e.target.value)
								}}
								required
							/>
							<Select
								textLabel="Cor"
								defaultOption="Selecione"
								options={[
									"Amarelo",
									"Dourado",
									"Preto",
									"Azul",
									"Branco",
									"Indiferente",
								]}
								value={color}
								onChange={(e) => {
									setColor(e.target.value)
								}}
								required
							/>
							<Input
								textLabel="Local onde foi encontrado"
								placeholder="Ex.: Metrô Arthur Alvim"
								value={local}
								onChange={(e) => {
									setLocal(e.target.value)
								}}
								required
							/>
							<Input
								textLabel="Descrição"
								placeholder="Ex.: O item foi encontrado ontem à tarde, próximo a bilheteria"
								value={description}
								onChange={(e) => {
									setDescription(e.target.value)
								}}
								required
							/>
						</div>
					)}
					{formStep === 1 && (
						<div className="flex flex-1 flex-col gap-y-6">
							<p className="text-center font-bold text-gray-800">
								Agora, adicione pelo menos 2 imagens
							</p>
							<div className="flex flex-col gap-y-4 text-sm text-gray-600">
								<p className="flex items-center">
									<SunIcon className="mr-2 h-6 w-6 text-purple-700" />
									Local bem iluminado ou foto com flash;
								</p>
								<p className="flex items-center">
									<DevicePhoneMobileIcon className="mr-2 h-6 w-6 text-purple-700" />
									Celular na orientação vertical;
								</p>
								<p className="flex items-center">
									<DocumentDuplicateIcon className="mr-2 h-6 w-6 text-purple-700" />
									Priorize fotografar frente e verso;
								</p>
								<p className="flex items-center">
									<IdentificationIcon className="mr-2 h-6 w-6 text-purple-700" />
									<span>
										Se o item for um documento, divulgue
										apenas <strong>NOME</strong> e{" "}
										<strong>FOTO</strong>.
									</span>
								</p>
							</div>
							<div className="flex flex-col gap-y-4">
								{images.map((image, index) => (
									<div
										className="flex h-16 w-full items-center"
										key={index}
									>
										<img
											src={image}
											alt=""
											className="h-16 w-16 rounded object-cover"
										/>
										<span className="ml-2 w-full text-sm text-gray-600">
											Imagem {index + 1}
										</span>
										<XMarkIcon
											className="h-8 w-8 cursor-pointer text-gray-600"
											onClick={() => {
												setImages(
													images.filter(
														(
															imageToDel,
															indexToDel
														) => {
															return (
																indexToDel !==
																index
															)
														}
													)
												)
											}}
										/>
									</div>
								))}
							</div>
							<Button
								theme="tertiary"
								type="button"
								onClick={() => {
									setShowImageUpload(true)
								}}
							>
								<PlusIcon className="mr-2 h-6 w-6" /> Imagem
							</Button>
						</div>
					)}
				</form>

				<div className="flex flex-row-reverse justify-between">
					<button
						className="flex items-center justify-center py-2 font-bold text-gray-800"
						form="newItemForm"
					>
						Continuar
						<ArrowRightIcon className="ml-1 h-6 w-6 text-purple-700" />
					</button>
					{formStep > 0 && (
						<button
							className="flex items-center justify-center py-2 font-bold text-gray-800"
							onClick={() => {
								setFormStep(formStep - 1)
							}}
						>
							<ArrowLeftIcon className="mr-1 h-6 w-6 text-purple-700" />
							Voltar
						</button>
					)}
				</div>
			</div>

			{showImageUpload && (
				<ImageUpload
					onUploadButton={(image) => {
						setImages([...images, image])
						setShowImageUpload(false)
					}}
				/>
			)}
		</div>
	)
}
