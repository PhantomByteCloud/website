import {
	PostgrestError,
	Session,
	SupabaseClientOptions,
	createClient,
} from '@supabase/supabase-js';
import { Database } from './schema';
import { Client } from './types';

const projectUrl = import.meta.env.VITE_SUPABASE_AUTH_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!projectUrl) {
	throw new Error(
		'VITE_SUPABASE_AUTH_URL is not defined as an environment variable'
	);
}

if (!anonKey) {
	throw new Error(
		'VITE_SUPABASE_ANON_KEY is not defined as an environment variable'
	);
}

const options = {
	db: {
		schema: 'public' as const,
	},
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
	},
} as SupabaseClientOptions<'public'>;

export const supabase = createClient<Database>(projectUrl, anonKey, options);

/** Gets the current user session */
export async function getSession(): Promise<Session | null> {
	return supabase.auth
		.getSession()
		.then(({ data: { session } }) => session)
		.catch(() => null);
}

/** Get the JSON object for the logged in user. */
export async function getUser() {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return user;
}

/** Checks if the current user is authenticated or not */
export async function isAuthenticated(): Promise<boolean> {
	const u = await getUser();
	return u !== null;
}

export async function getClientAccount({
	user_id,
}: {
	user_id: string | undefined;
}): Promise<Client | null> {
	if (!user_id) return null;

	try {
		let { data: client, error } = await supabase
			.from('clients')
			.select('*')
			.eq('user_id', user_id)
			.single();

		if (error) {
			console.error('Error fetching client:', error);
			return null;
		}

		if (!client) {
			console.log('No client found with the specified user_id');
			return null;
		}

		return client;
	} catch (error) {
		console.error('An error occurred while fetching client:', error);
		return null;
	}
}

// todo - fetch this data from our rust api
export async function getGlobalSystemSettings() {
	throw new Error('Not implemented');
}

/**
 * Updates the client's username
 * @param user_id The user_id of the client
 * @returns "success" if the update was successful, "error" otherwise
 */
export async function updateClientUsername(user_id: string, newUsername: string) {
	try {
		let { data: client, error } = await supabase
			.from('clients')
			.update({ username: newUsername })
			.eq('user_id', user_id)
			.select('*')
			.single();

		if (error) {
			console.error('Error updating client username:', error);
			return {
				result: 'error',
				pg_error: createCleanError(error),
				client: null,
			};
		}

		if (!client) {
			console.error('No client found with the specified user_id');
			return {
				result: 'error',
				pg_error: null,
				client: null,
			};
		}

		return {
			result: 'success',
			pg_error: null,
			client,
		};

	} catch (error) {
		console.error('An error occurred while updating the client username:', error);
		return {
			result: 'error',
			pg_error: null,
			client: null,
		};
	}
}


function createCleanError(error: PostgrestError) {
	return `Error ${error.code}: ${error.message}`
}