<template>
  <div class="mainscreen">
    <img alt="Vue logo" src="../assets/logo.png" height="100"><br/>
    <h3 style="display: inline-block; padding: 0px; margin: 0px;">Karnataka GDC</h3><br/><br/>
    <h4 style="display: inline-block; padding: 0px; margin: 0px;">Attendance Register</h4><br/><br/>
    <div class="username">{{ nameref }}</div><br/>
    <div class="displayDateTime">
      {{ currentDate }} {{ currentTime }}
    </div><br/>
    <div class="labelclass">Activity</div><br/>
    <select class="selectoption" v-model="movementType">
      <option value="Transit from Camp to Field">Transit from Camp to Field</option>
      <option value="Commenced Field Duties">Commenced Field Duties</option>
      <option value="Completed Field Duties">Completed Field Duties</option>
      <option value="Returned to Camping Area">Returned to Camping Area</option>
      <option value="Other Activity">Other Activity</option>
    </select>
    <br/><br/>
    <div class="labelclass">Remarks, If Any</div><br/>
    <textarea class="remarks" v-model="remarksref"></textarea>
    <br/><br/>
    <input type="checkbox">I certifiy thifiy thifiy thifiy thifiy thifiy thifiy thifiy thifiy thifiy thifiy thifiy thifiy thifiy thifiy thifiy thifiy thifiy thifiy that <br><br>
    <button class="logbutton" v-bind:disabled="isWorking" v-on:click="submitAttendance">Log Attendance With Location and Time</button>
    <br/><br/>
    <div class="positionalAccuracy">Positional Accuracy: {{ accuracy }} m</div>
    <div class="statusdiv">{{ statustxt }}</div>
    <br/>
    <button class="logoutbtn" v-bind:disabled="isWorking" v-on:click="logOut">Logout</button>
    <div id="logintoast">{{ toastmsgref }}</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import axios from 'axios';

import { Plugins } from '@capacitor/core';
const { Geolocation, Device } = Plugins;

export default {
  setup() {
    const currentDate = ref('');
    const currentTime = ref('');

    const wsServerURLref = ref('');
    const isWorking = ref(false);
    const nameref = ref('');
    const movementType = ref('Transit from Camp to Field');
    const remarksref = ref('');
    const mobilenumberref = ref('');
    const passwordref = ref('');
    const uuidref = ref('');
    const toastmsgref = ref('');

    const statustxt = ref('');
    const position = ref(null);
    const accuracy = ref(100);

    const route = useRouter();
    const store = useStore();

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

    const setupFunctions = async () => {
      getUserPosition();

      const info = await Device.getInfo();
      uuidref.value = info.uuid;

      wsServerURLref.value = store.getters.getWSURL;
      nameref.value = store.getters.getName;
      mobilenumberref.value = store.getters.getMobileNumber;
      passwordref.value = store.getters.getPassword;

      let dateNow = new Date();
      currentDate.value = dateNow.toLocaleDateString('en-GB');
      startTimer();
      getWSURL();
    }

    onMounted(setupFunctions);

    const makeItPrecise = async (posTmp) => {
      console.log(posTmp);

      position.value = posTmp;
      accuracy.value = parseFloat(posTmp.coords.accuracy).toFixed(6);

      if (accuracy.value > 10) {
        getUserPosition();
      }
    }

    const handleFailure = async (msg) => {
      console.log(msg);
      statustxt.value = 'Allow / Turn On GPS and Try Again...';

      setTimeout(()=>{
        getUserPosition();
        statustxt.value = '';
      }, 5000);
    }

    const getUserPosition = async () => {
      Geolocation.requestPermissions();
      navigator.geolocation.getCurrentPosition(makeItPrecise, handleFailure, { enableHighAccuracy: true });
    }

    const startTimer = () => {
      setInterval(() => {
        let dateNow = new Date();
        currentTime.value = dateNow.toLocaleTimeString();
      }, 1000);
    }

    const submitAttendance = async () => {
      isWorking.value = true;
      statustxt.value = 'Please Wait...';

      let submitAttendanceJob = setInterval(() => {
        let condition = accuracy.value < 10;
        // let condition = accuracy.value < 10 || true;

        if(condition){
          statustxt.value = 'Submitting... Now...';

          let ws = new WebSocket(wsServerURLref.value);
          ws.addEventListener('message', (event) => {
              // console.log(event.data);

              let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
              console.log(responseObj);

              if (responseObj.requestStatus == 'success' && responseObj.action == 'attendanceentered'){
                  statustxt.value = 'Attendance Submitted Successfully...';
              } else {
                  statustxt.value = 'Please Try Again...';
              }
              
              // ws.close();
          });

          ws.addEventListener('open', (event) => {
            let dateNow = new Date();
            let attendanceObj = {
              requesttype: 'logattendance',
              clientdate: dateNow.toLocaleDateString('en-GB'),
              clienttime: dateNow.toLocaleTimeString('en-GB'),
              name: nameref.value,
              attendancetype: movementType.value,
              remarks: remarksref.value,
              mobilenumber: mobilenumberref.value,
              password: passwordref.value,
              UUID: uuidref.value,
              latitude: parseFloat(position.value.coords.latitude).toFixed(10).toString(),
              longitude: parseFloat(position.value.coords.longitude).toFixed(10).toString(),
              accuracy: parseInt(position.value.coords.accuracy).toString()
            }

            console.log(attendanceObj);

            ws.send(Buffer.from(JSON.stringify(attendanceObj)).toString('base64'));
          });

          clearInterval(submitAttendanceJob);
          isWorking.value = false;
        }
      }, 1000);
    }

    const logOut = () => {
      statustxt.value = 'Please Wait...';

      store.dispatch('setMobile', '');
      store.dispatch('setPass', '');

      setTimeout(() => {
        route.push({path: '/'});
      }, 1000);
    }

    const showToast = async (msg) => {
      toastmsgref.value = msg;

      let x = document.getElementById("logintoast");
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    return { nameref, isWorking, accuracy, movementType, currentDate, currentTime, remarksref, statustxt, submitAttendance, logOut, toastmsgref }
  },
}
</script>

<style scoped>
  * {
    line-height: 14px;
  }

  .selectoption {
    padding: 15px;
    font-size: 18px;
    border: 2px solid #4e73e3;
    color: #4e73e3;
  }
  .labelclass {
    font-size: 20px;
    color: #4e73e3;
  }
  .remarks{
    padding: 15px;
    width: 300px;
    height: 50px;
  }
  .logbutton {
    padding: 15px;
    border: 2px solid #4e73e3;
    font-size: 15px;
    
    color: #4e73e3;
  }
  .logbutton:active {
    padding: 15px;
    border: 2px solid #4e73e3;
    font-size: 15px;
    
    color: white;
    background: #4e73e3;
  }
  .logbutton[disabled] {
    padding: 15px;
    border: 2px solid #4e73e3;
    font-size: 15px;

    color: white;
    background: #4e73e33f;
    outline: none;
    cursor: not-allowed;
  }
  .statusdiv {
    padding: 15px;
    font-size: 15px;
    color: #4e73e3;
  }

  .logoutbtn {
    position: fixed;
    top: 30px;
    right: 30px;

    border-radius: 20px;
    color:white;
    background: #4e73e3;
  }

  .logoutbtn:active {
    position: fixed;
    top: 30px;
    right: 30px;

    border-radius: 20px;
    color:#4e73e3;
    background: white;
  }

  .positionalAccuracy {
    font-size: 8px;
  }

  .displayDateTime {
    color: blueviolet;
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