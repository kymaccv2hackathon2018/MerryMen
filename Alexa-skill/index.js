const request = require('request');
const Alexa = require('ask-sdk-core');
const https = require('https');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Let\'s get started. what do you want to know?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('You can ask me for total donation or total donation per country')
            .withSimpleCard('Donation check', speechText)
            .getResponse();
    }
};

const DonationPerCountryHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        // checks request type
        return request.type === 'IntentRequest'
            && request.intent.name === 'DonationPerCountry';
    },
    async handle(handlerInput) {
        var country = handlerInput.requestEnvelope.request.intent.slots.country.value;

        console.log('COUNTRY' + country)

        let totalCountry = await getCountry('CA')
        // request.get({ url: 'https://donation-countries-2-stage.sa-hackathon-08.cluster.extend.sap.cx/?country=' + country }, function (error, response, body) {
        //     let answer = JSON.parse(body)
        //     let countryTotal = answer.countryTotal;
        //
        //
        // })

        return handlerInput.responseBuilder
            .speak('People from ' + country + ' gave a total of ' + totalCountry.countryTotal)
            .withSimpleCard('Donations in ' + country + ' = ' + totalCountry.countryTotal)
            .getResponse();
    },
};

const DonationTotalHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        // checks request type
        return request.type === 'IntentRequest'
            && request.intent.name === 'DonationTotal';
    },
    async handle(handlerInput) {
        console.log('START')
        let totalDonation = await getTotal()

        return handlerInput.responseBuilder
            .speak('The current total donation is ' + totalDonation.totalamount)
            .withSimpleCard('Total donation: ' + totalDonation.totalamount)
            .getResponse();
    },
};

function getTotal(){
    return new Promise(((resolve, reject) => {
        var options = {
            host: 'donation-total-stage.sa-hackathon-08.cluster.extend.sap.cx',
            method: 'GET',
        };

        const request = https.request(options, (response) => {
            response.setEncoding('utf8');
            let returnData = '';

            response.on('data', (chunk) => {
                returnData += chunk;
            });

            response.on('end', () => {
                resolve(JSON.parse(returnData));
            });

            response.on('error', (error) => {
                reject(error);
            });
        });
        request.end();
    }));
}

function getCountry(countrycode){
    return new Promise(((resolve, reject) => {
        let queryParam = '/?country=' + countrycode
        var options = {
            host: 'donation-countries-2-stage.sa-hackathon-08.cluster.extend.sap.cx',
            method: 'GET',
            path: queryParam
        };

        const request = https.request(options, (response) => {
            response.setEncoding('utf8');
            let returnData = '';

            response.on('data', (chunk) => {
                returnData += chunk;
            });

            response.on('end', () => {
                resolve(JSON.parse(returnData));
            });

            response.on('error', (error) => {
                reject(error);
            });
        });
        request.end();
    }));
}

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        DonationPerCountryHandler,
        DonationTotalHandler)
    .lambda();
