import http from 'http';
import express from 'express';
import { checkuser } from './authenticator';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './static/')
    },
    filename: function (req, file, cb) {
        cb(null, file.filename + '-' + Date.now())
  }
})

const upload = multer({ storage: storage });

const app = express();
const server = new http.Server(app);

const staticAuthentication = (req: any, res: any, next: any) => {
    let searchParams = new URLSearchParams(req._parsedUrl.search);
    console.log(searchParams);

    checkuser(searchParams)
    .then(() => {
        next();
    })
    .catch(() => {
        res.status(401).end();
    })
}

app.use('/files', [ staticAuthentication, express.static('static') ]);
app.post('/fileupload', upload.single('uploadedfile'), function(req, res){
    console.log(req.file);
});

app.get('/', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('File Server Running Fine!');
    res.end();
});

const port = 4010;
server.listen(port, () => {
    console.log(`File Server listening On Port: ${port}`);
});