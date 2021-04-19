import sys
import thread
import webbrowser
import time
import SimpleHTTPServer
import SocketServer
import arcpy

def getData():
    arcpy.env.workspace = "D:/testGDB/URGENT/FINAL/Draft4/Seebakatte_New.gdb"

    fclist = arcpy.ListFeatureClasses()
    print(fclist)

    json = {
        "meat": fclist
    }
    return json

# Server Setup --------------------------------------------------------------------------------------------------------------
class MyHttpRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()

            self.path = 'dllcsv.html'
            return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)
        
        if self.path == '/getfc':
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            data = getData()
            self.wfile.write(data)
            return

        self.wfile.write("You are NoWhere...")
        return

PORT = 3600
def start_server():
    handler_object = MyHttpRequestHandler
    my_server = SocketServer.TCPServer(("", PORT), handler_object)
    print "serving at port", PORT
    my_server.serve_forever()

thread.start_new_thread(start_server,())
url = 'http://127.0.0.1:' + str(PORT)
webbrowser.open_new(url)

while True:
    try:
        time.sleep(1)
    except KeyboardInterrupt:
        sys.exit(0)