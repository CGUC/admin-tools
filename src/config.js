const env = 'dev';

//API_URL: 'http://skybunk.grebelife.com',
let API_URL = 'http://skybunk.grebelife.com'

if (env === 'dev') {
	API_URL = 'https://skybunk-development.herokuapp.com'
}

export {
	API_URL
}