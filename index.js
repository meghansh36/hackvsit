// import { setInterval } from 'timers';

//import { request } from 'http';

var flock = require('flockos');
var util = require('util');
var express = require('express');
var Mustache = require('mustache');
var config = require('./config');
var store = require('./store');
var ip = require('request-ip')
const request= require('request');
const fs=require('fs');
const short=require('./short');
var country='Indonesia';
short._short(country);
const eq=require('./earthquake');
eq._eq(country);
const tsunami=require('./tsunami');
tsunami._tsunami(country);
const volcano=require('./volcano');
volcano._volcano(country);

// read the app id and secret from the config file (config.js in the
// same directory), and set them for the SDK. This required for event
// token verification to work
flock.setAppId(config.appId);
flock.setAppSecret(config.appSecret);

var app = express();

// const requestIp = require('request-ip');
// app.use(requestIp.mw())
 
// app.use(function(req, res) {
//     const ip = req.clientIp;
//     console.log('ip address' + ip);
//     res.end(ip);
// });




// since we use express, we can simply use the token verifier
// middleware to ensure that all event tokens are valid
app.use(flock.events.tokenVerifier);
// const ipMiddleware = (req,res,next) => {
//     const clientip = ip.getClientIp(req);
//     console.log(clientip);
//     next();
// }
// app.use(ipMiddleware);

app.get('/',function(req, res){
  res.send('works!');
});
// listen for events on /events
app.post('/events', flock.events.listener);

// listen for app.install event, mapping of user id to tokens is saved
// in the in-memory database
var user_id1 = 'aa';
flock.events.on('app.install', function (event) {
    store.saveUserToken(event.userId, event.token);
    user_id1 = event.userId;
    console.log('int install' + user_id1);
});

// flock.events.on('app.uninstall', function (event){

// })



// setInterval(function(){
//     console.log('in timeout' + store.getid());
// },10000);
// console.log('outermost' + user_id1);

// listen for client.slashCommand, this gives us the scrap entered by
// the user in the "text" property of the event. This text is saved in
// the in-memory database, following which a message is sent to the
// conversation.
//
// We make use of FlockML to send a richer message then what was
// possible using plain text. This FlockML makes use of the <action>
// tag to open the list of scraps in a sidebar widget. See
// message.mustache.flockml.



var messageTemplate = require('fs').readFileSync('message.mustache.flockml', 'utf8');
flock.events.on('client.slashCommand', function (event) {
    // store.saveScrap(event.userId, event.chat, event.text);
    var flockml = Mustache.render(messageTemplate, { event: event, widgetURL: config.endpoint + '/scraps' });
    console.log(flockml);
    // flock.callMethod('chat.sendMessage', store.getUserToken(event.userId), {
    //     to: event.chat,
    //     text: util.format('%s saved a scrap: %s', event.userName, event.text),
    //     flockml: flockml
    // }, function (error, response) {
    //     if (!error) {
    //         console.log('uid for message: ' + response.uid);
    //     } else {
    //         console.log('error sending message: ' + error);
    //     }
    // });
    console.log(event.userId);
    // flock.callMethod('chat.sendMessage',config.botToken, {
    //     to: event.chat,
    //     text: 'hello',
    //     onBehalfOf:event.userId
    // }, function(error,response) {
    //     if (!error) {
    //         console.log('uid for message: ' + response.uid);
    //     } else {
    //         console.log('error sending message: ' + response + '\nError:'+error);
    //     }
    // })
});

setTimeout(function(){
    var user = store.getid();
    // app.get('/scraps', function (req, res) {
    //     console.log('request query: ', req.query);
    //     var userId = res.locals.eventTokenPayload.userId;
    //     // console.log('user id: ', userId);
    //     var event = JSON.parse(req.query.flockEvent);
    //     // if (event.userId !== userId) {
    //     //     console.log('userId in event doesn\'t match the one in event token');
    //     //     res.sendStatus(403);
    //     //     return;
    //     // }
    //     console.log('event: ', event);
    //     // res.set('Content-Type', 'text/html');
    //     // var list = store.listScraps(userId, event.chat);
    //     // console.log('list: ', list);
    //     // if (list) {
    //     //     list = list.map(function (text) {
    //     //         return text.replace(urlRegex, '<a href="$&">$&</a>');
    //     //     });
    //     // }
    //     // var body = Mustache.render(widgetTemplate, { list: list, event: event });
    //     // res.send(body);
    //     res.end();
    // });

    user.forEach(function(i){
        var flockml = Mustache.render(messageTemplate, { widgetURL: config.endpoint + '/scraps' });
        console.log(flockml);
        flock.callMethod('chat.sendMessage',config.botToken, {
            to: i,
            flockml: flockml
            //onBehalfOf:event.userId
        }, function(error,response) {
            if (!error) {
                console.log('uid for message: ' + response.uid);
            } else {
                console.log('error sending message: ' + response + '\nError:'+error);
            }
        });
    });

},10000)

