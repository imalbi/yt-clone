export async function load({ cookies }) {
	const userData = cookies.get('user_data');
	console.log('userData:', userData); // Debug print
	return {
		user: userData ? JSON.parse(userData) : null
	};
}
