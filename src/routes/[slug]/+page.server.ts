import { error } from '@sveltejs/kit';

// Load environment variable
import { PUBLIC_REST_API_PROTOCOL, PUBLIC_REST_API_HOSTNAME, PUBLIC_REST_API_PORT } from '$env/static/public';

const VALIDATE_BOARD_ENDPOINT = `${PUBLIC_REST_API_PROTOCOL}://${PUBLIC_REST_API_HOSTNAME}:${PUBLIC_REST_API_PORT}/v1/board/validate`;

export async function load({ params }) {
	try {
		const response = await fetch(VALIDATE_BOARD_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ boardId: params.slug })
		});
		if (response.ok) {
			return {
				slug: params.slug
			};
		}
		throw error(404, 'Board does not exist');
	} catch (err) {
		throw error(500, 'Failed to fetch data with error:' + err);
	}
}