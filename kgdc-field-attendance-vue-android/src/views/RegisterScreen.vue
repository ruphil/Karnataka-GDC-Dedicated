<template>
    <div class="registerscreen">
        <img alt="Vue logo" src="../assets/logo.png" height="100"><br/>
        <h3 style="display: inline-block; padding: 0px; margin: 0px;">Karnataka GDC</h3><br/><br/>
        <h4 style="display: inline-block; padding: 0px; margin: 0px;">Attendance Register</h4><br/><br/>
        <div class="registertitle">New User Registration</div><br/>
        <input type="text" class="registerfields" placeholder="Name With Designation" v-model="nameref"/><br/><br/>
        <input type="number" class="registerfields" placeholder="Mobile Number" v-model="mobilenumberref"/><br/><br/>
        <input type="password" class="registerfields" placeholder="Password" v-model="passwordref"/><br/><br/>
        <input type="text" class="registerfields" placeholder="Re enter Password" v-model="repasswordref"/><br/><br/>
        <div>{{ statustxt }}</div><br/><br/>
        <button class="loginregisterbtn" v-on:click="registerUser">Register</button>
        <button class="homebtn" v-bind:disabled="isWorking" v-on:click="goToHome">Home</button>
        <div id="logintoast">{{ toastmsgref }}</div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { Plugins } from '@capacitor/core';

const { Device } = Plugins;

import axios from 'axios';

export default {
    setup() {
        const route = useRouter();
        const store = useStore();

        const isWorking = ref(false);
        const wsServerURLref = ref('');
        const uuidref = ref('');
        const nameref = ref('');
        const mobilenumberref = ref('');
        const passwordref = ref('');
        const repasswordref = ref('');
        const toastmsgref = ref('');
        const statustxt = ref('Register to continue...');

        const dataRef = { isWorking, nameref, mobilenumberref, passwordref, repasswordref, statustxt };

        const getWSURL = async () => {
            let dataURL = store.getters.getDataURL;
            let errMsg = 'netslow';
            let fallbackWSSURL = store.getters.getFallbackWSSURL;

            axios.get(dataURL, {
                timeout: 3000,
                timeoutErrorMessage: errMsg
            })
            .then(res => {
                // console.log(res.data);

                let wsServerURL = 'ws://' + res.data.serverIP + ':' + res.data.wsPort;

                wsServerURLref.value = wsServerURL;
                wsServerURLref.value = fallbackWSSURL;

                store.dispatch('setWSURL', wsServerURLref.value);
                console.log(wsServerURLref.value);
            })
            .catch((err) => {
                if(err.message == errMsg){
                wsServerURLref.value = fallbackWSSURL;
                store.dispatch('setWSURL', wsServerURLref.value);
                console.log(errMsg);
                } else {
                    showToast('Please Connect To Internet...');
                }
            })
        }

        const getUUIDNURL = async () => {
            const info = await Device.getInfo();
            uuidref.value = info.uuid;

            wsServerURLref.value = store.getters.getWSURL;
            getWSURL();
        }
            
        onMounted(getUUIDNURL);

        const registerUser = () => {
            let cond1 = nameref.value == '';
            let cond2 = mobilenumberref.value.length != 10;
            let cond3 = passwordref.value == '' || repasswordref.value == '';
            let cond4 = passwordref.value != repasswordref.value
            let condition = cond1 || cond2 || cond3 || cond4;

            if(condition){
                statustxt.value = 'Check All Fields Properly...';

                setTimeout(()=>{
                    statustxt.value = 'Register to continue...';
                }, 4000);
                
                return 0;
            } else {
                statustxt.value = 'Please Wait... Registering...';

                let ws = new WebSocket(wsServerURLref.value);
                ws.addEventListener('message', (event) => {
                    // console.log(event.data);

                    let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
                    console.log(responseObj);

                    if (responseObj.requestStatus == 'success'){
                        statustxt.value = 'Registration Successful... Contact Admin...';
                        uuidref.value = '';
                        nameref.value = '';
                        mobilenumberref.value = '';
                        passwordref.value = '';
                        repasswordref.value = '';
                    } else {
                        statustxt.value = 'Registration Failure... Please Try Again...';
                    }
                    
                    ws.close();
                });

                ws.addEventListener('open', (event) => {
                    let registrationObj = {
                        requesttype: 'newregistration',
                        name: nameref.value,
                        mobilenumber: mobilenumberref.value.toString(),
                        password: passwordref.value,
                        UUID: uuidref.value
                    }

                    ws.send(Buffer.from(JSON.stringify(registrationObj)).toString('base64'));
                });
            }
        }

        const showToast = async (msg) => {
            toastmsgref.value = msg;

            let x = document.getElementById("logintoast");
            x.className = "show";
            setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
        }

        const goToHome = () => {
            route.push({path: '/'});
        }

        const methodsRef = { registerUser, goToHome };
        
        return { ...dataRef, ...methodsRef, toastmsgref };
    },
}
</script>

<style scoped>
    .registertitle {
        font-size: 20px;
        color: #4e73e3;

        -moz-appearance: textfield;
    }

    .registerfields {
        padding: 5px 15px;
        font-size: 20px;
        color: #4e73e3;
        border: 2px solid #4e73e3;
    }

    .loginregisterbtn {
    padding: 5px 20px;

    border: 2px solid #4e73e3;
    font-size: 20px;
    color: #4e73e3;
  }

  .loginregisterbtn:active {
    padding: 5px 20px;

    border: 2px solid #4e73e3;
    color: white;
    font-size: 20px;
    background: #4e73e3;
  }

  .homebtn {
    position: fixed;
    top: 30px;
    right: 30px;

    border-radius: 20px;
    color:white;
    background: #4e73e3;
  }

  .homebtn:active {
    position: fixed;
    top: 30px;
    right: 30px;

    border-radius: 20px;
    color:#4e73e3;
    background: white;
  }

  #logintoast {
    visibility: hidden; /* Hidden by default. Visible on click */
    min-width: 250px; /* Set a default minimum width */
    margin-left: -125px; /* Divide value of min-width by 2 */
    background-color: #4e73e3; /* Black background color */
    color: #fff; /* White text color */
    text-align: center; /* Centered text */
    border-radius: 2px; /* Rounded borders */
    padding: 16px; /* Padding */
    position: fixed; /* Sit on top of the screen */
    z-index: 1; /* Add a z-index if needed */
    left: 50%; /* Center the snackbar */
    bottom: 30px; /* 30px from the bottom */
  }

  /* Show the snackbar when clicking on a button (class added with JavaScript) */
  #logintoast.show {
    visibility: visible; /* Show the snackbar */
    /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
    However, delay the fade out process for 2.5 seconds */
    -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, fadeout 0.5s 2.5s;
  }

  /* Animations to fade the snackbar in and out */
  @-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
  }

  @keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
  }

  @-webkit-keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
  }

  @keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
  }
</style>