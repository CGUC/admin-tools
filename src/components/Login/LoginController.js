import axios from 'axios';
import { API_URL } from '../../config.js'

const Controller = {
	tryLogin: async function(username, password) {
		try {
			const response = await axios.post(`${API_URL}/users/login`, {
				username,
				password
			});

			return response.data;
		} catch (e) {
			console.log(e);
			return {
				message: 'Unable to login.'
			}
		}
	}
}

export default Controller;