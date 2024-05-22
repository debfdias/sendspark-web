import axios from "axios";
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
        },
        password: {
          label: "Password",
          type: "password",
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

        let userDB = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + "/user/" + credentials?.email
        );

        if (!userDB) {
          return null;
        }

        if (res.data.status) {
          return {
            name: userDB.data.name,
            email: userDB.data.email,
            token: res.data.token,
          };
        } else {
          throw new Error();
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthOptions;
