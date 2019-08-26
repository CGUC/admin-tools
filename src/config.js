const env = process.env.NODE_ENV;
let AUTH_URL = 'https://skybunk-auth-dev.herokuapp.com';

if (env === 'development') {
	AUTH_URL = 'https://skybunk-auth-dev.herokuapp.com'
} else if (env === 'staging') {
	AUTH_URL = 'https://skybunk-auth-staging.herokuapp.com'
} else if (env === 'production') {
	AUTH_URL = 'https://skybunk-auth-production.herokuapp.com'
}
console.log(env);
let API_URL = '';
function updateAPIUrl(url) {
	API_URL = url;
}

export {
	API_URL,
	AUTH_URL,
	updateAPIUrl
}