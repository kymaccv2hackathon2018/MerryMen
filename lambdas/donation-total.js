const redis = require('redis');
var client = redis.createClient(process.env.PORT, process.env.HOST, {password: process.env.REDIS_PASSWORD});
const {promisify} = require('util');

const getAsync = promisify(client.get).bind(client);

module.exports = { main:async function (event, context) {
    console.log('Retrieves the total amount of donations')

    var total = await getAsync('total')
    
    event.extensions.response.status(200).json({'totalamount':total}).send();
} }