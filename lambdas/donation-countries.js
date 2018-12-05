const redis = require('redis');
var client = redis.createClient(process.env.PORT, process.env.HOST, {password: process.env.REDIS_PASSWORD});
const {promisify} = require('util');
const getHget = promisify(client.hget).bind(client);

module.exports = {
    main:async function (event, context) {
        console.log('Returns the total donations for one country');
        var country = event.extensions.request.query.country;
        console.log('Donation Country is = ' + country);
    
        var countryTotal = await getHget('myMap', country)
    
        event.extensions.response.status(200).json({'countryTotal': countryTotal}).send();
    }
}