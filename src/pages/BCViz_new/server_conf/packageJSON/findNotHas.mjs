//@ts-check
const str1 = `CONTENT_LENGTH
CONTENT_TYPE
DOCUMENT_ROOT
DOCUMENT_URI
GATEWAY_INTERFACE
HTTPS
QUERY_STRING
REDIRECT_STATUS
REMOTE_ADDR
REMOTE_PORT
REMOTE_USER
REQUEST_METHOD
REQUEST_SCHEME
REQUEST_URI
SCRIPT_NAME
SERVER_ADDR
SERVER_NAME
SERVER_PORT
SERVER_PROTOCOL
SERVER_SOFTWARE`;
const str2 = `  "CONTENT_LENGTH": "3",
  "CONTENT_TYPE": "text/plain",
  "DAEMON_OPTS": "-f"
  "DOCUMENT_ROOT": "/etc/nginx/sites-available/bcviz_demo",
  "DOCUMENT_URI": "/api/test",
  "FCGI_ROLE": "RESPONDER",
  "GATEWAY_INTERFACE": "CGI/1.1",
  "HOME": "/var/www",
  "HTTP_ACCEPT": "*/*",
  "HTTP_ACCEPT_ENCODING": "gzip, deflate, br",
  "HTTP_CACHE_CONTROL": "no-cache",
  "HTTP_CONNECTION": "keep-alive",
  "HTTP_CONTENT_LENGTH": "3",
  "HTTP_CONTENT_TYPE": "text/plain",
  "HTTP_HOST": "47.99.129.94",
  "HTTP_USER_AGENT": "Apifox/1.0.0 (https://apifox.com)",
  "INVOCATION_ID": "22e7ab8bd5cb40c6b18a6ebe5440ff4c",
  "JOURNAL_STREAM": "8:23887",
  "LANG": "en_US.UTF-8",
  "LOGNAME": "www-data",
  "PATH": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin",
  "QUERY_STRING": "",
  "REDIRECT_STATUS": "200",
  "REMOTE_ADDR": "111.42.148.239",
  "REMOTE_PORT": "49700",
  "REMOTE_USER": "",
  "REQUEST_METHOD": "POST",
  "REQUEST_SCHEME": "http",
  "REQUEST_URI": "/api/test",
  "SCRIPT_FILENAME": "/etc/nginx/sites-available/test.mjs",
  "SCRIPT_NAME": "/api/test",
  "SERVER_ADDR": "172.26.139.82",
  "SERVER_NAME": "localhost",
  "SERVER_PORT": "80",
  "SERVER_PROTOCOL": "HTTP/1.1",
  "SERVER_SOFTWARE": "nginx/1.18.0",
  "SYSTEMD_EXEC_PID": "1516",
  "USER": "www-data",`;

str1.trim().split('\n').forEach(i => {
  if (!str2.includes(i)) {
    console.log(i);
  }
});