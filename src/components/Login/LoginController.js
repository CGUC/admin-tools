import axios from 'axios';
import { API_URL } from '../../config.js'

const Controller = {
	tryLogin: async function(username, password) {
		try {
			const loginResponse = await axios.post(`${API_URL}/users/login`, {
				username,
				password
			});

			if (loginResponse.data.err) return loginResponse.data;

			const userResponse = await axios.get(`${API_URL}/users/loggedInUser`, {
				headers: {
					Authorization: `Bearer ${loginResponse.data.token}`
				} 
			});

			if (userResponse.data.role.includes('admin'))
				return loginResponse.data;
			else
				return {
					err: {message: 'You must be an admin in order to login'}
				};

		} catch (e) {
			console.log(e);
			return {
				message: 'Unable to login.'
			}
		}
	}
}

export default Controller;