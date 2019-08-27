import axios from 'axios';
import { AUTH_URL, updateAPIUrl } from '../../config.js'

const Controller = {
	tryLogin: async function(username, password) {
		try {

			const authServerLogin = await axios.post(`${AUTH_URL}/users/login`, {
				username,
				password
			})
			if (authServerLogin.status !== 200) return authServerLogin;

			localStorage.setItem('serverURL', authServerLogin.data.servers[0].url);
			
			const loginResponse = await axios.post(`${localStorage.getItem('serverURL')}/users/login`, {
				username,
				password
			});
			if (loginResponse.status !== 200 || loginResponse.data.err) return loginResponse;

			const userResponse = await axios.get(`${localStorage.getItem('serverURL')}/users/loggedInUser`, {
				headers: {
					Authorization: `Bearer ${loginResponse.data.token}`
				} 
			});

			if (userResponse.data.role.includes('admin'))
				return loginResponse;
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