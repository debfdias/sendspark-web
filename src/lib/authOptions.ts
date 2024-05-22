import axios, { AxiosHeaderValue } from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "pass",
        },
      },
      async authorize(credentials) {
        const url = process.env.NEXT_PUBLIC_API_URL + "/login";
        const formData = new URLSearchParams();

        if (credentials?.email && credentials?.password) {
          formData.append("email", credentials.email);
          formData.append("password", credentials.password);
        }

        const res = await axios.post(url, {
          email: credentials?.email,
          password: credentials?.password,
        });

        const result = res.data.AuthenticationResult.AccessToken;

        if (res.status === 200) {
          return result;
        } else {
          throw new Error();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },
    session: async ({ session, token }) => {
      const authUser = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/login",
        {
          headers: { Authorization: token.user as AxiosHeaderValue },
        }
      );

      if (token) {
        session.user = authUser.data;
        session.token = (token.user as string).toString();
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30 days
  },
  jwt: {
    maxAge: +process.env.NEXT_PUBLIC_REFRESH_EXPIRES!, // Same refresh token expires as on the backend
  },
  pages: {
    signIn: "/",
  },
  debug: process.env.NODE_ENV === "development" ? true : false,
} satisfies NextAuthOptions;