setInterval(function(){
     var user = store.getid();
    // app.get('/scraps', function (req, res) {
    //     console.log('request query: ', req.query);
    //     var userId = res.locals.eventTokenPayload.userId;
    //     // console.log('user id: ', userId);
    //     var event = JSON.parse(req.query.flockEvent);
    //     // if (event.userId !== userId) {
    //     //     console.log('userId in event doesn\'t match the one in event token');
    //     //     res.sendStatus(403);
    //     //     return;
    //     // }
    //     console.log('event: ', event);
    //     // res.set('Content-Type', 'text/html');
    //     // var list = store.listScraps(userId, event.chat);
    //     // console.log('list: ', list);
    //     // if (list) {
    //     //     list = list.map(function (text) {
    //     //         return text.replace(urlRegex, '<a href="$&">$&</a>');
    //     //     });
    //     // }
    //     // var body = Mustache.render(widgetTemplate, { list: list, event: event });
    //     // res.send(body);
    //     res.end();
    // });

    user.forEach(function(i){
        var flockml = Mustache.render(messageTemplate, { widgetURL: config.endpoint + '/scraps' });
        console.log(flockml);
        flock.callMethod('chat.sendMessage',config.botToken, {
            to: i,
            flockml: flockml
            //onBehalfOf:event.userId
        }, function(error,response) {
            if (!error) {
                console.log('uid for message: ' + response.uid);
            } else {
                console.log('error sending message: ' + response + '\nError:'+error);
            }
        });
    });


},1000*60*60)








// The widget path is /scraps. The userId and chat properties of the
// event are sufficient for us to retrieve the list of scraps for this
// conversation.
var widgetTemplate = require('fs').readFileSync('index.mustache.html', 'utf8');
var urlRegex = new RegExp('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?');
app.get('/scraps', function (req, res) {
    console.log('request query: ', req.query);
    var userId = res.locals.eventTokenPayload.userId;
    console.log('user id: ', userId);
    var event = JSON.parse(req.query.flockEvent);
    console.log('event user id' + event.userId);
    if (event.userId !== userId) {
        console.log('userId in event doesn\'t match the one in event token');
        res.sendStatus(403);
        return;
    }

    // console.log('response userid' + userId);
    console.log('event: ', event);
    var grouplist;
    console.log('token call '+store.getUserToken(event.userId));
   flock.callMethod('groups.list', store.getUserToken(event.userId),{},
    function(error,response)
    {
        if(!error)
        {
            console.log('response ='+ JSON.stringify(response));
            // store.saveGroup(response);
            console.log(response[2].id);
            for(var i=1; i<response.length; i++){
            flock.callMethod('chat.sendMessage',store.getUserToken(event.userId),{
                to: response[i].id,
                text: 'I am in trouble. '
            },function(err,res){
                if(!error) {
                    console.log(res);
                }
                else{
                    console.log(err);
                }
            });
        }
        }
        else{
            console.log('error = '+ error)
        }
    }
    );
    // console.log('json ' + channels);
    res.set('Content-Type', 'text/html');
    // console.log('Grouplist = ', JSON.stringify(store.returnGroup()));
    // var list = store.listScraps(userId, event.chat);
    // console.log('list: ', list);
    // if (list) {
    //     list = list.map(function (text) {
    //         return text.replace(urlRegex, '<a href="$&">$&</a>');
    //     });
    // }
    // var body = Mustache.render(widgetTemplate, { list: list, event: event });
    res.send('works');
});

// Start the listener after reading the port from config
var port = config.port || 8082;
app.listen(port, function () {
    console.log('Listening on port: ' + port);
});
