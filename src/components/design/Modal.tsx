import { XMarkIcon } from "@heroicons/react/24/outline"
import { ReactNode } from "react"

interface ModalProps {
	children?: ReactNode
	onClose?: () => {}
}

export default function Modal({ children, onClose }: ModalProps) {
	return (
		<div className="fixed top-0 left-0 flex min-h-screen w-full items-center justify-center bg-black bg-opacity-70 p-4">
			<div className="relative flex w-full max-w-2xl flex-col rounded-md bg-white p-4">
				{onClose && (
					<XMarkIcon
						className="absolute top-2 right-2 h-6 w-6 self-end"
						onClick={onClose}
					/>
				)}
				{children}
			</div>
		</div>
	)
}
