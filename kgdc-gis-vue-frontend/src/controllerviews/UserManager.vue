<template>
    <div id="usersmanager">
        <div class="usersboxcontainer">
            <div class="usersbox">
                <input type="text" v-model="user" placeholder="Username">
                <input type="text" v-model="pass" placeholder="Password">
                <button v-on:click="addUser(user, pass)">Add User</button>
            </div>
            <br><br>
            <div class="userstable">
                <table border="1" class="tablecenter">
                    <tr>
                        <td>USERNAME</td><td>PASSWORD</td><td>MOBILENUMBER</td><td>ROLES</td><td>ADD ROLES</td><td>REMOVE ROLE</td><td>DELETE USER</td>
                    </tr>
                    <tr v-for="(user, index) in users" v-bind:key="index">
                        <td>{{ user.mobilenumber }}</td><td>{{ user.name }}</td><td>{{ user.password }}</td>
                        <td>{{ user.roles }}</td><td>{{ user.uuid }}</td>
                        <td v-bind:mobile="user.mobilenumber" v-bind:roles="user.roles">
                        <input type="text" /><button v-on:click="addRole">Add</button>
                        </td>
                        <td v-bind:mobile="user.mobilenumber" v-bind:roles="user.roles">
                        <select>
                            <option selected></option>
                            <option v-for="(item, index) in renderRolesOptions(user.roles)" v-bind:key="index">
                            {{ item }}
                            </option>
                        </select>
                        <button v-on:click="removeRole">Remove</button>
                        </td>
                        <td><button v-bind:mobile="user.mobilenumber" v-on:click="deleteuser">Delete User</button></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import './UserManager.scss';

import userFunctions from '@/composables/userFunctions';

export default defineComponent({
    setup() {
        const user = ref('');
        const pass = ref('');

        const users = ref([]);

        const { addUser, loadUsers } = userFunctions();

        onMounted(() => {
            loadUsers();
        });

        return { user, pass, addUser };
    },
})
</script>
