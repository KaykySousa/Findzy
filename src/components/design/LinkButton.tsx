import { Button } from "@/design/index"
import Link from "next/link"
import { ButtonHTMLAttributes } from "react"

interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	theme?: "primary" | "secondary" | "tertiary"
	buttonClassName?: string
	href: string
}

export default function LinkButton({
	href,
	theme = "primary",
	className,
	buttonClassName,
	...props
}: LinkButtonProps) {
	return (
		<Link href={href} className={`w-full ${className}`}>
			<Button theme={theme} className={buttonClassName} {...props} />
		</Link>
	)
}
