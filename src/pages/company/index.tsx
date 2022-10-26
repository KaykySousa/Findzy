import { LinkButton } from "@/components/design"
import { CompanyBanner, Header, ItemCard } from "@/components/index"
import getItems from "@/utils/getItems"
import withCompanyAuth from "@/utils/withCompanyAuth"
import { PlusIcon } from "@heroicons/react/24/outline"

interface MainCompanyProps {
	items:
		| {
				images: string[]
				id: string
				name: string
				color: string
				local: string
				description: string
		  }[]
		| undefined
}

export default function MainCompany({ items }: MainCompanyProps) {
	return (
		<div className="flex min-h-screen w-full flex-col items-center bg-white">
			<Header />
			<div className="w-full max-w-4xl flex-1 py-4">
				<CompanyBanner />
				<div className="flex w-full grid-cols-3 flex-col gap-y-4 p-2 md:grid md:gap-x-4 md:py-4">
					<LinkButton
						href="/company/new-item"
						buttonClassName="md:!h-full md:flex-col"
						theme="tertiary"
					>
						<PlusIcon className="mr-1 h-6 w-6 md:mb-4 md:h-10 md:w-10" />
						<span>NOVO ITEM</span>
					</LinkButton>
					{items?.map((item, index) => (
						<ItemCard
							key={index}
							color={item.color}
							description={item.description}
							local={item.local}
							title={item.name}
							images={item.images}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export const getServerSideProps = withCompanyAuth(async ({ data }) => {
	const items = await getItems()

	return {
		props: {
			company: {
				name: data.name,
			},
			items,
		},
	}
})
