import type { AppProps } from "next/app"
import { ToastContainer } from "react-toastify"
import "../styles/globals.css"

import "react-toastify/dist/ReactToastify.min.css"

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Component {...pageProps} />
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				draggableDirection="x"
				draggablePercent={60}
				pauseOnHover
				theme="colored"
			/>
		</>
	)
}

export default MyApp
