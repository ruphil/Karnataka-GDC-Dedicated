import http from 'http';
import express from 'express';
import { checkuser } from './authenticator';

const app = express();
const server = new http.Server(app);

const staticAuthentication = (req: any, res: any, next: any) => {
    let searchParams = new URLSearchParams(req._parsedUrl.search)

    checkuser(searchParams)
    .then(() => {
        next();
    })
    .catch(() => {
        res.status(401).end();
    })
}

app.use('/files', [ staticAuthentication, express.static('static') ]);

app.get('/', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('File Server Running Fine!');
    res.end();
});

const port = 4010;
server.listen(port, () => {
    console.log(`File Server listening On Port: ${port}`);
});