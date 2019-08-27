import axios from 'axios';

const Controller = {
	getChannels: async function(token) {
		try {
			const response = await axios.get(`${localStorage.getItem('serverURL')}/channels`, {
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
			const response = await axios.post(`${localStorage.getItem('serverURL')}/channels`, data, {
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
			const response = await axios.put(`${localStorage.getItem('serverURL')}/channels/${id}`, data, {
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
      const response = await axios.delete(`${localStorage.getItem('serverURL')}/channels/${id}`, {
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