<template>
  <div>
    <h1>Users</h1>
    <table border="1" class="tablecenter">
      <tr>
        <td>MobileNumber</td><td>Name</td><td>Password</td><td>ROLES</td><td>UUID</td><td>Add Role</td><td>Remove Role</td><td>Delete</td>
      </tr>
      <tr v-for="(user, index) in users" v-bind:key="index">
        <td>{{ user.MobileNumber }}</td><td>{{ user.Name }}</td><td>{{ user.Password }}</td>
        <td>{{ user.ROLES }}</td><td>{{ user.UUID }}</td>
        <td v-bind:mobile="user.MobileNumber" v-bind:roles="user.ROLES">
          <input type="text" /><button v-on:click="addRole">Add</button>
        </td>
        <td v-bind:mobile="user.MobileNumber" v-bind:roles="user.ROLES">
          <select>
            <option selected></option>
            <option v-for="(item, index) in renderRolesOptions(user.ROLES)" v-bind:key="index">
              {{ item }}
            </option>
          </select>
          <button v-on:click="removeRole">Remove</button>
        </td>
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
      usernameref.value = store.getters.getAdminUser;
      passwordref.value = store.getters.getAdminPass;

      getUsers();
    }

    onMounted(getWSURL);

    const getUsers = () => {
      let ws = new WebSocket(wsServerURL.value);
      ws.addEventListener('message', (event) => {
        // console.log(event.data);

        let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
        // console.log(responseObj);

        users.value = responseObj;

        setTimeout(()=>{
          ws.close();
        }, 1000);
      });

      ws.addEventListener('open', (event) => {
        // console.log(usernameref.value, passwordref.value);

        let userstableObj = {
          requesttype: 'userstable',
          user: usernameref.value,
          pass: passwordref.value,
        }

        ws.send(Buffer.from(JSON.stringify(userstableObj)).toString('base64'));
      });
    }

    const addRole = (e) => {
      let parent = e.target.parentNode;
      let mobilenumber = parent.getAttribute('mobile');
      let rolesPresent = parent.getAttribute('roles');
      let roleInput = parent.querySelectorAll('input')[0];
      let roleToAdd = roleInput.value;

      let rolesArry = rolesPresent.split(',');
      rolesArry.push(roleToAdd);

      let modifiedRolesArry = [...new Set(rolesArry)];
      console.log(modifiedRolesArry);

      let modifiedRole = modifiedRolesArry.join(',').replace(/^,|,$/g,'');
      
      let ws = new WebSocket(wsServerURL.value);
      ws.addEventListener('message', (event) => {
        // console.log(event.data);

        let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
        console.log(responseObj);

        roleInput.value = '';
        getUsers();

        setTimeout(()=>{
          ws.close();
        }, 1000);
      });

      ws.addEventListener('open', (event) => {
        // console.log(usernameref.value, passwordref.value);

        let assignRolesObj = {
          requesttype: 'assignrole',
          user: usernameref.value,
          pass: passwordref.value,
          mobilenumber, modifiedRole
        }

        ws.send(Buffer.from(JSON.stringify(assignRolesObj)).toString('base64'));
      });
    }

    const renderRolesOptions = computed(() => {
      return (roles) => {
        if(roles != ''){
          return [...new Set(roles.split(','))];
        } else {
          return []
        }
      }
    });

    const removeRole = (e) => {
      let parent = e.target.parentNode;
      let mobilenumber = parent.getAttribute('mobile');
      let rolesPresent = parent.getAttribute('roles');
      let roleSelect = parent.querySelectorAll('select')[0];
      let roleToRemove = roleSelect.options[roleSelect.selectedIndex].text;

      let rolesArry = rolesPresent.split(',');
      let modifiedRolesArry = rolesArry.filter(i => i != roleToRemove);

      let modifiedRole = modifiedRolesArry.join(',').replace(/^,|,$/g,'');
      // console.log(mobilenumber, rolesPresent, modifiedRole);
      
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
        // console.log(usernameref.value, passwordref.value);

        let assignRolesObj = {
          requesttype: 'assignrole',
          user: usernameref.value,
          pass: passwordref.value,
          mobilenumber, modifiedRole
        }

        ws.send(Buffer.from(JSON.stringify(assignRolesObj)).toString('base64'));
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

    return { users, addRole, renderRolesOptions, removeRole, deleteuser }
  },
}
</script>

<style scoped>
  .tablecenter {
    margin-left: auto;
    margin-right: auto;
  }
</style>