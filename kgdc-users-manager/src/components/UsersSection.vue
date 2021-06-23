<template>
    <div id="userstable">
        <br/>
        <button v-on:click="getUsers"><h3 style="display:inline-block;">Fetch Users</h3></button>
        <br/><br/>

        <table border="1" class="tablecenter">
            <tr>
                <td>Username</td><td>Password</td><td>Mobilenumber</td><td>Description</td><td>Roles</td><td>Add Role</td><td>Remove Role</td><td>Delete</td>
            </tr>
            <!-- <tr v-for="(user, index) in users" v-bind:key="index">
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
            </tr> -->
        </table>
    </div>
</template>

<script lang="ts">
import './UsersSection.scss';
import { computed, defineComponent } from 'vue'
import store from '@/store';
import usersTable from '../composables/fetchUserTable';

export default defineComponent({
    setup() {
        const { getUsers } = usersTable();

        return { getUsers }
    },
})
</script>
