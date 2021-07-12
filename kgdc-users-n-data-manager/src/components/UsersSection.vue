<template>
    <div id="userstable">
        <br/>
        <button v-on:click="getUsers"><h3 style="display:inline-block;">Fetch Users</h3></button>
        <br/><br/>

        <table border="1" class="tablecenter">
            <tr>
                <td>Username</td><td>Password</td><td>Mobilenumber</td><td>Description</td><td>Add Role</td><td>Remove Role</td><td>Delete</td>
            </tr>
            <tr v-for="(user, index) in usersData" v-bind:key="index">
                <td>{{ user.username }}</td>
                <td>
                    <input type="text" size="10" v-bind:value="user.password">
                    <div><button v-bind:username="user.username" v-on:click="updateaction" v-bind:updatetype="'password'">Update</button></div>
                </td>
                <td>
                    <input type="text" size="10" v-bind:value="user.mobilenumber">
                    <div><button v-bind:username="user.username" v-on:click="updateaction" v-bind:updatetype="'mobilenumber'">Update</button></div>
                </td>
                <td>
                    <input type="text" size="10" v-bind:value="user.description">
                    <div><button v-bind:username="user.username" v-on:click="updateaction" v-bind:updatetype="'description'">Update</button></div>
                </td>
                
                <td v-bind:username="user.username" v-bind:roles="user.roles">
                    {{ user.roles }} <br>
                    <input type="text" />
                    <button v-on:click="addRole">Add</button>
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
import roleAssignment from '../composables/roleAssignment';
import userDeletion from '../composables/userDeletion';

import globalToast from '@/composables/globalToast';

export default defineComponent({
    setup() {
        const { showGlobalToast } = globalToast();
        const { getUsers } = usersTable();
        const { assignRole } = roleAssignment();
        const { deleteUser } = userDeletion();

        const usersData = computed(() => store.getters.getUsersTable);

        const renderRolesOptions = computed(() => {
            return (roles: any) => {
                if(roles != null && roles != ''){
                    return [...new Set(roles.split(','))];
                } else {
                    return [];
                }
            }
        });

        const callDeleteUser = (e: any) => {
            let username = e.target.getAttribute('updatetype');
            console.log(username);

            deleteUser(username);
        }

        const updateaction = (e: any) => {
            let el = e.target;
            let username = el.getAttribute('username');
            let updatetype = el.getAttribute('updatetype');

            console.log(username, updatetype);
        }

        const addRole = (e: any) => {
            let parent = e.target.parentNode;
            let username = parent.getAttribute('username');
            let rolesPresent = parent.getAttribute('roles');
            let roleInput = parent.querySelectorAll('input')[0];
            let roleToAdd = roleInput.value;

            if(roleToAdd == ''){
                showGlobalToast('Enter Some Role...');
                return 0;
            }

            let rolesArry = rolesPresent.split(',');
            rolesArry.push(roleToAdd);
            let modifiedRolesArry = [...new Set(rolesArry)];
            console.log(modifiedRolesArry);

            let modifiedRole = modifiedRolesArry.join(',').replace(/^,|,$/g,'');

            roleInput.value = '';
            assignRole(username, modifiedRole);
        }

        const removeRole = (e: any) => {
            let parent = e.target.parentNode;
            let username = parent.getAttribute('username');
            let rolesPresent = parent.getAttribute('roles');
            let roleSelect = parent.querySelectorAll('select')[0];
            let roleToRemove = roleSelect.options[roleSelect.selectedIndex].text;
            let rolesArry = rolesPresent.split(',');
            let modifiedRolesArry = rolesArry.filter((i: any) => i != roleToRemove);
            let modifiedRole = modifiedRolesArry.join(',').replace(/^,|,$/g,'');

            assignRole(username, modifiedRole);
        }

        return { 
            getUsers, usersData, renderRolesOptions, callDeleteUser,
            updateaction,
            addRole, removeRole
        }
    },
})
</script>
