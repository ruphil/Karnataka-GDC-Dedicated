<template>
  <div>
    <h1 style="display:inline-block;">Field Attendance Register KGDC</h1>
    &emsp;&emsp;
    <router-link to="/users" style="font-size: 25px">Go to Users</router-link>
    <table border="1" class="tablecenter">
      <tr>
          <th>ServerDate</th><th>ServerTime</th><th>ClientDate</th><th>ClientTime</th>
          <th>Name</th><th>AttendanceType</th><th>Remarks</th><th>MobileNumber</th>
          <th>UUID</th><th>Latitude</th><th>Longitude</th><th>Accuracy</th><th>Location</th>
      </tr>
      
      <tr v-for="(register, index) in registerentries" v-bind:key="index">
        <td>{{ register.ServerDate }}</td><td>{{ register.ServerTime }}</td><td>{{ register.ClientDate }}</td><td>{{ register.ClientTime }}</td>
        <td>{{ register.Name }}</td><td>{{ register.AttendanceType }}</td><td>{{ register.Remarks }}</td><td>{{ register.MobileNumber }}</td>
        <td>{{ register.UUID }}</td><td>{{ register.Latitude }}</td><td>{{ register.Longitude }}</td><td>{{ register.Accuracy }}</td>
        <td><a v-bind:href="gmpasurl(register.Latitude, register.Longitude)" target="_blank">Location</a></td>
      </tr>
    </table>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const wsServerURL = ref('');
    const usernameref = ref('');
    const passwordref = ref('');
    const rowscountref = ref(100);
    const registerentries = ref([]);

    const store = useStore();

    const getWSURL = async () => {
      wsServerURL.value = store.getters.getWSURL;
      usernameref.value = store.getters.getAdminUser;
      passwordref.value = store.getters.getAdminPass;

      getAttendanceRegister();
    }
            
    onMounted(getWSURL);

    const gmpasurl = computed(() => {
        return (lat, lon) => {
            return 'https://www.google.com/maps/place/' + deg_to_dms(lat) + "N+" + deg_to_dms(lon) + "E";
        }
    });

    const deg_to_dms = (deg) => {
      let d = Math.floor(deg);
      let minfloat = (deg - d) * 60;
      let m = Math.floor(minfloat);
      let secfloat = (minfloat - m) * 60;
      let s = secfloat.toFixed(6);

      return (d + "°" + m + "'" + s + "\"");
    }

    const getAttendanceRegister = () => {
      let ws = new WebSocket(wsServerURL.value);
      ws.addEventListener('message', (event) => {
        // console.log(event.data);

        let msgObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
        console.log(msgObj);

        registerentries.value = msgObj;

        setTimeout(()=>{
          ws.close();
        }, 1000);
      });

      ws.addEventListener('open', (event) => {
        console.log(usernameref.value, passwordref.value);

        let attendanceRegisterObj = {
          purpose: 'attendanceadmin',
          requesttype: 'attendanceregister',
          rowscount: rowscountref.value,
          user: usernameref.value,
          pass: passwordref.value,
        }

        // console.log(attendanceRegisterObj);

        ws.send(Buffer.from(JSON.stringify(attendanceRegisterObj)).toString('base64'));
      });
    }

    return { registerentries, gmpasurl }
  },
}
</script>

<style scoped>
  .tablecenter {
    margin-left: auto;
    margin-right: auto;
  }
</style>