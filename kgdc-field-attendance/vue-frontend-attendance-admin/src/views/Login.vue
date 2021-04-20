<template>
  <div>
    <h2>Admin KGDC Field Attendance</h2>
    <input class="username" type="text" size="20" placeholder="user" v-model="usernameref"/>
    <br/><br/>
    <input class="password" type="password" size="20" placeholder="pass" v-model="passwordref"/>
    <br/><br/>
    <button class="loginregisterbtn" v-on:click="loginBtnClick">Login</button>
    <br/><br/>
    <div id="logintoast">{{ toastmsgref }}</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  setup() {
    const wsServerURL = ref('');
    const usernameref = ref('');
    const passwordref = ref('');
    const toastmsgref = ref('');

    const route = useRouter();
    const store = useStore();

    const getWSURL = async () => {
      wsServerURL.value = store.getters.getWSURL;
    }
            
    onMounted(getWSURL);
    
    const loginBtnClick = async () => {
      let user = usernameref.value;
      let pass = passwordref.value;

      if(user.length == 0){
        showToast('Unauthorized Admin...');
        return 0;
      }

      if(pass.length == 0){
        showToast('Password cannot be null...');
        return 0;
      }

      let ws = new WebSocket(wsServerURL.value);
      ws.addEventListener('message', (event) => {
        // console.log(event.data);

        let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());

        if (responseObj.requestStatus == 'success' && responseObj.adminuser){
          showToast('Welcome back Admin...');

          store.dispatch('setUser', user);
          store.dispatch('setPass', pass);
          
          setTimeout(() => {
            route.push({path: '/users'});
            store.dispatch('setLoggedInStatusToTrue');
          }, 1000);
        } else {
          showToast('Unauthorized Admin...');
          passwordref.value = '';
        }

        ws.close();
      });

      ws.addEventListener('open', (event) => {
        let checkAdminObj = {
          requesttype: 'checkadmin',
          user,
          pass
        };

        ws.send(Buffer.from(JSON.stringify(checkAdminObj)).toString('base64'));
      });
    }

    const showToast = async (msg) => {
      toastmsgref.value = msg;

      let x = document.getElementById("logintoast");
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    return { usernameref, passwordref, toastmsgref, loginBtnClick, showToast }
  },
}
</script>

<style scoped>
  .username {
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