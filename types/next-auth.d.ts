// types/next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      username: string
      role: string
    }
  }

  interface User {
    id: string
    username: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    username: string
  }
}