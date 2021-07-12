<template>
    <div id="newuser">
        <input type="text" placeholder="Username" v-model="newusername"/>
        <input type="text" placeholder="Password" v-model="newpassword"/>
        <input type="text" placeholder="Mobilenumber" v-model="newmobilenumber"/><br>
        <input type="text" placeholder="Description" v-model="newdescription"/>
        <input type="date" title="Expiry" v-model="expiry"/>
        <button v-on:click="addUserWithInfo">Add User</button>
    </div>
</template>

<script lang="ts">
import './NewUser.scss';
import { defineComponent, onMounted, ref } from 'vue';
import userAddition from '../composables/userAddition';

export default defineComponent({
    setup() {
        const { addUser } = userAddition();
        const newusername = ref('');
        const newpassword = ref('');
        const newmobilenumber = ref('');
        const newdescription = ref('');
        const expiry = ref('');

        const addUserWithInfo = () => {
            addUser(newusername.value, newpassword.value, newmobilenumber.value, newdescription.value, expiry.value);
            newusername.value = '';
            newpassword.value = '';
            newmobilenumber.value = '';
            newdescription.value = '';
            expiry.value = '';
        }

        onMounted(() => {
            expiry.value = '2099-12-31';
        });

        return { addUserWithInfo, newusername, newpassword, newmobilenumber, newdescription, expiry };
    },
})
</script>
