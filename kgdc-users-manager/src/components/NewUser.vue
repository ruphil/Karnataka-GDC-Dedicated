<template>
    <div id="newuser">
        <input type="text" placeholder="Username" v-model="newusername"/>
        <input type="text" placeholder="Password" v-model="newusername"/>
        <input type="text" placeholder="Mobilenumber" v-model="newusername"/>
        <input type="text" placeholder="Description" v-model="newusername"/>
        <button v-on:click="addUser">Add User</button>
    </div>
</template>

<script lang="ts">
import './NewUser.scss';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const addUser = () => {
            
        }
    },
})
</script>
