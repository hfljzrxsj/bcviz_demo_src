#!/bin/bash
echo "Content-type: text/html"
echo "Access-Control-Allow-Origin: *"
echo ""
echo "<h1>Hello, World!</h1>"
echo "$QUERY_STRING"
echo "$REQUEST_URI"
echo "$DOCUMENT_URI"
echo "$DOCUMENT_ROOT"