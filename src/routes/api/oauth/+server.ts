// routes/api/oauth/+server.ts
import { githubAuth } from "$lib/server/lucia.js";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, cookies, url }) => {
  const session = await locals.auth.validate()
  if (session) {
    console.log("User already has session, not logging in")
    return new Response("Already logged in dummy", {
      status: 302,
      headers: {
        location: '/'
      }
    });
  }

  // get url to redirect the user to, with the state
  const [authUrl, state] = await githubAuth(url.origin).getAuthorizationUrl();

  // the state can be stored in cookies or localstorage for request validation on callback
  cookies.set("github_oauth_state", state, {
    path: "/api/oauth/github",
    maxAge: 60 * 60
  });

  // redirect to authorization url
  return new Response(null, {
    status: 302,
    headers: {
      location: authUrl.toString()
    }
  });
};