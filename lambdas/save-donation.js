const request = require('request');
const redis = require('redis');
var client = redis.createClient(process.env.PORT, process.env.HOST, {password: process.env.REDIS_PASSWORD});
const {promisify} = require('util');

const getAsync = promisify(client.get).bind(client);
const hmgetAsync = promisify(client.hmget).bind(client);

module.exports = { main: async function (event, context) {
    let orderId = event.data.orderCode
    console.log('Save a donation for order ID: ' + orderId);
    
    let occUrl = process.env.GATEWAY_URL + '/electronics/orders/' + orderId
    console.log('URL: ' + occUrl)
    var headers = { 
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    
    request.get({ url: occUrl, headers: headers }, async function (error, response, body) {
        var occOrder = JSON.parse(body)
        console.log('body: ' + JSON.stringify(occOrder))
        let amount = parseInt(occOrder.deliveryAddress.line2) || 0
        let country = occOrder.deliveryAddress.country.isocode
        let email = occOrder.user.uid
    
        console.log('amount: ' + amount)
        console.log('country: ' + country)
        console.log('email: ' + email)
        
        //Set amount
        client.set('A-' + orderId, amount)
        
        //Set country
        client.set('C-' + orderId, country)
        
        //Set amount
        client.set('E-' + orderId, email)
    
        //Set Total
        var total = await getAsync('total');
        var num = parseInt(total) || 0;
        if (num > 0)
        {
            var newTotal = parseInt(total) + parseInt(amount)
            console.log('new total: ' + newTotal)
            client.set('total', newTotal)
        }
        else
        {
            client.set('total', parseInt(amount))
        }
        
        //Set country total
        var currentTotal = await hmgetAsync('myMap', country)
        var num2 = parseInt(currentTotal) || 0;

        if (num2 > 0)
        {
            console.log('currentTotal: ' + parseInt(currentTotal))
            var countryTotal = parseInt(currentTotal) + parseInt(amount)
            client.hmset('myMap', country, countryTotal)
            
        }
        else
        {
            client.hmset('myMap', country, parseInt(amount))
        }
        
    })
} }