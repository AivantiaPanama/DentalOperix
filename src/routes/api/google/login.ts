import { getServerConfig } from "@/lib/config.server";
import {
  createOAuthStateCookie,
  generateOAuthState,
  secureOAuthCookie,
} from "@/lib/oauth-state.server";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";

export async function GET() {
  try {
    const config = getServerConfig();
    const state = generateOAuthState();

    const params = new URLSearchParams({
      client_id: config.googleClientId,
      redirect_uri: config.googleRedirectUri,
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      scope: config.googleScopes,
      state,
    });

    const url = `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
    const cookie = createOAuthStateCookie(state, secureOAuthCookie);

    return new Response(null, {
      status: 302,
      headers: {
        Location: url,
        "Set-Cookie": cookie,
      },
    });
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
