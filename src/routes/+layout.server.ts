export async function load({ cookies }) {
	const userData = cookies.get('user_data');
	return {
		user: userData ? JSON.parse(userData) : null
	};
}
