import store from "@/store";

const usersTable = () => {
    const getUsers = () => {
        const adminuser = store.getters.getUsername;
        const adminpass = store.getters.getPassword;
        const wssURL = store.getters.getUsersNDataModuleWSS;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
          let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
          console.log(responseObj);

          if(responseObj.requestStatus == 'success'){
            store.dispatch('setUsersTable', responseObj.userstable);
          }
          
          setTimeout(()=>{
            ws.close();
          }, 1000);
        });
        ws.addEventListener('open', (event) => {
          let userstableObj = {
            request: 'userstable',
            validateusername: adminuser,
            validatepassword: adminpass,
          }

          console.log(userstableObj);

          ws.send(Buffer.from(JSON.stringify(userstableObj)).toString('base64'));
        });
    }

    return { getUsers }
}

export default usersTable;