import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

export const addFileRowToDB = (currentvillage: any, currentvillagecode: any, currentabadiname: any, currentabadiuuid: any, fileName: any, fileType: any, description: any, currentuser: any, diskidentifier: any) => {
    return new Promise((resolve, reject) => {
        let insertQuery = `INSERT INTO 
        filesattachment (VILLAGENAME, UNIQUEVILLAGECODE, ABADILIMITNAME, ABADILIMITUUID, IDENTIFIER, FILETYPE, DESCRIPTION, UPLOADERINFO, FILELOCATION, APPROVERINFO)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        // console.log(insertQuery);

        let insertData = [currentvillage, currentvillagecode, currentabadiname, currentabadiuuid, fileName,  fileType, description, currentuser, diskidentifier, ''];
        // console.log(insertData);
        
        const client = new Client({ connectionString });
        client.connect();

        client.query(insertQuery, insertData)
        .then(() => {
            resolve('success');
        })
        .catch((err) => {
            console.log(err);
            reject('failure');
        })
        .finally(() => {
            client.end();
        });
    });
}