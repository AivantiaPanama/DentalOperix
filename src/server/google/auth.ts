import { google } from "googleapis";
import { getServerConfig } from "@/lib/config.server";

export function getGoogleAuth() {
  const config = getServerConfig();

  const auth = new google.auth.OAuth2({
    clientId: config.googleClientId,
    clientSecret: config.googleClientSecret,
    redirectUri: config.googleRedirectUri,
  });

  if (!config.googleRefreshToken) {
    throw new Error(
      "Missing GOOGLE_REFRESH_TOKEN. This endpoint requires a refresh token to authenticate with Google.",
    );
  }

  auth.setCredentials({ refresh_token: config.googleRefreshToken });
  return auth;
}
