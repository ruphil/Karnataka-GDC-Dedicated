<template>
    <div id="controller">
        <br/>
        <Login />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Login from './Login.vue';

export default defineComponent({
    components: {
        Login
    }
})
</script>
