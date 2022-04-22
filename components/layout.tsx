import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

import { PreviewAlert } from "@/components/preview-alert"

export function Layout({ children }) {
  const { data, status } = useSession()

  return (
    <>
      <PreviewAlert />
      <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
        <header className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" passHref>
                <a className="text-2xl font-semibold no-underline">
                  Blog
                </a>
              </Link>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {status !== "loading" ? (
              <>
                {status === "unauthenticated" ? (
                  <Link href="/login" passHref>
                    <a className="no-underline">
                      Login
                    </a>
                  </Link>
                ) : (
                  <button onClick={() => signOut({ redirect: false })} data-cy="btn-logout">
                    Logout
                  </button>
                )}
              </>
            ) : null}
          </div>
        </header>
        <main className="container py-10 mx-auto">{children}</main>
      </div>
    </>
  )
}
