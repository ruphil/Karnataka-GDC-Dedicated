<template>
    <div id="newdrone">
        <input type="text" v-model="newdrone">
        <button v-on:click="addDroneNumber">Add Drone</button>
    </div>
</template>

<script lang="ts">
import store from '@/store';
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
    setup() {
        const newdrone = ref('');
        const dronenumbers = computed(() => store.getters.getDroneNumbers);

        const addDroneNumber = () => {
            
        }

        const deleteDroneNumber = () => {

        }

        return { newdrone, dronenumbers, addDroneNumber, deleteDroneNumber }
    },
})
</script>
