import store from "@/store";

const userAddition = () => {
    const addUser = (newusername: any, newpassword: any, newmobilenumber: any, newdescription: any) => {
        const adminuser = store.getters.getUsername;
        const adminpass = store.getters.getPassword;
        const wssURL = store.getters.getUsersModuleWSS;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            
            
            ws.close();
        });
        ws.addEventListener('open', (event) => {
            let requestObj = {
                request: 'newregistration',
                validateusername: adminuser,
                validatepassword: adminpass,
                newusername: newusername,
                newpassword: newpassword,
                mobilenumber: newmobilenumber,
                description: newdescription,
                roles: ''
            };

            console.log(requestObj);

            ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
        });
    }
    
    return { addUser };
}

export default userAddition;