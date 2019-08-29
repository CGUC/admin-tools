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

			localStorage.setItem('serverURL', authServerLogin.data[0].url);

			const userResponse = await axios.get(`${localStorage.getItem('serverURL')}/users/loggedInUser`, {
				headers: {
					Authorization: `Bearer ${authServerLogin.data[0].token}`
				} 
			});

			if (userResponse.data.role.includes('admin'))
				return authServerLogin;
			else
				return {
					data: { err: {message: 'You must be an admin in order to login'}}
				};

		} catch (e) {
			console.log(e);
			return e.response
		}
	}
}

export default Controller;