// routes/api/oauth/github/+server.ts
import { auth, githubAuth } from "$lib/server/lucia.js";
import { redirect } from "@sveltejs/kit";
import { error } from '@sveltejs/kit';

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies, url, locals }) => {
  // get code and state params from url
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // get stored state from cookies
  const storedState = cookies.get("github_oauth_state");

  // validate state
  if (!state || !storedState || state !== storedState) {
    throw error(401, "Login failed")
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { existingUser, providerUser, createUser } = await githubAuth(url.origin).validateCallback(code!);

    const getUser = async () => {
      if (existingUser) return existingUser;
      // create a new user if the user does not exist
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return await createUser({
        // attributes
        username: providerUser.login,
      });
    };
    const user = await getUser();
    const session = await auth.createSession(user.id);
    locals.auth.setSession(session);
  } catch (e) {
    // invalid code
    return new Response("Invalid Code", {
      status: 500
    });
  }
  return new Response(null, {headers: { Location: '/' }, status: 302})
};