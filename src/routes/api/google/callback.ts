import { getServerConfig, setServerEnvValue } from "@/lib/config.server";
import {
  clearOAuthStateCookie,
  getOAuthStateFromCookies,
  secureOAuthCookie,
} from "@/lib/oauth-state.server";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing authorization code from Google callback.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const savedState = getOAuthStateFromCookies(request);
    if (!state || !savedState || state !== savedState) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid or missing OAuth state.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const config = getServerConfig();

    const body = new URLSearchParams({
      client_id: config.googleClientId,
      client_secret: config.googleClientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: config.googleRedirectUri,
    });

    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Google returned an error while exchanging the authorization code.",
          details: tokenData,
        }),
        {
          status: tokenResponse.status || 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const refreshToken = tokenData.refresh_token;

    if (!refreshToken) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Google did not return a refresh_token.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const isProd = config.nodeEnv === "production";

    if (!isProd) {
      await setServerEnvValue("GOOGLE_REFRESH_TOKEN", refreshToken);
    } else {
      console.warn(
        "Production environment: received refresh token but .env writes are disabled. Configure GOOGLE_REFRESH_TOKEN through your deployment environment.",
      );
    }

    process.env.GOOGLE_REFRESH_TOKEN = refreshToken;

    return new Response(
      `<html><body><h1>Google OAuth callback</h1><p>Authorization completed successfully.</p></body></html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Set-Cookie": clearOAuthStateCookie(secureOAuthCookie),
        },
      },
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
