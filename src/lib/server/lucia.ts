// lib/server/lucia.ts
import lucia from "lucia-auth";
import { sveltekit } from "lucia-auth/middleware";
import prismaAdapter from "@lucia-auth/adapter-prisma";
import { dev } from "$app/environment";
import { prisma } from "./prisma";
import { github } from "@lucia-auth/oauth/providers";
import { GITHUB_CLIENTID, GITHUB_CLIENTSECRET, LOCAL_GITHUB_CLIENTID, LOCAL_GITHUB_CLIENTSECRET, NETLIFY_GITHUB_CLIENTID, NETLIFY_GITHUB_CLIENTSECRET } from '$env/static/private';

type GitHubClient = {client: string, secret: string};

type GitHubClients = {[key: string]: GitHubClient}

const githubClients: GitHubClients = {
	"http://localhost:5173": {client: LOCAL_GITHUB_CLIENTID, secret: LOCAL_GITHUB_CLIENTSECRET},
	"https://jakemstar.netlify.app": {client: NETLIFY_GITHUB_CLIENTID, secret: NETLIFY_GITHUB_CLIENTSECRET},
	"https://jakemstar.dev": {client: GITHUB_CLIENTID, secret: GITHUB_CLIENTSECRET}
}

export const auth = lucia({
	adapter: prismaAdapter (prisma),
	env: dev ? "DEV" : "PROD",
	middleware: sveltekit(),
	transformDatabaseUser: (userData) => {
		return {
			id: userData.id,
			username: userData.username
		}
	}
});

export const githubAuth = (urlOrigin: string) => {
	return github(auth, {clientId: githubClients[urlOrigin].client, clientSecret: githubClients[urlOrigin].secret, redirectUri: urlOrigin + "/api/oauth/github"});
}

export type Auth = typeof auth;