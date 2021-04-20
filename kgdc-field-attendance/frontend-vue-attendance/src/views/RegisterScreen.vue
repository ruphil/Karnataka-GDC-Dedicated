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
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import axios from 'axios';
import { Plugins } from '@capacitor/core';

const { Device } = Plugins;

export default {
    setup() {
        const route = useRouter();
        const store = useStore();

        const isWorking = ref(false);
        const wsServerURL = ref('');
        const uuidref = ref('');
        const nameref = ref('');
        const mobilenumberref = ref('');
        const passwordref = ref('');
        const repasswordref = ref('');
        const statustxt = ref('Register to continue...');

        const dataRef = { isWorking, nameref, mobilenumberref, passwordref, repasswordref, statustxt };

        const getUUIDNURL = async () => {
            const info = await Device.getInfo();
            uuidref.value = info.uuid;

            wsServerURL.value = store.getters.getWSURL;
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

                let ws = new WebSocket(wsServerURL.value);
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

        const goToHome = () => {
            route.push({path: '/'});
        }

        const methodsRef = { registerUser, goToHome };
        
        return { ...dataRef, ...methodsRef };
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
</style>