import axios from 'axios';
import { API_URL } from '../../config.js'

const Controller = {
	getChannels: async function(token) {
		try {
			const response = await axios.get(`${API_URL}/channels`, {
				headers: {
					Authorization: `Bearer ${token}`
				} 
			})
			console.log(response)
			return response.data;
		} catch (e) {
			console.log(e);
		}
	},

	createChannel: async function(token, data) {
		try {
			const response = await axios.post(`${API_URL}/channels`, data, {
				headers: {
					Authorization: `Bearer ${token}`
				} 
			});

			return response;
		} catch (e) {
			console.log(e);
			return e;
		}
	}
}

export default Controller;