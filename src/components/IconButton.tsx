import { ButtonHTMLAttributes } from "react"

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function IconButton(props: IconButtonProps) {
    return (
        <button
            type="button"
            className="absolute right-0 rounded-full p-1 text-gray-500 outline-purple-700 transition-colors hover:bg-purple-200 peer-focus:text-purple-700"
            {...props}
        />
    )
}
