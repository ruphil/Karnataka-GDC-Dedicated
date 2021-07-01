import store from "@/store";

const dronesList = () => {
    const getDrones = () => {
        const adminuser = store.getters.getUsername;
        const adminpass = store.getters.getPassword;
        const wssURL = store.getters.getUsersDronesModuleWSS;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
          let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
          console.log(responseObj);

          if(responseObj.requestStatus == 'success'){
            store.dispatch('setDroneNumbers', responseObj.droneslist);
          }
          
          setTimeout(()=>{
            ws.close();
          }, 1000);
        });
        ws.addEventListener('open', (event) => {
          let requestObj = {
            request: 'getdrones',
            validateusername: adminuser,
            validatepassword: adminpass,
          }

          console.log(requestObj);

          ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
        });
    }

    return { getDrones }
}

export default dronesList;