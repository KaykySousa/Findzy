import CompanyCard from "@/components/CompanyCard"
import { Header } from "@/components/index"
import SEO from "@/components/SEO"
import prisma from "@/prisma/client"
import withAuth from "@/utils/withAuth"
import { Address } from "@prisma/client"
import { useRouter } from "next/router"

interface MainUserProps {
	companies: {
		address: Address
		id: string
		name: string
		profile_picture_url: string
		_count: {
			items: number
			companies_reports: number
		}
	}[]
}

export default function MainUser({ companies }: MainUserProps) {
	const router = useRouter()

	return (
		<div className="min-h-screen w-full bg-white">
			<SEO title="Início" description="Página inicial." />
			<Header />
			<div className="flex w-full flex-col items-center gap-y-2 p-2 md:p-0 md:py-4">
				{companies.map((company, index) => (
					<CompanyCard
						key={index}
						company={company.name}
						address={`${company.address.street}, ${company.address.number} - ${company.address.district} - ${company.address.uf}`}
						logoUrl={company.profile_picture_url}
						itemsNumber={company._count.items}
						rating={Math.max(
							5 - company._count.companies_reports / 10,
							0
						)}
						href={`/company/${company.id}`}
					/>
				))}
			</div>
		</div>
	)
}

export const getServerSideProps = withAuth(["user"], async ({ data }) => {
	const companies = await prisma.company.findMany({
		select: {
			id: true,
			name: true,
			address: {
				select: {
					cep: true,
					city: true,
					district: true,
					number: true,
					street: true,
					uf: true,
				},
			},
			profile_picture_url: true,
			_count: {
				select: {
					items: true,
					companies_reports: true,
				},
			},
		},
	})

	return {
		props: {
			companies,
		},
	}
})
