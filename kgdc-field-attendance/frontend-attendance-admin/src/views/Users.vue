<template>
  <div>
    <h1>Users</h1>
    <table border="1" class="tablecenter">
      <tr>
        <td>MobileNumber</td><td>Name</td><td>Password</td><td>TYPE</td><td>UUID</td><td>Approve / Ban</td><td>Delete</td>
      </tr>
      <tr v-for="(user, index) in users" v-bind:key="index">
        <td>{{ user.MobileNumber }}</td><td>{{ user.Name }}</td><td>{{ user.Password }}</td>
        <td>{{ user.TYPE }}</td><td>{{ user.UUID }}</td>
        <td><button v-bind:mobile="user.MobileNumber" v-bind:action="approverbanaction(user.TYPE)" v-on:click="approveRBanFunction">{{ approveRBannedBtnTxt(user.TYPE) }}</button></td>
        <td><button v-bind:mobile="user.MobileNumber" v-on:click="deleteuser">Delete User</button></td>
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
    const users = ref([]);

    const store = useStore();

    const getWSURL = async () => {
      wsServerURL.value = store.getters.getWSURL;
      usernameref.value = store.getters.getUser;
      passwordref.value = store.getters.getPass;

      getUsers();
    }

    const approveRBannedBtnTxt = computed(() => {
      return (type) => {
        if(type == 'New' || type == 'Banned'){
          return 'Approve';
        } else {
          return 'Ban';
        }
      }
    });

    const approverbanaction = computed(() => {
      return (type) => {
        if(type == 'New' || type == 'Banned'){
          return 'toapprove';
        } else {
          return 'toban';
        }
      }
    });

    onMounted(getWSURL);

    const getUsers = () => {
      let ws = new WebSocket(wsServerURL.value);
      ws.addEventListener('message', (event) => {
        // console.log(event.data);

        let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
        console.log(responseObj);

        users.value = responseObj;

        setTimeout(()=>{
          ws.close();
        }, 1000);
      });

      ws.addEventListener('open', (event) => {
        // console.log(usernameref.value, passwordref.value);

        let userstableObj = {
          requesttype: 'userstable',
          username: usernameref.value,
          password: passwordref.value,
        }

        ws.send(Buffer.from(JSON.stringify(userstableObj)).toString('base64'));
      });
    }

    const deleteuser = (e) => {
      let mobile = e.target.getAttribute('mobile');
      console.log(mobile);

      let ws = new WebSocket(wsServerURL.value);
      ws.addEventListener('message', (event) => {
        // console.log(event.data);
        let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
        console.log(responseObj);

        getUsers();

        setTimeout(()=>{
          ws.close();
        }, 1000);
      });

      ws.addEventListener('open', (event) => {

        let deleteuserObj = {
          requesttype: 'deleteuser',
          user: usernameref.value,
          pass: passwordref.value,
          mobilenumber: mobile
        }

        ws.send(Buffer.from(JSON.stringify(deleteuserObj)).toString('base64'));
      });
    }

    const approveRBanFunction = (e) => {
      let mobile = e.target.getAttribute('mobile');
      let action = e.target.getAttribute('action');
      console.log(mobile, action);

      let ws = new WebSocket(wsServerURL.value);
      ws.addEventListener('message', (event) => {
        // console.log(event.data);
        let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
        console.log(responseObj);

        getUsers();

        setTimeout(()=>{
          ws.close();
        }, 1000);
      });

      ws.addEventListener('open', (event) => {

        let approveuserObj = {
          requesttype: 'approvebanuser',
          user: usernameref.value,
          pass: passwordref.value,
          mobilenumber: mobile,
          action: action
        }

        ws.send(Buffer.from(JSON.stringify(approveuserObj)).toString('base64'));
      });


    }

    return { users, approveRBannedBtnTxt, approverbanaction, deleteuser, approveRBanFunction }
  },
}
</script>

<style scoped>
  .tablecenter {
    margin-left: auto;
    margin-right: auto;
  }
</style>