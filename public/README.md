# 1. Start the server

There are three recommended methods to start the server:

## 1. NodeJS

Check whether NodeJS exists in the system.

```bash
node -v
```
```bash
npm -v
```
```bash
npx -v
```

If the above version numbers can be output normally, you can try one of the following 3 servers.

### 1. http-server

```bash
npx http-server --port 80
```

or
```bash
npm exec http-server -- --port 80
```

### 2. serve

```bash
npx serve -p 80
```

or
```bash
npm exec serve -- -p 80
```


### 3. vite

```bash
npx vite preview --open --outDir . --clearScreen false -d --port 80
```

or
```bash
npm exec vite -- preview --open --outDir . --clearScreen false -d --port 80
```

## 2. Python

Check whether Python exists in the system.

```bash
python -V
```

or

```bash
python3 -V
```

If you can output the Python version, enter one of the following two commands:

```bash
python -m http.server 80
```

or

```bash
python3 -m http.server 80
```

## 3. Other Web server software

1. Microsoft IIS（Internet Information Services）
2. [Apache HTTP Server](https://httpd.apache.org/download.cgi)
3. [Nginx](https://nginx.org/en/download.html)
4. [Apache Tomcat](https://tomcat.apache.org/download-10.cgi)
5. [Lighttpd](https://www.lighttpd.net/download)
8. [Caddy](https://caddyserver.com/download)

# 2. Open in browser

Enter the following website address in the browser.

<http://127.0.0.1:80> or <http://localhost:80>