const redis = require('redis');
var client = redis.createClient(process.env.PORT, process.env.HOST, {password: process.env.REDIS_PASSWORD});
const {promisify} = require('util');
const getHgetAll = promisify(client.hgetall).bind(client);

module.exports = { main:async function (event, context) {
    console.log('Returns a map of total donations per country');
    
    var myMap = await getHgetAll('myMap')
    
    event.extensions.response.status(200).json(myMap).send();
} }