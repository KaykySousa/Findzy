import { Button } from "@/design/index"
import Link, { LinkProps } from "next/link"
import { ButtonHTMLAttributes } from "react"

interface LinkButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof LinkProps>,
		LinkProps {
	theme?: "primary" | "secondary"
}

export default function LinkButton({
	href,
	theme = "primary",
	className,
	...props
}: LinkButtonProps) {
	return (
		<Link href={href}>
			<a className={`w-full ${className}`}>
				<Button theme={theme} {...props} />
			</a>
		</Link>
	)
}
