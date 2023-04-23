const redis = require("redis");

const client = redis.createClient(process.env.REDIS_URL);
client.connect();

const setAccessJwtToRedis = (key, value) => {
	return new Promise((resolve, reject) => {
		try {
			return client.set(key, value, (err, res) => {
				if (err) {
					reject(err);
				}
				resolve(res);
			});
		} catch (error) {
			reject(error);
		}
	});
};

const getAccessJwtFromRedis = (key) => {
	return new Promise((resolve, reject) => {
		try {
			client
				.get(key)
				.then((res) => resolve(res))
				.catch((err) => reject(err));
		} catch (error) {
			reject(error);
		}
	});
};

const deleteOldJwtTokenfromRedis = (key) => {
	try {
		client.del(key);
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	setAccessJwtToRedis,
	getAccessJwtFromRedis,
	deleteOldJwtTokenfromRedis,
};
