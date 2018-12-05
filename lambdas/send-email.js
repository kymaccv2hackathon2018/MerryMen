const request = require('request');
const traceHeaders = ['x-request-id', 'x-b3-traceid', 'x-b3-spanid', 'x-b3-parentspanid', 'x-b3-sampled', 'x-b3-Flags', 'x-ot-span-context']
module.exports = {
    main: function (event, context) {
        console.log("In Lambda with event.data.orderCode: " + event.data.orderCode);
        orderId = event.data.orderCode;
        var url = `${process.env.GATEWAY_URL}/electronics/orders/${orderId}`;
        var userEnvironment = `${process.env.USER_ENVIRONMENT}`;
        if (userEnvironment === undefined) {
            console.log('Environment variable USER_ENVIRONMENT is not defined')
        }
        console.log("In Lambda with userEnvironment: " + userEnvironment)
        console.log("In Lambda with url: " + url)


        // Pass the headers through to the next calls, so that tracing will work
        var traceCtxHeaders = extractTraceHeaders(event.extensions.request.headers)
        request.get({headers: traceCtxHeaders, url: url, json: true}, function (error, response, body) {
            if (error === null) {
                console.log("In Lambda with response.statusCode: " + response.statusCode)
                if (response.statusCode == '200')
                {
                    donnationAmount = body.deliveryAddress.line2;
                    customerEmail = body.user.uid
                    // setup email data with unicode symbols
                    if (donnationAmount > 0) {
                        let mailOptions = {
                            from: '"Kyma Hackathon👻" <kymamerrymen@gmail.com>', // sender address
                            to: customerEmail, // list of receivers
                            subject: 'Thanks for your generous donnation with order: ' + orderId, // Subject line
                            text: 'Thanks for your generous donnation of the amount: ' + donnationAmount, // plain text body
                            html: '<b>Thanks for your generous donnation of the amount:</b> ' + donnationAmount // plain text body
                        };
                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message sent: %s', info.messageId);

                        });
                    }
                } else {
                    console.log('Call to EC webservice failed with status code ' + response.statusCode)
                    console.log(response.body)
                }
            } else {
                console.log(error)
            }
        })
    }
}


function extractTraceHeaders(headers) {
    // Used to pass the headers through to the next calls, so that tracing will work
    console.log(headers)
    var map = {};
    for (var i in traceHeaders) {
        h = traceHeaders[i]
        headerVal = headers[h]
        console.log('header ' + h + "-" + headerVal)
        if (headerVal !== undefined) {
            console.log('if not undefined header' + h + "-" + headerVal)
            map[h] = headerVal
        }
    }
    return map;
}


'use strict';
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'kymamerrymen@gmail.com',
        pass: 'ILoveKyma'
    }
});