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
            currentvillage, currentvillagecode, currentabadiname, currentabadiuuid, currenttaluk, currentdistrict,
            fileName,  fileType, description, currentuser, diskidentifier, '' ];
        console.log(insertData);
        
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
        // console.log(sqlQuery);

        client.query(sqlQuery)
        .then((res) => {
            let rows = res.rows;
            // console.log(rows);

            if(rows.length > 0){
                console.log(rows[0]);
                resolve('success');
            } else {
                reject('failure');
            }
        })
        .catch((err) => {
            // console.log(err);
            reject('failure');
        })
        .finally(() => {
            client.end();
        });
    });
}