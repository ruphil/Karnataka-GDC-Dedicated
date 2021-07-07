import http from 'http';
import express from 'express';
import { checkuser } from './authenticator';
import multer from 'multer';
import { existsSync } from 'fs';
import { resolve } from 'path';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './statictemp/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    // limits: { fileSize: 1000000 },
});

const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));

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
    let file = req.file!;
    console.log(file);
    console.log(req.body);

    let uploadfilepath = resolve('./statictemp/', file.originalname);
    console.log(uploadfilepath);

    if(existsSync(uploadfilepath)){
        console.log('File Uploaded');

        let formData = req.body;
        const { maggi } = formData;

    } else {
        console.log('File Not Uploaded');
    }
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