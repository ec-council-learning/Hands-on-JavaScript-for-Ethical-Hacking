const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

var app = express();
var popularApi = express();

app.use(cookieParser())
app.use(bodyParser.json());
app.use(cors({
    origin: function (origin, callback) {
        callback(null, origin);
    },
    credentials: true
}));

const popularApiUrl = 'http://localhost:10003/api'

popularApi.use(bodyParser.json());
popularApi.use(cors({
    origin: function (origin, callback) {
        callback(null, origin);
    },
    credentials: true
}));

app.post('/', function (req, res) {
    console.log(`/ [POST] -> {}`);
    if (req.cookies.profile) {
        var str = new Buffer.from(req.cookies.profile, 'base64').toString();
        var nameValue = JSON.parse(str).name;
        var validName = /^[a-zA-Z]+$/.test(nameValue || '');
        if (validName) {
            fetch(`${popularApiUrl}/profile`,
                {
                    method: 'POST',
                    body: JSON.stringify({ name: nameValue, apiKey: 'V2VsbERvbmVSZWNvZ25pemluZ0Jhc2U2NCEh' } ),
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(apiRes => apiRes.json())
                .then(data => {
                    console.log(`/ [POST] <- ${JSON.stringify(data)}`);
                    res.json(data);
                });
        }
    }
    else {
        res.json({ name: "", startsWith: "", length: "" });
    }
});

app.post('/changeProfile', function (req, res) {
    console.log(`/changeProfile [POST] -> ${JSON.stringify(req.body)}`);

    res.cookie('profile', new Buffer.from(JSON.stringify({ name: req.body.name })).toString('base64'), {
        maxAge: 900000,
        httpOnly: true
    });

    fetch(`${popularApiUrl}/profile`,
        {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(apiRes => apiRes.json())
        .then(data => {
            console.log(`/changeProfile [POST] <- ${JSON.stringify(data)}`);
            res.json(data);
        });
});

popularApi.post('/api/profile', function (req, res) {
    //console.log(`[PopularApi]/api/profile [POST] -> ${JSON.stringify(req.body)}`);
    var body = req.body;

    if(!validateApiKey(body.apiKey)){
        res.status(401).json({ name: "", startsWith: "", length: "" });
        return;
    }

    if (body && validateApiKey(body.apiKey) && body.name) {
        var validName = /^[a-zA-Z]+$/.test(body.name || '');
        if (validName) {
            var data = { name: body.name, startsWith: body.name[0], length: body.name.length };
            //console.log(`[PopularApi]/api/profile [POST] <- ${JSON.stringify(data)}`);
            res.json(data);
            return;
        }
    }
    res.json({ name: "", startsWith: "", length: "" });
});

popularApi.post('/api/topSecret', function (req, res) {
    if(validateApiKey(req.body.apiKey)){
        res.send('\nCongratulations! You just used the hardcoded API key to exploit the OWASP A07:2021 vulnerability.');
    }
    else{
        // fake the 404 response
        res.status(404).send('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot POST /api/topSecret</pre>\n</body>\n</html>\n');
    }
});

popularApi.get('/api/info.json', function (req, res) {
    res.json([
        {
            path: '/api/info.json',
            method: 'GET',
            description: 'Lists available endpoints'
        },
        {
            path: '/api/profile',
            method: 'POST',
            expects: JSON.stringify({ name: 'string', apikey: 'string' }),
            description: 'Returns length and the starting character of "name"'
        },
        {
            path: '/api/topSecret',
            method: 'POST',
            expects: JSON.stringify({ apikey: 'string' }),
            description: 'Availably only for licensed members'
        }
    ]);
});

validateApiKey = function (apiKey){
    return apiKey === 'V2VsbERvbmVSZWNvZ25pemluZ0Jhc2U2NCEh';
}

app.listen(3003, function () {
    console.log("server is running on port 3003");
});

popularApi.listen(10003, function () {
    //run silently
});




