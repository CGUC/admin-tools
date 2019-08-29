import axios from 'axios';

const Controller = {
	getStats: async function(token) {
		try {
			const response = await axios.get(`${localStorage.getItem('serverURL')}/analytics/eyes`, {
				headers: {
					Authorization: `Bearer ${token}`
				} 
			})
			return response.data;
		} catch (e) {
			console.log(e);
			return { error: true };
		}
	}
}

export default Controller;