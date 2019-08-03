import axios from 'axios';
import { API_URL } from '../../config.js'

const Controller = {
	getUsers: async function(token) {
		try {
			const response = await axios.get(`${API_URL}/users`, {
				headers: {
					Authorization: `Bearer ${token}`
				} 
			})

			return response.data;
		} catch (e) {
			console.log(e);
		}
	},

	updateUser: async function(token, id, data) {
		try {
			const response = await axios.put(`${API_URL}/users/${id}`, data, {
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

  deleteUser: async function(token, id) {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`, {
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