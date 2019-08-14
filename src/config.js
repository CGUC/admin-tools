const env = 'dev';

let AUTH_URL = 'https://skybunk-auth-dev.herokuapp.com';
if (env === 'dev') {
	AUTH_URL = 'https://skybunk-auth-dev.herokuapp.com'
}

let API_URL = '';
function updateAPIUrl(url) {
	API_URL = url;
}

export {
	API_URL,
	AUTH_URL,
	updateAPIUrl
}