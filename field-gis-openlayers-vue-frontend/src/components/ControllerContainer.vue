<template>
    <div id="controllercontainer">
        <div id="controllerbtncontainer">
            <button id="controllerbtn" v-on:click="showContainer = !showContainer">⚙</button>
        </div>
        <Controller v-show="showContainer"/>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Controller from './Controller.vue';

export default defineComponent({
    components: {
        Controller
    },
    setup() {
        const showContainer = ref(true);

        return { showContainer };
    }
})
</script>
