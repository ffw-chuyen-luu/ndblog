import * as React from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"

export function LoginForm() {
  const router = useRouter()
  const [hasError, setHasError] = React.useState<boolean>(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    if (!result.ok) {
      setHasError(true)
    }
  }

  return (
    <>
      <div className="w-full max-w-sm p-8 space-y-4 border rounded-md shadow">
        {hasError ? (
          <div className="px-4 py-2 text-sm text-red-600 bg-red-100 border-red-200 rounded-md">
            Unrecognized username or password.
          </div>
        ) : null}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="relative block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="relative block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            data-cy="btn-submit"
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-black"
          >
            Login
          </button>
        </form>
      </div>
    </>
  )
}
