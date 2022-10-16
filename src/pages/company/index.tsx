import { LinkButton } from "@/components/design"
import { CompanyBanner, Header, ItemCard } from "@/components/index"
import getCompany from "@/utils/getCompany"
import { PlusIcon } from "@heroicons/react/24/outline"
import { GetServerSideProps } from "next"
import { parseCookies } from "nookies"

export default function MainCompany() {
	return (
		<div className="flex min-h-screen w-full flex-col items-center bg-white">
			<Header />
			<div className="w-full max-w-4xl flex-1 py-4">
				<CompanyBanner />
				<div className="w-full p-2">
					<LinkButton href="/company/new-item" theme="tertiary">
						<PlusIcon className="mr-1 h-6 w-6" />
						<span>NOVO ITEM</span>
					</LinkButton>
					<ItemCard />
				</div>
			</div>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { "findzy.token": token } = parseCookies(ctx)

	const companyData = await getCompany(token)

	if (!companyData)
		return {
			redirect: {
				permanent: false,
				destination: "/login",
			},
		}

	return {
		props: {
			company: {
				name: companyData.name,
			},
		},
	}
}
