<template>
    <div id="newdrone">
        <input type="text" v-model="newdrone">
        <button v-on:click="addDroneNumber">Add Drone</button>
    </div>
</template>

<script lang="ts">
import './NewDrone.scss';
import { defineComponent, ref } from 'vue';

import globalToast from '@/composables/globalToast';
import droneNumberAdd from '@/composables/droneNumberAdd';

export default defineComponent({
    setup() {
        const { showGlobalToast } = globalToast();

        const newdrone = ref('');

        const { addDrone } = droneNumberAdd();

        const addDroneNumber = () => {
            let dronenumber = newdrone.value;
            if(dronenumber != ''){
                addDrone(dronenumber);
                newdrone.value = '';
            } else {
                showGlobalToast('Enter Drone Number...');
            }
        }

        return { newdrone, addDroneNumber }
    },
})
</script>
