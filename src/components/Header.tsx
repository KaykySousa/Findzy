import { Logo } from "@/components/index"
import { Input } from "@/design/index"
import {
	ChatBubbleBottomCenterTextIcon,
	Cog8ToothIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"

interface HeaderProps {
	showInput?: boolean
	className?: string
}

export default function Header({ showInput = true, className }: HeaderProps) {
	return (
		<header
			className={`flex h-14 w-full items-center gap-x-4 border-b border-gray-100 bg-white px-2 md:h-16 md:justify-between md:px-8 ${className}`}
		>
			<Logo className="hidden md:block" />
			{showInput && (
				<Input
					icon={
						<MagnifyingGlassIcon className="absolute left-2 h-5 w-5 text-purple-700" />
					}
					placeholder="Buscar por item ou estabelecimento"
					className="md:max-w-3xl"
					inputClassName="!h-8"
				/>
			)}
			<div className="flex gap-x-4">
				<ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-purple-700" />
				<Cog8ToothIcon className="h-6 w-6 text-purple-700" />
			</div>
		</header>
	)
}
