<template>
    <div id="newuser">
        <input type="text" placeholder="Username" v-model="newusername"/>
        <input type="text" placeholder="Password" v-model="newpassword"/>
        <input type="text" placeholder="Mobilenumber" v-model="newmobilenumber"/>
        <input type="text" placeholder="Description" v-model="newdescription"/>
        <button v-on:click="addUserWithInfo">Add User</button>
    </div>
</template>

<script lang="ts">
import './NewUser.scss';
import { defineComponent, ref } from 'vue';
import userAddition from '../composables/userAddition';

export default defineComponent({
    setup() {
        const { addUser } = userAddition();
        const newusername = ref('');
        const newpassword = ref('');
        const newmobilenumber = ref('');
        const newdescription = ref('');

        const addUserWithInfo = () => {
            addUser(newusername.value, newpassword.value, newmobilenumber.value, newdescription.value);
            newusername.value = '';
            newpassword.value = '';
            newmobilenumber.value = '';
            newdescription.value = '';
        }

        return { addUserWithInfo, newusername, newpassword, newmobilenumber, newdescription };
    },
})
</script>
