import Link from "next/link"
import { HTMLAttributes } from "react"

interface LogoProps extends HTMLAttributes<HTMLParagraphElement> {}

export default function Logo({ className, ...props }: LogoProps) {
	return (
		<Link href="/">
			<a className={`text-lg text-purple-700 ${className}`}>
				<p className="whitespace-nowrap font-light" {...props}>
					<span className="font-extrabold">Findzy</span> Perdeu? Achou!
				</p>
			</a>
		</Link>
	)
}
