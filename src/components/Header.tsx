import { Logo } from "@/components/index"
import {
	ChatBubbleBottomCenterTextIcon,
	Cog8ToothIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"

export default function Header() {
	return (
		<header className="flex h-14 w-full items-center gap-x-4 border-b border-gray-100 bg-white px-2 md:h-16 md:justify-between md:px-8">
			<Logo className="hidden md:block" />
			<div className="relative flex h-8 w-full items-center md:max-w-3xl">
				<input
					type="text"
					className="h-full w-full cursor-text rounded border-0 bg-gray-100 pl-9 placeholder:text-sm focus:border-purple-700 focus:ring-0"
					placeholder="Buscar por item ou estabelecimento"
				/>
				<MagnifyingGlassIcon className="absolute left-2 h-5 w-5 text-purple-700" />
			</div>
			<div className="flex gap-x-4">
				<ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-purple-700" />
				<Cog8ToothIcon className="h-6 w-6 text-purple-700" />
			</div>
		</header>
	)
}
