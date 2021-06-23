<template>
    <div id="userstable">
        <br/>
        <button v-on:click="getUsers"><h3 style="display:inline-block;">Fetch Users</h3></button>
        <br/><br/>

        <table border="1" class="tablecenter">
            <tr>
                <td>Username</td><td>Password</td><td>Mobilenumber</td><td>Description</td><td>Roles</td><td>Add Role</td><td>Remove Role</td><td>Delete</td>
            </tr>
            <tr v-for="(user, index) in usersData" v-bind:key="index">
                <td>{{ user.username }}</td><td>{{ user.password }}</td><td>{{ user.mobilenumber }}</td>
                <td>{{ user.description }}</td><td>{{ user.roles }}</td>
                <td v-bind:username="user.username" v-bind:roles="user.roles">
                <input type="text" /><button v-on:click="addRole">Add</button>
                </td>
                <td v-bind:username="user.username" v-bind:roles="user.roles">
                <select>
                    <option selected></option>
                    <option v-for="(item, index) in renderRolesOptions(user.roles)" v-bind:key="index">
                    {{ item }}
                    </option>
                </select>
                <button v-on:click="removeRole">Remove</button>
                </td>
                <td><button v-bind:username="user.username" v-on:click="callDeleteUser">Delete User</button></td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import './UsersSection.scss';
import { computed, defineComponent } from 'vue'
import store from '@/store';
import usersTable from '../composables/fetchUserTable';
import userDeletion from '../composables/userDeletion';

export default defineComponent({
    setup() {
        const { getUsers } = usersTable();
        const { deleteUser } = userDeletion();

        const usersData = computed(() => store.getters.getUsersTable);

        const renderRolesOptions = computed(() => {
            return (roles: any) => {
                if(roles != ''){
                    return [...new Set(roles.split(','))];
                } else {
                    return [];
                }
            }
        });

        const callDeleteUser = (e: any) => {
            let username = e.target.getAttribute('username');
            console.log(username);

            deleteUser(username);
        }

        return { getUsers, usersData, renderRolesOptions, callDeleteUser }
    },
})
</script>
