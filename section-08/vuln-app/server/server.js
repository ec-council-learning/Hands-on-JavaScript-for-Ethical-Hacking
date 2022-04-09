const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const xmlParser = require('libxmljs2');
const fetch = require('node-fetch');
const fs = require('fs');
const uuid = require('uuid');
const md5 = require('md5');
const args = require('minimist')(process.argv.slice(2))

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

const popularApiUrl = 'http://localhost:10003/api'
const popularApiKey = 'V2VsbERvbmVSZWNvZ25pemluZ0Jhc2U2NCEh';
const adminSessionId = uuid.v4();
var feedbackStore = [
    'eyAidGltZSI6ICIyMDIyLTAzLTI2IiwgIndobyI6ICJKb2UiLCAiYm9keSI6ICJUZXN0aW5nIGZlZWRiYWNrIGZvcm0uIEkgcmVhbGx5IGxpa2VkIGl0LCBlc3BlY2lhbGx5IGhvdyBib29sZXRwcm9vZiBJIG1hZGUgaXQiIH0='
];
const initialAdminPassword = uuid.v4().replace(/-/g, "");

let allowedUsers = [
    { user: "mike", password: md5("test"), sessionId: "" },
    { user: "admin", password: md5(initialAdminPassword), sessionId: adminSessionId }
];

app.post('/', function (req, res) {
    console.log(`/ [POST] -> {}`);
    if (req.cookies.profile) {
        var str = new Buffer.from(req.cookies.profile, 'base64').toString();
        var nameValue = JSON.parse(str).name;
        var validName = /^[a-zA-Z]+$/.test(nameValue || '');
        if (validName) {
            fetch(`${popularApiUrl}/profile`, {
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
    } else {
        res.json({ name: "", startsWith: "", length: "" });
    }
});

app.post('/changeProfile', function (req, res) {
    console.log(`/changeProfile [POST] -> ${JSON.stringify(req.body)}`);

    res.cookie('profile', new Buffer.from(JSON.stringify({ name: req.body.name })).toString('base64'), {
        maxAge: 900000,
        httpOnly: true
    });

    fetch(`${popularApiUrl}/profile`, {
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

app.post('/changePassword', function (req, res) {
    console.log(`/changePassword [POST] -> ${JSON.stringify(req.body)}`);

    var newPassword = req.body.password; //hashed

    if (req.cookies.whoami) {
        let index = -1;
        let authUser = allowedUsers.find((x, i) => {
            index = i;
            return x.sessionId == req.cookies.whoami;
        });

        if (authUser == undefined) {
            res.status(401).send();
            return;
        }
        allowedUsers[index].password = newPassword;
        res.send("Success");
        return;
    }

    res.status(401).send();
});

app.post('/changelog', function (req, res, next) {
    console.log(`/changelog [POST] -> ${JSON.stringify(req.body)}`);

    var xmlDoc = xmlParser.parseXml(req.rawBody);
    var versions = xmlDoc.find("/Versions/Version");

    var changelist = [];
    for (const v of versions) {
        let vNumber = v.text();
        data = fs.readFileSync(`changes/${vNumber}.html`, 'utf8').toString().replace(/\r?\n|\r/g, "");
        changelist.push(data);
    }

    res.json(changelist);
});

app.post('/isAdmin', function (req, res, next) {
    console.log(`/isAdmin [POST] -> {}`);

    if (req.cookies.whoami === adminSessionId) {
        res.status(200).send();
    } else {
        console.log(`Current admin ID: ${adminSessionId}`);
        res.status(401).send();
    }
});

app.post('/isAuthenticated', function (req, res, next) {
    console.log(`/isAuthenticated [POST] -> {}`);

    if (req.cookies.whoami && allowedUsers.find(x => x.sessionId == req.cookies.whoami)) {
        res.status(200).send();
    } else {
        res.status(401).send();
    }
});

app.post('/login', function (req, res, next) {
    console.log(`/login [POST] -> ${JSON.stringify(req.body)}`);

    let creds = JSON.parse(Buffer.from(req.body.value, 'base64').toString());
    let index = -1;
    let authUser = allowedUsers.find((x, i) => {
        index = i;
        return x.user === creds.user && x.password === creds.password;
    });
    if (authUser) {
        let sessionId = authUser.sessionId
        if (sessionId.length === 0) {
            sessionId = allowedUsers[index].sessionId = uuid.v4();
        }

        res.status(200).cookie("whoami", sessionId, { maxAge: 900000, sameSite: 'none', secure: true }).send();
    } else {
        res.status(401).send();
    }
});

app.get('/feedbacks', function (req, res) {
    console.log(`/feedbacks [POST] -> {}`);

    if (req.cookies.whoami !== adminSessionId) {
        res.status(401).json([]);
        return;
    }

    res.json(feedbackStore);
});

app.post('/newFeedback', function (req, res, next) {
    console.log(`/newFeedback [POST] -> ${JSON.stringify(req.body)}`);

    feedbackStore.push(req.body.value);
    res.send();
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
    } else {
        // fake the 404 response
        res.status(404).send('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot POST /api/topSecret</pre>\n</body>\n</html>\n');
    }
});

popularApi.get('/api/info.json', function (req, res) {
    res.json([{
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

//#region Simulate admin checkups

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

simulateBrowsing = async function (browserType) {
    var driver;
    switch (browserType) {
        case "chrome":
            driver = await new Builder().forBrowser('chrome')
                .setChromeOptions(new chrome.Options()
                    .headless()
                    .excludeSwitches('enable-logging'))
                .build();
            break;
        default:
            driver = await new Builder().forBrowser('firefox')
                .setFirefoxOptions(new firefox.Options()
                    .headless())
                .build();
            break;
    }

    try {
        // Requires to prefetch request
        // https://stackoverflow.com/a/44857193/6710729
        await driver.get('http://localhost:3000/admin');
        await driver.manage().addCookie({ name: 'whoami', value: adminSessionId });
        await driver.get('http://localhost:3000/admin');

        let source = await driver.getPageSource();

        // navigate to first URL found on feedbacks page
        source = source.substring(source.lastIndexOf("<body>"));
        let pattern = /http:(.*?)</g;
        if (pattern.test(source)) {
            let url = source.match(pattern)[0].slice(0, -1);
            await driver.get(url);
        }
    } finally {
        //delay closing the browser so potential fetch reach the target
        new Promise(() => {
            setTimeout(function () {
                driver.quit().then();
                scheduleAdminCheck(browserType);
            }, 5000);
        });
    }
}

scheduleAdminCheck = function (browserType) {
    new Promise(() => {
        setTimeout(function () { simulateBrowsing(browserType).then(); }, 15000);
    });
};

if (args['watcher']) {
    scheduleAdminCheck(args['watcher']);
}
console.log(`Current admin ID: ${adminSessionId}`);
console.log(`Admin password: ${initialAdminPassword}`);
//#endregion
