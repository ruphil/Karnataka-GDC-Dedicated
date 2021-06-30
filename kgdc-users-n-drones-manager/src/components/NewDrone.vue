<template>
    <div id="newdrone">
        <input type="text" v-model="newdrone">
        <button v-on:click="addDroneNumber">Add Drone</button>
    </div>
</template>

<script lang="ts">
import './NewDrone.scss';
import store from '@/store';
import { computed, defineComponent, ref } from 'vue';

import droneNumberAdd from '@/composables/droneNumberAdd';
import droneNumberRemove from '@/composables/droneNumberRemove';
import droneNumbersFetch from '@/composables/droneNumbersFetch';

export default defineComponent({
    setup() {
        const newdrone = ref('');
        const dronenumbers = computed(() => store.getters.getDroneNumbers);

        const { addDrone } = droneNumberAdd();
        const { deleteDrone } = droneNumberRemove();
        const { getDrones } = droneNumbersFetch();

        const addDroneNumber = () => {
            addDrone(newdrone);
            newdrone.value = '';
        }

        const deleteDroneNumber = () => {
            
        }

        return { newdrone, dronenumbers, addDroneNumber, deleteDroneNumber }
    },
})
</script>
