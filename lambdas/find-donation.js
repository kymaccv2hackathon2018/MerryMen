const redis = require('redis');
var client = redis.createClient(process.env.PORT, process.env.HOST, {password: process.env.REDIS_PASSWORD});
const {promisify} = require('util');

const getAsync = promisify(client.get).bind(client);

module.exports = { main: async function (event, context) {
    var orderId = event.extensions.request.query.orderId
    console.log('Retrieve a donation for orderId ' + orderId)

    var amount = await getAsync('A-' + orderId);
    var country = await getAsync('C-' + orderId);
    var email = await getAsync('E-' + orderId);
    
    //client.hdel('myMap', 'DE')
    //client.hdel('myMap', 'GB')
    //client.hmset('myMap', 'CA', 5490)
    //client.set('total', 0);
    
    event.extensions.response.status(200).json({"amount":amount,"country":country,"email":email}).send();
} }