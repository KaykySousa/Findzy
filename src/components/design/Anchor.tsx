import Link, { LinkProps } from "next/link"
import { AnchorHTMLAttributes } from "react"

interface AnchorProps
	extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
		LinkProps {}

export default function Anchor({ className, href, ...props }: AnchorProps) {
	return (
		<Link href={href}>
			<a
				className={`text-slate-500 hover:text-purple-700 hover:underline ${className}`}
				{...props}
			/>
		</Link>
	)
}
