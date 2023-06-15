// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { AuthUser } from '@prisma/client'

declare global {
	namespace App {
		interface Locals {
			auth: import("lucia-auth").AuthRequest;
		}
		// interface Error {}
		// interface PageData {}
		// interface Platform {}
	}
}

/// <reference types="lucia-auth" />
declare global {
	namespace Lucia {
		type Auth = import("$lib/server/lucia").Auth;
		type UserAttributes = AuthUser
	}
}

export {};
