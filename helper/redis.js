const redis = require("redis");

// const connectRedis = async () => {
// 	const client = redis.createClient();
// 	return await client.connect(process.env.REDIS_URL);
// };

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
			client.get(key, (err, res) => {
				if (err) reject(err);
				resolve(res);
			});
		} catch (error) {
			reject(error);
		}
	});
};

module.exports = { setAccessJwtToRedis, getAccessJwtFromRedis };
