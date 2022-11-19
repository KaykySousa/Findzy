import { FlagIcon } from "@heroicons/react/24/outline"
import { StarIcon } from "@heroicons/react/24/solid"
import Link from "next/link"

interface CompanyBannerProps {
	name: string
	address: string
	rating: number
	profile_picture_url: string
	companyId: string
}

export default function CompanyBanner({
	name,
	address,
	profile_picture_url,
	rating,
	companyId,
}: CompanyBannerProps) {
	return (
		<div className="flex h-72 w-full flex-col">
			<div className="h-1/2 w-full rounded-t-lg bg-purple-700"></div>
			<div className="flex h-1/2 w-full items-start justify-between border-b border-gray-100 p-2 md:p-4">
				<div className="flex items-center text-sm text-amber-400">
					<span className="font-semibold">{rating.toFixed(1)}</span>
					<StarIcon className="ml-1 h-5 w-5" />
				</div>
				<div className="-my-16 flex flex-col items-center text-center">
					<img
						className="h-24 w-24 rounded-full border border-gray-100 object-cover"
						src={profile_picture_url}
						alt=""
					/>
					<p className="mt-2 font-bold text-gray-800">{name}</p>
					<p className="mt-1 text-sm text-gray-700">{address}</p>
				</div>
				<Link href={`/report/${companyId}`}>
					<a>
						<FlagIcon className="h-6 w-6 cursor-pointer text-purple-700" />
					</a>
				</Link>
			</div>
		</div>
	)
}
