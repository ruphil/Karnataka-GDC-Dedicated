<template>
    <div id="controllercontainer">
        <div id="controllermainbtncontainer">
            <button id="controllermainbtn" v-on:click="showContainer = !showContainer">⚙</button>
        </div>
        <div id="controllerlayersbtncontainer">
            <button id="controllerlayersbtn" v-on:click="showContainer = !showContainer">🗐</button>
        </div>
        <div id="controllersummarybtncontainer">
            <button id="controllersummarybtn" v-on:click="showContainer = !showContainer">⎙</button>
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
