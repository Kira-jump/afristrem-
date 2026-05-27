import { withAuth } from "next-auth/middleware";

// Server-side guard for /admin/*. Even if a user knows the URL,
// the request never hits the page without a valid ADMIN JWT.
export default withAuth({
  pages: { signIn: "/auth/login" },
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
