<template>
    <div id="userstable">
        <br/>
        <button v-on:click="getUsers"><h3 style="display:inline-block;">Fetch Users</h3></button>
        <br/><br/>

        <table border="1" class="tablecenter">
            <tr>
                <th>Username</th><th>Password</th><th>Mobilenumber</th><th>Description</th>
                <th>Expiry</th><th>Roles</th><th>Jurisdiction</th><th>Delete</th>
            </tr>
            <tr v-for="(user, index) in usersData" v-bind:key="index">
                <td>{{ user.username }}</td>
                <td>
                    <input type="text" size="10" v-bind:value="user.password"><br><br>
                    <button v-bind:username="user.username" v-on:click="updateAction" v-bind:updatetype="'password'">Update</button>
                </td>
                <td>
                    <input type="text" size="10" v-bind:value="user.mobilenumber"><br><br>
                    <button v-bind:username="user.username" v-on:click="updateAction" v-bind:updatetype="'mobilenumber'">Update</button>
                </td>
                <td>
                    <input type="text" size="10" v-bind:value="user.description"><br><br>
                    <button v-bind:username="user.username" v-on:click="updateAction" v-bind:updatetype="'description'">Update</button>
                </td>
                <td>
                    <input type="date" size="10" v-bind:value="user.expiry.substring(0, user.expiry.indexOf('T'))"><br><br>
                    <button v-bind:username="user.username" v-on:click="updateAction" v-bind:updatetype="'expiry'">Update</button>
                </td>
                
                <td v-bind:username="user.username" v-bind:roles="user.roles">
                    Defined:<br> {{ user.roles }} <br><br>
                    <input type="text" />
                    <button v-on:click="addRole">Add</button>
                    <br><br>
                    <select>
                        <option selected></option>
                        <option v-for="(item, index) in renderOptions(user.roles)" v-bind:key="index">
                        {{ item }}
                        </option>
                    </select>
                    <button v-on:click="removeRole">Remove</button>
                </td>

                <td v-bind:username="user.username" v-bind:jurisdiction="user.jurisdiction">
                    Defined:<br> {{ user.jurisdiction }} <br><br>
                    <select>
                        <option selected></option>
                        <option v-for="(item, index) in jurisdictions" v-bind:key="index">
                        {{ item.jurisdiction }}
                        </option>
                    </select>
                    <button v-on:click="addJurisdiction">Add</button>
                    <br><br>
                    <select>
                        <option selected></option>
                        <option v-for="(item, index) in renderOptions(user.jurisdiction)" v-bind:key="index">
                        {{ item }}
                        </option>
                    </select>
                    <button v-on:click="removeJurisdiction">Remove</button>
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
import usersTable from '@/composables/fetchUserTable';
import roleJurisdictionAssignment from '@/composables/roleJurisdictionAssignment';
import userDeletion from '@/composables/userDeletion';
import userCredentialsUpdation from '@/composables/userCredentialsUpdation';

import globalToast from '@/composables/globalToast';

export default defineComponent({
    setup() {
        const { showGlobalToast } = globalToast();
        const { getUsers } = usersTable();
        const { modifyRole, modifyJurisdiction } = roleJurisdictionAssignment();
        const { deleteUser } = userDeletion();
        const { updateCredentials } = userCredentialsUpdation();

        const usersData = computed(() => store.getters.getUsersTable);
        const jurisdictions = computed(() => store.getters.getJurisdictions);

        const renderOptions = computed(() => {
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

        const updateAction = (e: any) => {
            let el = e.target;
            let parent = e.target.parentNode;

            let username = el.getAttribute('username');
            let updatetype = el.getAttribute('updatetype');

            let updateinput = parent.querySelectorAll('input')[0];
            let updatevalue = updateinput.value;

            updateCredentials(username, updatetype, updatevalue);
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
            modifyRole(username, modifiedRole);
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

            modifyRole(username, modifiedRole);
        }

        const addJurisdiction = (e: any) => {
            let parent = e.target.parentNode;
            let username = parent.getAttribute('username');
            let jurisdictionPresent = parent.getAttribute('jurisdiction');
            let jurisdictionSelect = parent.querySelectorAll('select')[0];
            let jurisdictionToAdd = jurisdictionSelect.options[jurisdictionSelect.selectedIndex].text;
            let jurisdictionArry = jurisdictionPresent.split(',');

            jurisdictionArry.push(jurisdictionToAdd);
            let modifiedJurisdictionArry = [...new Set(jurisdictionArry)];
            let modifiedJurisdiction = modifiedJurisdictionArry.join(',').replace(/^,|,$/g,'');
            // console.log(username, jurisdictionPresent, modifiedJurisdiction);

            modifyJurisdiction(username, modifiedJurisdiction);
        }

        const removeJurisdiction = (e: any) => {
            let parent = e.target.parentNode;
            let username = parent.getAttribute('username');
            let jurisdictionPresent = parent.getAttribute('jurisdiction');
            let jurisdictionSelect = parent.querySelectorAll('select')[0];
            let jurisdictionToRemove = jurisdictionSelect.options[jurisdictionSelect.selectedIndex].text;
            let rolesArry = jurisdictionPresent.split(',');
            let modifiedJurisdictionArry = rolesArry.filter((i: any) => i != jurisdictionToRemove);
            let modifiedJurisdiction = modifiedJurisdictionArry.join(',').replace(/^,|,$/g,'');

            modifyJurisdiction(username, modifiedJurisdiction);
        }

        return { 
            getUsers, usersData, jurisdictions, renderOptions,
            callDeleteUser, updateAction,
            addRole, removeRole,
            addJurisdiction, removeJurisdiction
        }
    },
})
</script>
