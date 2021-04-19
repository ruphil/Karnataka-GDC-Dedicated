<template>
  <div class="login">
    <img alt="Vue logo" src="../assets/logo.png" height="150">
    <h2>Karnataka GDC</h2>
    <h3>Attendance Register</h3>
    <h3 class="title">Login To Continue</h3>
    <input class="mobilenumber" type="number" size="20" placeholder="mobilenumber" v-model="mobilenumberref"/>
    <br/><br/>
    <input class="password" type="password" size="20" placeholder="password" v-model="passwordref"/>
    <br/><br/>
    <button class="loginregisterbtn" v-on:click="loginBtnClick">Login</button>
    <br/><br/>
    <button class="loginregisterbtn" v-on:click="registerBtnClick">Register</button>
    <div id="logintoast">{{ toastmsgref }}</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import axios from 'axios';

export default {
  setup() {
    const wsServerURL = ref('');
    const mobilenumberref = ref('');
    const passwordref = ref('');
    const toastmsgref = ref('');

    const route = useRouter();
    const store = useStore();

    const getSheetURL = async () => {
      let dataURL = store.getters.getDataURL;

      axios.get(dataURL)
      .then(res => {
        console.log(res.data.wsServerURL);
        wsServerURL.value = res.data.wsServerURL;

        store.dispatch('setWSURL', res.data.wsServerURL);
      });
    }
            
    onMounted(getSheetURL);
    
    const loginBtnClick = async () => {
      let mobilenumber = mobilenumberref.value;
      let password = passwordref.value;

      if(mobilenumber.length != 10){
        showToast('Invalid Mobile...');
        return 0;
      }

      if(password.length == 0){
        showToast('Password cannot be null...');
        return 0;
      }

      let ws = new WebSocket(wsServerURL.value);
      ws.addEventListener('message', (event) => {
        // console.log(event.data);

        let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
        console.log(responseObj);
        
        if (responseObj.requestStatus == 'success' && responseObj.validUser){
          console.log('Login Sucess...')
          showToast('Login Success... Wait...');

          store.dispatch('setMobile', mobilenumber);
          store.dispatch('setPass', password);
          store.dispatch('setName', responseObj.name);

          setTimeout(() => {
            route.push({path: '/mainscreen'});
          }, 1000);
        } else {
          showToast('Invalid Username / Password...');
          passwordref.value = '';
        }

        ws.close();
      });

      ws.addEventListener('open', (event) => {
        let checkUserObj = {
          requesttype: 'checkuser',
          mobilenumber,
          password
        };

        ws.send(Buffer.from(JSON.stringify(checkUserObj)).toString('base64'));
      });
    }

    const registerBtnClick = () => {
      route.push({path: '/register'});
    }

    const showToast = async (msg) => {
      toastmsgref.value = msg;

      let x = document.getElementById("logintoast");
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    return { mobilenumberref, passwordref, toastmsgref, loginBtnClick, registerBtnClick, showToast }
  },
}
</script>

<style scoped>
  .title{
    color: #4e73e3;
  }

  .mobilenumber {
    padding: 15px;
    border: 2px solid #4e73e3;
    font-size: 20px;
    color: #4e73e3;

    -moz-appearance: textfield;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .password {
    padding: 15px;
    border: 2px solid #4e73e3;
    font-size: 20px;
    color: #4e73e3;
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