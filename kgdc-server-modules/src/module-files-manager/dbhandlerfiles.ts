import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

export const addFileRowToDB = (formData: any, diskidentifier: any) => {
    return new Promise((resolve, reject) => {
        const { 
            currentdistrict, currenttaluk, 
            currentvillage, currentvillagecode,
            currentabadiname, currentabadiuuid,
            fileName, fileType, description, currentuser
        } = formData;

        let insertQuery = `INSERT INTO filesattachment (
            VILLAGENAME, UNIQUEVILLAGECODE, ABADILIMITNAME, ABADILIMITUUID, TALUK, DISTRICT,
            IDENTIFIER, FILETYPE, DESCRIPTION, UPLOADERINFO, FILELOCATION, APPROVERINFO)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
        // console.log(insertQuery);

        let insertData = [
            currentvillage, currentvillagecode, currentabadiname, currentabadiuuid, currentdistrict, currenttaluk,
            fileName,  fileType, description, currentuser, diskidentifier, '' ];
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

export const checkTalukDistrictForFile = (clientdistrict: any, clienttaluk: any, filelocation: any) => {
    return new Promise((resolve, reject) => {
        const client = new Client({ connectionString });
        client.connect();

        let sqlQuery = `
        SELECT * FROM filesattachment
        WHERE DISTRICT = '${clientdistrict}' AND TALUK = '${clienttaluk}' AND FILELOCATION = '${filelocation}'`;

        client.query(sqlQuery)
        .then(() => {
            
        })
        .catch((err) => {
            // console.log(err);
            
        })
        .finally(() => {
            client.end();
        });
    });
}