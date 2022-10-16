import { FlagIcon } from "@heroicons/react/24/outline"
import { StarIcon } from "@heroicons/react/24/solid"

export default function CompanyBanner() {
	return (
		<div className="flex h-72 w-full flex-col">
			<div className="h-1/2 w-full rounded-t-lg bg-purple-700"></div>
			<div className="flex h-1/2 w-full items-start justify-between border-b border-gray-100 p-2 md:p-4">
				<div className="flex items-center text-sm text-amber-400">
					<span className="font-semibold">5.0</span>
					<StarIcon className="ml-1 h-5 w-5" />
				</div>
				<div className="-my-16 flex flex-col items-center text-center">
					<img
						className="h-24 w-24 rounded-full border border-gray-100 object-cover"
						src="https://yt3.ggpht.com/ytc/AMLnZu-9lToKfZByYACsoOPzQnckD9O7hJVJRrWaZKZQ5Q=s900-c-k-c0x00ffffff-no-rj"
						alt=""
					/>
					<p className="mt-2 font-bold text-gray-800">
						ETEC da Zona Leste
					</p>
					<p className="mt-1 text-sm text-gray-700">
						Av. Águia de Haia, 2633 - Cidade A. E. Carvalho
					</p>
				</div>
				<FlagIcon className="h-6 w-6 cursor-pointer text-purple-700" />
			</div>
		</div>
	)
}
