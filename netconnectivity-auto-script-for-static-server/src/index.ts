import axios from 'axios';
import { exec } from 'child_process';

setInterval(() => {
    axios.get('https://www.google.com', {
        timeout: 10000,
        timeoutErrorMessage: 'nointernet'
    }).then((res) => {
        if(res.status == 200){
            console.log('Net is Working Fine...');
        }
    }).catch((err) => {
        makeDialUp();
    })
}, 600000);

const makeDialUp = async () => {
    let dialUpName = 'staticip';
    let dialUpUser = 'ser25531759_sid@ftth.bsnl.in';
    let dialUpPass = 'password';

    exec(`rasdial ${dialUpName} ${dialUpUser} ${dialUpPass}`, (err, stdout, stderr) => {
        console.log('Net was Not Working... Made Dial Up...');

        if (err) {
          console.log(err.message);
          return;
        }
        
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
}