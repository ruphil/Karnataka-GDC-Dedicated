call chdir /d D:\GeoServer
call pm2 start D:\Scripts\netconnection.js
call pm2 start java -n GeoServer -- -jar D:\GeoServer\start.jar
