import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import jwt_decode from "jwt-decode"
import { DecodedUserInfo } from "../../../types/next-auth"

export default NextAuth({
  providers: [
    // Configure the Password Grant.
    // This uses username and password for authentication.
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const formData = new URLSearchParams()

        formData.append("grant_type", "password")
        formData.append("client_id", process.env.DRUPAL_CLIENT_ID)
        formData.append("client_secret", process.env.DRUPAL_CLIENT_SECRET)
        formData.append("username", credentials.username)
        formData.append("password", credentials.password)

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/oauth/token`,
          {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )

        const data = await response.json()

        if (response.ok && data?.access_token) {
          return data
        }

        return null
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // Forward the access token, refresh token and expiration date from user.
      // We'll use to handle token refresh.
      if (user) {
        token.accessToken = user.access_token
        token.accessTokenExpires =
          Date.now() + (user.expires_in as number) * 1000
        token.refreshToken = user.refresh_token
      }

      // If token has not expired, return it,
      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      // Otherwise, refresh the token.
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken

        // Decode token and pass info to session.
        // This is used for the Password Grant.
        const decoded = jwt_decode<DecodedUserInfo>(token.accessToken as string)
        session.user.id = decoded.id
        session.user.email = decoded.email
        session.user.username = decoded.username
        session.error = token.error
      }
      return session
    },
  },
})

// Helper to obtain a new access_token from a refresh token.
async function refreshAccessToken(token) {
  try {
    const formData = new URLSearchParams()

    formData.append("grant_type", "refresh_token")
    formData.append("client_id", process.env.DRUPAL_CLIENT_ID)
    formData.append("client_secret", process.env.DRUPAL_CLIENT_SECRET)
    formData.append("refresh_token", token.refreshToken)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/oauth/token`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error()
    }

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + (data.expires_in as number) * 1000,
      refreshToken: data.refresh_token ?? token.refreshToken,
    }
  }
  catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}
