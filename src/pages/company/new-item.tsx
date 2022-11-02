import { Button, Input, Select } from "@/components/design"
import { Header, ImageUpload, ItemCard } from "@/components/index"
import { api } from "@/services/axios"
import withAuth from "@/utils/withAuth"
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CheckIcon,
	DevicePhoneMobileIcon,
	DocumentDuplicateIcon,
	IdentificationIcon,
	PencilSquareIcon,
	PlusIcon,
	SunIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-toastify"

interface NewItemProps {
	company: {
		id: string
	}
}

export default function NewItem({ company }: NewItemProps) {
	const [name, setName] = useState("")
	const [category, setCategory] = useState("")
	const [color, setColor] = useState("")
	const [local, setLocal] = useState("")
	const [description, setDescription] = useState("")
	const [images, setImages] = useState<string[]>([])

	const [formStep, setFormStep] = useState(0)

	const [showImageUpload, setShowImageUpload] = useState(false)

	const router = useRouter()

	async function handlePublish() {
		try {
			const item = await api.post("/api/new-item", {
				name,
				category,
				color,
				local,
				description,
				images,
				companyId: company.id,
			})

			router.push("/")
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const error = (err.response?.data as any).error
				toast.error(error)
			} else if (err instanceof Error) {
				toast.error(err.message)
			}
		}
	}

	return (
		<div className="flex min-h-screen w-full flex-col items-center">
			<Header showInput={false} className="hidden md:flex" />
			<div className="flex w-full max-w-2xl flex-1 flex-col rounded-md border-gray-100 p-5 md:my-5 md:border md:py-4">
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
						setFormStep(formStep + 1)
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
									"Brinquedos",
									"Livros e cadernos",
									"Chaves",
									"Óculos",
									"Dinheiro",
									"Outro",
								]}
								value={category}
								onChange={(e) => {
									setCategory(e.target.value)
								}}
								required
							/>
							<Select
								textLabel="Cor predominante"
								defaultOption="Selecione"
								options={[
									"Amarelo",
									"Azul",
									"Branco",
									"Cinza",
									"Dourado",
									"Laranja",
									"Marrom",
									"Prata",
									"Preto",
									"Rosa",
									"Roxo",
									"Verde",
									"Vermelho",
									"Outro",
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

					{formStep === 2 && (
						<div className="flex flex-1 flex-col items-center gap-y-6">
							<p className="text-center font-bold text-gray-800">
								Prontinho, dá uma olhada em como vai ficar:
							</p>
							<div className="flex w-full flex-1 flex-col items-center justify-between md:w-80">
								<ItemCard
									className="md:w-72"
									color={color}
									description={description}
									images={images}
									local={local}
									title={name}
									defaultShowDescription={true}
								/>
								<div className="mt-4 flex w-full justify-between">
									<button
										type="button"
										className="flex items-center justify-center py-2 font-bold text-gray-800"
										onClick={() => {
											setFormStep(0)
										}}
									>
										Alterar
										<PencilSquareIcon className="ml-1 h-6 w-6" />
									</button>
									<button
										type="button"
										className="flex items-center justify-center py-2 font-bold text-green-600"
										onClick={handlePublish}
									>
										Publicar
										<CheckIcon className="ml-1 h-6 w-6" />
									</button>
								</div>
							</div>
						</div>
					)}
				</form>

				{formStep <= 1 && (
					<div className="mt-5 flex flex-row-reverse justify-between">
						<button
							className="group flex items-center justify-center py-2 font-bold text-gray-800"
							form="newItemForm"
						>
							Continuar
							<ArrowRightIcon className="ml-1 h-6 w-6 text-purple-700 transition-transform group-hover:translate-x-1" />
						</button>
						{formStep > 0 && (
							<button
								className="group flex items-center justify-center py-2 font-bold text-gray-800"
								onClick={() => {
									setFormStep(formStep - 1)
								}}
							>
								<ArrowLeftIcon className="mr-1 h-6 w-6 text-purple-700 transition-transform group-hover:-translate-x-1" />
								Voltar
							</button>
						)}
					</div>
				)}
			</div>

			{showImageUpload && (
				<ImageUpload
					onUploadButton={(image) => {
						setImages([...images, image])
						setShowImageUpload(false)
					}}
					title="Insira uma imagem do item"
					dropMessage="Arraste sua imagem aqui"
					buttonTitle="Carregar"
				/>
			)}
		</div>
	)
}

export const getServerSideProps = withAuth(["company"], async ({ data }) => {
	return {
		props: {
			company: {
				id: data.id,
			},
		},
	}
})
