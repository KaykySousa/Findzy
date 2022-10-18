import { ChevronDownIcon } from "@heroicons/react/24/outline"

export default function ItemCard() {
	return (
		<div className="w-full rounded-lg border border-gray-100">
			<img
				src="https://via.placeholder.com/500.png/7e22ce"
				alt=""
				className="h-64 w-full rounded-t-lg object-cover"
			/>
			<div className="flex w-full flex-col items-center justify-center px-2 py-3 text-center text-gray-800 md:items-start md:text-start">
				<h1 className="mb-1 w-full border-b border-gray-100 pb-1 font-bold">
					HEADPHONE BLUETOOTH JBL
				</h1>
				<div className="relative flex w-full flex-col items-center justify-center text-center md:items-start md:text-start md:text-sm">
					<span>
						<strong>Cor:</strong> Preto
					</span>
					<span>
						<strong>Encontrado em:</strong> Sala 8
					</span>
					<ChevronDownIcon className="right-0 mt-1 h-6 w-6 cursor-pointer text-purple-700 md:absolute" />
				</div>
			</div>
		</div>
	)
}
