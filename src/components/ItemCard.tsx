import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

interface ItemCardProps {
	className?: string
	title: string
	color: string
	local: string
	description: string
	images: string[]
	defaultShowDescription?: boolean
}

export default function ItemCard({
	className,
	title,
	color,
	local,
	description,
	images,
	defaultShowDescription,
}: ItemCardProps) {
	const [showDescription, setShowDescription] = useState(
		defaultShowDescription || false
	)
	const [imageSliderIndex, setImageSliderIndex] = useState(0)

	return (
		<div
			className={`w-full rounded-lg border border-gray-100 ${className}`}
		>
			<div className="relative h-64 w-full overflow-hidden">
				<div
					className="flex h-full w-full transition-transform"
					style={{
						transform: `translate(-${imageSliderIndex * 100}%)`,
					}}
				>
					{images.map((imageurl, index) => (
						<img
							key={index}
							src={imageurl}
							alt={`${title} image ${index}`}
							className="h-full w-full flex-shrink-0 rounded-t-lg object-cover"
						/>
					))}
				</div>
				<div className="absolute bottom-2 left-0 flex w-full justify-center gap-x-1">
					{images.map((image, index) => (
						<button
							key={index}
							type="button"
							className="h-2 w-2 cursor-pointer rounded-full bg-purple-700"
							onClick={() => {
								setImageSliderIndex(index)
							}}
						/>
					))}
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-center px-2 py-3 text-center text-gray-800 md:items-start md:text-start">
				<h1 className="mb-1 w-full border-b border-gray-100 pb-1 font-bold">
					{title}
				</h1>
				<div className="relative flex w-full flex-col items-center justify-center text-center md:items-start md:text-start md:text-sm">
					<span>
						<strong>Cor:</strong> {color}
					</span>
					<span>
						<strong>Encontrado em:</strong> {local}
					</span>
					<ChevronDownIcon
						className={`right-0 mt-1 h-6 w-6 cursor-pointer text-purple-700 transition-transform duration-300 md:absolute ${
							showDescription ? "-rotate-180" : "rotate-0"
						}`}
						onClick={() => {
							setShowDescription(!showDescription)
						}}
					/>
				</div>
				<p
					className={`mt-2 text-center text-sm text-gray-800 ${
						showDescription ? "block" : "hidden"
					}`}
				>
					{description}
				</p>
			</div>
		</div>
	)
}
