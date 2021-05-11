    // const fetchNLoadDroneNumbers = () => {
    //     let url = 'http://localhost:8080/geoserver/kgdc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kgdc:tabledronenumbers&outputFormat=application/json';
    //     let username = store.getters.getUserName;
    //     let password = store.getters.getPassWord;
    //     doAuthentication(url, username, password)
    //     .then((res: any)=>{
    //         console.log(res.data);
    //         let dronenumbersGJ = res.data;

    //         store.dispatch('setDroneNumbersGJ', dronenumbersGJ);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
    // }