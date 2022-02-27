function dvwa-session {
    curl 'http://localhost:8080/vulnerabilities/weak_id/' \
    -H 'Cookie: PHPSESSID=l9k2tp1vsorjl5s2d29p6029i6; security=medium' \
    -X POST --silent --output /dev/null -c - | grep -i dvwaSession
}
