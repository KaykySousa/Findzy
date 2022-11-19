import { Button, LinkButton } from "@/components/design"
import TextArea from "@/components/design/TextArea"
import { CompanyBanner, Header, ItemCard } from "@/components/index"
import { api } from "@/services/axios"
import getCompany from "@/utils/getCompany"
import getItems from "@/utils/getItems"
import withAuth from "@/utils/withAuth"
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	EnvelopeIcon,
	PhoneIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline"
import { Address } from "@prisma/client"
import { useRouter } from "next/router"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"

interface ItemData {
	images: string[]
	id: string
	name: string
	color: string
	local: string
	description: string
}

interface MainCompanyProps {
	items: ItemData[] | undefined

	company: {
		id: string
		name: string
		email: string
		address: Address
		profile_picture_url: string
		phone: string
	}

	canEdit: boolean
}

export default function MainCompany({
	items,
	company,
	canEdit,
}: MainCompanyProps) {
	const [viewItem, setViewItem] = useState<ItemData | null>(null)
	const [viewItemImageSliderIndex, setViewItemImageSliderIndex] = useState(0)
	const [claimMessage, setClaimMessage] = useState("")

	const router = useRouter()

	async function handleSendClaimMessage(e: FormEvent) {
		e.preventDefault()

		if (!claimMessage) {
			toast.error("Escreva uma mensagem para resgatar o item")
		}

		const res = await api.post("/api/send-claim-message", {
			toId: company.id,
			content: claimMessage,
		})

		router.push("/chat")
	}

	return (
		<div className="flex min-h-screen w-full flex-col items-center bg-white">
			<Header />
			<div className="w-full max-w-4xl flex-1 py-4">
				<CompanyBanner
					address={`${company.address.street}, ${company.address.number} - ${company.address.district} - ${company.address.uf}`}
					name={company.name}
					rating={5.0}
					profile_picture_url={company.profile_picture_url}
					companyId={company.id}
				/>
				<div className="flex w-full grid-cols-3 flex-col gap-y-4 p-2 md:grid md:gap-x-4 md:py-4">
					{canEdit && (
						<LinkButton
							href="/company/new-item"
							buttonClassName="md:!h-full md:flex-col min-h-[22rem]"
							theme="tertiary"
						>
							<PlusIcon className="mr-1 h-6 w-6 md:mb-4 md:h-10 md:w-10" />
							<span>NOVO ITEM</span>
						</LinkButton>
					)}
					{items?.map((item, index) => (
						<ItemCard
							key={index}
							color={item.color}
							description={item.description}
							local={item.local}
							title={item.name}
							images={item.images}
							onClick={() => {
								setViewItem(item)
								setViewItemImageSliderIndex(0)
							}}
						/>
					))}
				</div>
			</div>

			{viewItem && (
				<div
					className="fixed top-0 left-0 flex h-screen w-full flex-col overflow-y-auto md:flex-row md:items-center md:justify-center md:overflow-y-visible md:bg-black md:bg-opacity-70 md:backdrop-blur-[2px]"
					onClick={() => {
						setViewItem(null)
					}}
				>
					<button
						className="absolute right-0 z-40 p-1"
						onClick={() => {
							setViewItem(null)
						}}
					>
						<XMarkIcon className="h-8 w-8 text-red-600" />
					</button>

					<div
						className="flex min-h-screen w-full flex-col gap-x-8 bg-white p-4 md:flex-row"
						onClick={(e) => {
							e.stopPropagation()
						}}
					>
						<div
							className="flex h-full w-full flex-col items-stretch bg-white md:max-h-[28rem] md:max-w-lg md:rounded-lg"
							onClick={(e) => {
								e.stopPropagation()
							}}
						>
							<div className="relative min-h-0 w-full flex-1 overflow-hidden">
								<div
									className="flex h-full w-full transition-transform"
									style={{
										transform: `translate(-${
											viewItemImageSliderIndex * 100
										}%)`,
									}}
								>
									{viewItem.images.map((imageurl, index) => (
										<img
											key={index}
											src={imageurl}
											alt={`${viewItem.name} image ${index}`}
											className="h-full w-full flex-shrink-0 rounded-lg object-contain md:rounded-t-lg"
										/>
									))}
								</div>
								<div className="red from-gray-via-transparent-to-gray group absolute left-0 top-0 flex h-full w-full items-center justify-between px-2 opacity-0 hover:opacity-100">
									<ChevronLeftIcon
										className="h-10 w-10 cursor-pointer text-white opacity-60 mix-blend-difference grayscale"
										onClick={() => {
											if (viewItemImageSliderIndex > 0) {
												setViewItemImageSliderIndex(
													viewItemImageSliderIndex - 1
												)
											}
										}}
									/>
									<ChevronRightIcon
										className="h-10 w-10 cursor-pointer text-white opacity-60 mix-blend-difference grayscale"
										onClick={() => {
											if (
												viewItemImageSliderIndex <
												viewItem.images.length - 1
											) {
												setViewItemImageSliderIndex(
													viewItemImageSliderIndex + 1
												)
											}
										}}
									/>
								</div>
							</div>
							<div className="mt-4 border-gray-300 md:mt-0 md:border-t md:p-4">
								<h1 className="mb-3 font-bold uppercase">
									{viewItem.name}
								</h1>
								<div className="flex w-full flex-col text-gray-800 md:flex-row">
									<div className="flex w-full flex-col justify-center text-sm md:mr-4 md:w-1/2">
										<p>
											<strong>Cor: </strong>
											{viewItem.color}
										</p>
										<p>
											<strong>Encontrado em: </strong>
											{viewItem.local}
										</p>
									</div>
									<div className="mt-4 flex w-full flex-col justify-center border-gray-300 text-sm md:mt-0 md:w-1/2 md:border-l md:pl-4">
										<p>{viewItem.description}</p>
									</div>
								</div>
							</div>
						</div>
						{!canEdit && (
							<form
								className="mt-8 flex h-full w-full flex-col items-center bg-white md:mt-0 md:max-h-[28rem] md:max-w-lg md:rounded-lg md:p-6"
								onClick={(e) => {
									e.stopPropagation()
								}}
								onSubmit={handleSendClaimMessage}
							>
								<p className="mb-4 font-bold">
									Este item é seu? Conte a sua história.
								</p>
								<TextArea
									className="mb-4 min-h-[7rem] md:min-h-0"
									placeholder="Oi, eu estive aí ontem as 13h e acabei esquecendo meu carregador debaixo da mesa!"
									value={claimMessage}
									onChange={(e) => {
										setClaimMessage(e.target.value)
									}}
								/>
								<Button type="submit">
									Recuperar meu item
								</Button>
								<small className="mt-2 mb-4 text-center text-gray-600">
									Ao enviar sua reivindicação, você aceita
									enviar seus dados para a empresa à fim de
									verificação inicial.
								</small>
								<p className="mb-4 text-center font-bold">
									Você também pode entrar em contato
									diretamente!
								</p>
								<div className="flex w-full justify-around">
									<a href={`mailto:${company.email}`}>
										<EnvelopeIcon className="h-7 w-7 text-purple-700" />
									</a>
									<a href={`tel:${company.phone}`}>
										<PhoneIcon className="h-7 w-7 cursor-pointer text-purple-700" />
									</a>
								</div>
							</form>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export const getServerSideProps = withAuth(
	["user", "company"],
	async ({ context, data, accountType }) => {
		const company = await getCompany(context.query.id!.toString())

		if (!company) {
			return {
				redirect: {
					permanent: false,
					destination: "/",
				},
			}
		}

		const canEdit = data.id === company.id

		if (accountType === "company" && !canEdit) {
			return {
				redirect: {
					permanent: false,
					destination: "/",
				},
			}
		}

		const items = await getItems(company.id)

		return {
			props: {
				company,
				items,
				canEdit,
			},
		}
	}
)
