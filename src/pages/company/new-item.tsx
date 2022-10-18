import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/24/outline"

export default function NewItem() {
	return (
		<div className="flex min-h-screen w-full justify-center">
			<div className="flex w-full max-w-3xl flex-1 flex-col p-5">
				<div className="relative flex w-full items-center justify-center">
					<h1 className="text-lg font-bold text-purple-700">
						NOVO ITEM
					</h1>
					<XMarkIcon className="absolute right-0 h-6 w-6 text-red-600" />
				</div>
				<form className="flex-1"></form>
				<div>
					<button className="flex items-center justify-center font-bold text-gray-800">
						Continuar
						<ArrowRightIcon className="ml-1 h-6 w-6 text-purple-700" />
					</button>
				</div>
			</div>
		</div>
	)
}
