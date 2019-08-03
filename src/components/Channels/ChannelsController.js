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
	},

	updateChannel: async function(token, id, data) {
		try {
			const response = await axios.put(`${API_URL}/channels/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response;
		} catch (e) {
      console.log(e);
      return e;
    }
	},

  deleteChannel: async function(token, id) {
    try {
      const response = await axios.delete(`${API_URL}/channels/${id}`, {
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