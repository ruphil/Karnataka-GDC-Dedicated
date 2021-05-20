<template>
    <div id="usersmanager">
        <div class="usersboxcontainer">
            <div class="usersbox">
                <input type="text" v-model="user" placeholder="Username">
                <input type="text" v-model="pass" placeholder="Password">
                <button v-on:click="addUser(user, pass)">Add User</button>
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

        const { addUser, loadUsers } = userFunctions();

        onMounted(() => {
            loadUsers();
        });

        return { user, pass, addUser };
    },
})
</script>
