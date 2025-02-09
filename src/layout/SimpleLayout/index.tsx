import { lazy, ReactNode } from "react"

// project-import
const Header = lazy(() => import("./Header"))

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
