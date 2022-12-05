import {
	ChevronLeftIcon,
	ChevronRightIcon,
	EnvelopeIcon,
	PhoneIcon,
} from "@heroicons/react/24/outline"
import { FormEvent, useState } from "react"
import { Button } from "./design"
import TextArea from "./design/TextArea"

interface ClaimItemModalProps {
	onClose: () => void
	item: {
		images: string[]
		id: string
		name: string
		color: string
		local: string
		description: string
	}
	canEdit: boolean
	onSendClaimMessage: (e: FormEvent, claimMessage: string) => Promise<void>
	companyEmail: string
	companyPhone: string
}

export default function ClaimItemModal({
	onClose,
	item,
	canEdit,
	onSendClaimMessage,
	companyEmail,
	companyPhone,
}: ClaimItemModalProps) {
	const [viewItemImageSliderIndex, setViewItemImageSliderIndex] = useState(0)
	const [claimMessage, setClaimMessage] = useState("")

	return (
		<div
			className="absolute top-0 left-0 z-50 flex min-h-screen w-full flex-col items-center justify-center gap-x-8 bg-black bg-opacity-70 p-4 backdrop-blur-[2px] md:fixed md:h-screen md:flex-row"
			onClick={onClose}
		>
			<div
				className="mb-4 flex h-[28rem] w-full max-w-lg flex-col items-stretch rounded-lg bg-white md:mb-0 md:h-full md:max-h-[28rem]"
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
						{item.images.map((imageurl, index) => (
							<img
								key={index}
								src={imageurl}
								alt={`${item.name} image ${index}`}
								className="h-full w-full flex-shrink-0 rounded-t-lg object-contain"
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
									item.images.length - 1
								) {
									setViewItemImageSliderIndex(
										viewItemImageSliderIndex + 1
									)
								}
							}}
						/>
					</div>
				</div>
				<div className="border-t border-gray-300 p-4">
					<h1 className="mb-3 font-bold uppercase">{item.name}</h1>
					<div className="flex w-full text-gray-800">
						<div className="mr-4 flex w-1/2 flex-col justify-center text-sm">
							<p>
								<strong>Cor: </strong>
								{item.color}
							</p>
							<p>
								<strong>Encontrado em: </strong>
								{item.local}
							</p>
						</div>
						<div className="flex w-1/2 flex-col justify-center border-l border-gray-300 pl-4 text-sm">
							<p>{item.description}</p>
						</div>
					</div>
				</div>
			</div>
			{!canEdit && (
				<form
					className="flex h-[28rem] w-full max-w-lg flex-col items-center rounded-lg bg-white p-6 md:h-full md:max-h-[28rem]"
					onClick={(e) => {
						e.stopPropagation()
					}}
					onSubmit={(e) => {
						onSendClaimMessage(e, claimMessage)
					}}
				>
					<p className="mb-4 font-bold">
						Este item é seu? Conte a sua história.
					</p>
					<TextArea
						className="mb-4"
						placeholder="Ex.: Oi, eu estive aí ontem às 13h e acabei esquecendo meu carregador debaixo da mesa!"
						value={claimMessage}
						onChange={(e) => {
							setClaimMessage(e.target.value)
						}}
					/>
					<Button type="submit">Recuperar meu item</Button>
					<small className="mt-2 mb-4 text-center text-gray-600">
						Ao enviar sua reivindicação, você aceita enviar seus
						dados para a empresa à fim de verificação inicial.
					</small>
					<p className="mb-4 font-bold">
						Você também pode entrar em contato diretamente!
					</p>
					<div className="flex w-full justify-around">
						<a href={`mailto:${companyEmail}`}>
							<EnvelopeIcon className="h-7 w-7 text-purple-700" />
						</a>
						<a href={`tel:${companyPhone}`}>
							<PhoneIcon className="h-7 w-7 cursor-pointer text-purple-700" />
						</a>
					</div>
				</form>
			)}
		</div>
	)
}
