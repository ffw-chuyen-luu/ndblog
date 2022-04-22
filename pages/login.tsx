import Head from "next/head"
import { signOut, useSession } from "next-auth/react"

import { Layout } from "@/components/layout"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const { data, status } = useSession()

  return (
    <Layout>
      <Head>
        <title>Login</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend."
        />
      </Head>

      <div>
        {status !== "loading" ? (
          <>
            {status === "unauthenticated" ? (
              <LoginForm />
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-4 bg-yellow-100 rounded-lg shadow-sm">
                <div className="mb-2">
                  You are now logged in
                </div>

                <button
                  onClick={() => signOut({ redirect: false })}
                  data-cy="btn-logout"
                  className="justify-center w-full max-w-xs px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm inine-flex hover:bg-black"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </Layout>
  )
}
