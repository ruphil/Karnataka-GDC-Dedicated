import globalToast from '../composables/globalToast';
// import socketClient from '../composables/socketClient';
    
const userFunctions = () => {
    const { showGlobalToast } = globalToast();
    // const { makeSocketRequestNClose } = socketClient();

    const addUser = (user: string, pass: string) => {
        console.log(user, pass);

        let registrationObj = {
            requesttype: 'usermanagement',
            request: 'adduser',
            user,
            pass
        };

        // makeSocketRequestNClose(registrationObj)
        // .then((responseObj: any) => {
        //     if (responseObj.requestStatus == 'success'){
        //         showGlobalToast('Added User...');
        //     } else {
        //         showGlobalToast('Problem Adding User...');
        //     }
        // })
        // .catch(() => {
        //     showGlobalToast('Problem Adding User...');
        // })
    }

    const loadUsers = () => {

    }

    return { addUser, loadUsers };
}

export default userFunctions;