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
	}
}

export default Controller;