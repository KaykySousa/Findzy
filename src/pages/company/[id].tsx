import ClaimItemModal from "@/components/ClaimItemModal"
import { LinkButton } from "@/components/design"
import { CompanyBanner, Header, ItemCard } from "@/components/index"
import { api } from "@/services/axios"
import getCompanyById from "@/utils/getCompanyById"
import getItems from "@/utils/getItems"
import withAuth from "@/utils/withAuth"
import { PlusIcon } from "@heroicons/react/24/outline"
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

	const router = useRouter()

	async function handleSendClaimMessage(e: FormEvent, claimMessage: string) {
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
							}}
							editId={canEdit ? item.id : ""}
						/>
					))}
				</div>
			</div>

			{viewItem && (
				<ClaimItemModal
					item={viewItem}
					onClose={() => {
						setViewItem(null)
					}}
					onSendClaimMessage={handleSendClaimMessage}
					canEdit={canEdit}
					companyEmail={company.email}
					companyPhone={company.phone}
				/>
			)}
		</div>
	)
}

export const getServerSideProps = withAuth(
	["user", "company"],
	async ({ context, data, accountType }) => {
		const company = await getCompanyById(context.query.id!.toString())

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
