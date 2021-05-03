<template>
    <div id="controllercontainer">
        <div id="controllerbtncontainer">
            <button id="controllerbtn">⚙</button>
        </div>
        
        <!-- <Login /> -->
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
