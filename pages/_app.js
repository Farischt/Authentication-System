import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../styles/globals.scss"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  )
}

export default MyApp
