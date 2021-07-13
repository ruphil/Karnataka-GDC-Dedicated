import store from "@/store";

const jurisdictionsLoader = () => {

    const loadJurisdictions = () => {
        const adminuser = store.getters.getUsername;
        const adminpass = store.getters.getPassword;
        const wssURL = store.getters.getUsersNDataModuleWSS;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
            // console.log(event);
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            
            if(responseObj.requestStatus == 'success') {
                store.dispatch('setJurisdictions', responseObj.jurisdictionslist);
            }
            
            ws.close();
        });
        ws.addEventListener('open', (event) => {
            let requestObj = {
                request: 'getjurisdictions',
                validateusername: adminuser,
                validatepassword: adminpass
            };

            console.log(requestObj);

            ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
        });
    }
    
    return { loadJurisdictions };
}

export default jurisdictionsLoader;