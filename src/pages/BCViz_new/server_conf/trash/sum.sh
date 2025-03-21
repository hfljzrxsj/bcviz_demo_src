#!/bin/bash
# a=$(echo "$QUERY_STRING" | sed -n 's/^.*a=\([^&]*\).*$/\1/p')
# b=$(echo "$QUERY_STRING" | sed -n 's/^.*b=\([^&]*\).*$/\1/p')
# sum=$((a + b))

echo "HTTP/1.1 200 OK\r\n"
echo "Content-Type: text/plain"
echo "Access-Control-Allow-Origin: *"
echo
echo "hjx"