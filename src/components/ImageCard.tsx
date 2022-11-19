import { XMarkIcon } from "@heroicons/react/24/outline"

interface ImageCardProps {
	imageSrc: string
	title: string
	onDelete: () => void
}

export default function ImageCard({
	imageSrc,
	title,
	onDelete,
}: ImageCardProps) {
	return (
		<div className="flex h-16 w-full items-center">
			<img
				src={imageSrc}
				alt=""
				className="h-16 w-16 rounded object-cover"
			/>
			<span className="ml-2 w-full text-sm text-gray-600">{title}</span>
			<XMarkIcon
				className="h-8 w-8 cursor-pointer text-gray-600"
				onClick={onDelete}
			/>
		</div>
	)
}
