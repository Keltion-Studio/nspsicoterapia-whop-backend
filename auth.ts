import { whopSdk } from "@/whop";
import NextAuth from "next-auth";
import { getToken as rawGetToken } from "next-auth/jwt";
import { headers } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		whopSdk.oauth.authJsProvider({
			scope: ["read_user"],
		}),
	],
	cookies: {
		sessionToken: {
		name: "__Secure-authjs.session-token",
		options: {
			httpOnly: true,
			sameSite: "none", // permite usarla en cross-site requests
			path: "/",
			secure: true, // necesario para HTTPS
		},
		},
	},
	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token as string;
				token.refreshToken = account.refresh_token as string;
			}
			return token;
		},
		authorized: async ({ auth }) => {
			// Logged in users are authenticated, otherwise redirect to login page
			return !!auth
		},
		async redirect({ url, baseUrl }) {
			// después del login, redirigir al portal
			// return `${baseUrl}/portaldelalumno`;
			// return `${process.env.FRAMER_URL}/portaldelalumno`;
			return "https://only-benefits-148004.framer.app/portaldelalumno";
		},
	},
});

export async function getToken() {
	const token = await rawGetToken({
		req: { headers: await headers() },
		secret: process.env.AUTH_SECRET,
	});

	return token;
}