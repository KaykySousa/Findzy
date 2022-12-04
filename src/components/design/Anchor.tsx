import Link, { LinkProps } from "next/link"
import { AnchorHTMLAttributes } from "react"

interface AnchorProps
	extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
		LinkProps {
	theme?: "primary" | "second"
}

export default function Anchor({
	className,
	theme = "primary",
	href,
	...props
}: AnchorProps) {
	const themes = {
		primary: "hover:underline",
		second: "text-sm text-slate-500 hover:text-purple-700",
	}

	return (
		<Link
			href={href}
			className={`${themes[theme]} ${className}`}
			{...props}
		/>
	)
}
