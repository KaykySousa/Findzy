import { StarIcon } from "@heroicons/react/24/solid"

interface CompanyCardProps {
	logoUrl: string
	company: string
	address: string
	itemsNumber: number
	rating: number
}

export default function CompanyCard({
	logoUrl,
	company,
	address,
	itemsNumber,
	rating,
}: CompanyCardProps) {
	return (
		<div className="flex h-32 w-full cursor-pointer items-center rounded border border-gray-100 bg-white p-4 md:max-w-3xl">
			<img
				src={logoUrl}
				alt={`${company} logo`}
				className="h-20 w-20 rounded-full border border-gray-100 object-cover"
			/>
			<div className="ml-4 flex flex-1 flex-col">
				<div className="border-b border-gray-100 pb-2">
					<p className="font-bold uppercase">{company}</p>
					<p className="text-sm text-gray-700">{address}</p>
				</div>
				<div className="mt-2 flex justify-between">
					<span className="text-sm text-gray-700">
						{itemsNumber} itens
					</span>
					<div className="flex items-center text-amber-400">
						<span className="mr-1 text-sm">
							{rating.toFixed(1)}
						</span>
						<StarIcon className="h-4 w-4" />
					</div>
				</div>
			</div>
		</div>
	)
}
