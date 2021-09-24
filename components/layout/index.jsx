import Navbar from "./navigation/NavBar"

export default function Layout({ children, user }) {
  return (
    <>
      <Navbar user={user} />
      <div>{children}</div>
    </>
  )
}
