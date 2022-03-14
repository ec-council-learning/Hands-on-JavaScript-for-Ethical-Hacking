const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const hardcore = require('hardcore');
const fetch = require('node-fetch');
const fs = require('fs');

var app = express();
app.use(require('cookie-parser')())
app.use(bodyParser.json());
app.use(require('express-xml-bodyparser')({ strict: false }));
app.use(cors({
    origin: function (origin, callback) {
        callback(null, origin);
    },
    credentials: true
}));

const xmlParseOptions = {
    dereference: ({ path }) => {
        return { entity: fetch(path) };
    }
};

const popularApiUrl = 'http://localhost:10003/api'
const popularApiKey = 'V2VsbERvbmVSZWNvZ25pemluZ0Jhc2U2NCEh';

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
                    body: JSON.stringify({ name: nameValue, apiKey: popularApiKey }),
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
            body: JSON.stringify({ name: req.body.name, apiKey: popularApiKey }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(apiRes => apiRes.json())
        .then(data => {
            console.log(`/changeProfile [POST] <- ${JSON.stringify(data)}`);
            res.json(data);
        });
});

app.post('/changelog', function (req, res, next) {
    console.log(`/changelog [POST] -> ${JSON.stringify(req.body)}`);
    hardcore.parse(req.rawBody, xmlParseOptions)
        .then((doc) => {
            var versions = doc.filterDeep((x) => x.name == 'Version').map(x => x[0]);
            console.log(versions);
            var changelist = [];
            for (const v of versions) {
                let vNumber = v.text;
                data = fs.readFileSync(`changes/${vNumber}.html`, 'utf8').toString().replace(/\r?\n|\r/g, "");
                changelist.push(data);
            }

            res.json(changelist);
        });
});

app.listen(3003, function () {
    console.log("server is running on port 3003");
});


//#region Popular API

var popularApi = express();

popularApi.use(bodyParser.json());
popularApi.use(cors({
    origin: function (origin, callback) {
        callback(null, origin);
    },
    credentials: true
}));

popularApi.post('/api/profile', function (req, res) {
    //console.log(`[PopularApi]/api/profile [POST] -> ${JSON.stringify(req.body)}`);
    var body = req.body;

    if (!validateApiKey(body.apiKey)) {
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
    if (validateApiKey(req.body.apiKey)) {
        res.send('\nCongratulations! You just used the hardcoded API key to exploit the OWASP A07:2021 vulnerability.');
    }
    else {
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

validateApiKey = function (apiKey) {
    return apiKey === 'V2VsbERvbmVSZWNvZ25pemluZ0Jhc2U2NCEh';
}

popularApi.listen(10003, function () {
    //run silently
});
//#endregion



