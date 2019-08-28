let AUTH_URL = 'https://skybunk-auth-dev.herokuapp.com';

if (process.env.NODE_ENV === 'development') {
	AUTH_URL = 'https://skybunk-auth-dev.herokuapp.com'
} else if (process.env.NODE_ENV === 'staging') {
	AUTH_URL = 'https://skybunk-auth-staging.herokuapp.com'
} else if (process.env.NODE_ENV === 'production') {
	AUTH_URL = 'https://skybunk-auth-production.herokuapp.com'
}

export {
	AUTH_URL
}