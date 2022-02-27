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
                    body: JSON.stringify({ name: nameValue }),
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
    if (body && body.name) {
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

popularApi.get('/api/info.json', function (req, res) {
    res.json({'/api/info.json': 'This method'});
});

app.listen(3003, function () {
    console.log("server is running on port 3003");
});

popularApi.listen(10003, function () {
    //run silently
});




