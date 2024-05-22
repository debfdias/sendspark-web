import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    first_name: string;
    last_name: string;
  }

  interface Session {
    user: User;
    token: string;
    error?: string;
  }
}
