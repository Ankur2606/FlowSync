import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { google } from "googleapis";

// These scopes allow for Gmail access and message reading
const GOOGLE_AUTHORIZATION_SCOPE = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.labels",
];

// Handler for NextAuth.js
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: GOOGLE_AUTHORIZATION_SCOPE.join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    // We'll add Slack provider here later
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token and refresh_token to the token
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.provider = account.provider;
      }
      // Check if token has expired
      if (token.expiresAt && Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }
      
      // Token has expired, try to refresh
      if (token.provider === "google" && token.refreshToken) {
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );
        
        oauth2Client.setCredentials({
          refresh_token: token.refreshToken as string,
        });
        
        try {
          const { credentials } = await oauth2Client.refreshAccessToken();
          if (credentials && credentials.access_token) {
            token.accessToken = credentials.access_token;
            token.expiresAt = Math.floor((Date.now() + (credentials.expiry_date || 3600 * 1000)) / 1000);
          }
        } catch (error) {
          console.error("Error refreshing access token", error);
          // Token refresh failed - sign user out and use default token
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };