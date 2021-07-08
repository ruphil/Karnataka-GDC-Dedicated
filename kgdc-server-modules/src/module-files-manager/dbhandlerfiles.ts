import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

export const addFileRowToDB = (currentvillage: any, currentvillagecode: any, fileName: any, fileType: any, description: any, currentuser: any, storagefilepath: any) => {

    return new Promise((resolve, reject) => {
        let insertQuery = `INSERT INTO filesattachment (
            VILLAGENAME, UNIQUEVILLAGECODE, IDENTIFIER, FILETYPE, DESCRIPTION, UPLOADERINFO, FILELOCATION, APPROVERINFO )`;
        // console.log(insertQuery);

        let insertData = [ currentvillage, currentvillagecode, fileName,  fileType, description, currentuser, storagefilepath, '' ];
        
        const client = new Client({ connectionString });
        client.connect();

        client.query(insertQuery, insertData)
        .then(() => {
            resolve('success');
        })
        .catch((err) => {
            reject('failure');
        })
        .finally(() => {
            client.end();
        });
    });
}