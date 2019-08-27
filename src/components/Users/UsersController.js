import axios from 'axios';

const Controller = {
	getUsers: async function(token) {
		try {
			const response = await axios.get(`${localStorage.getItem('serverURL')}/users`, {
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
			const response = await axios.put(`${localStorage.getItem('serverURL')}/users/${id}`, data, {
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
      const response = await axios.delete(`${localStorage.getItem('serverURL')}/users/${id}`, {
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
  
  inviteUsers: async function(token, users) {
    try {
      const response = await axios.post(`${localStorage.getItem('serverURL')}/admin/inviteUsers`, { users }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return response;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

export default Controller;