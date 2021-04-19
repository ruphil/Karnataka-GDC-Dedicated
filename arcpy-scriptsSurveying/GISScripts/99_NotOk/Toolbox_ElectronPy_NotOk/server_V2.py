import SimpleHTTPServer
import SocketServer

class MyHttpRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Sending an '200 OK' response
        self.send_response(200)

        # Setting the header
        self.send_header("Content-type", "text/html")

        # Whenever using 'send_header', you also have to call 'end_headers'
        self.end_headers()

        # Writing the HTML contents with UTF-8
        self.wfile.write("hello")

        return

# Create an object of the above class
handler_object = MyHttpRequestHandler

PORT = 8000
my_server = SocketServer.TCPServer(("", PORT), handler_object)

# Star the server
print "serving at port", PORT
my_server.serve_forever()