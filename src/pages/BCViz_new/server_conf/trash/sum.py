from datetime import datetime
now = datetime.now()
time_format = "%Y.%m.%d %H:%M:%S"
formatted_time = now.strftime(time_format)
with open('time.txt', 'w') as file:
    file.write(formatted_time)
print("HTTP/1.1 200 OK\r\n"+"Content-Type: text/plain\r\n"+"Access-Control-Allow-Origin: *\r\n"+"\r\n"+"hjx")