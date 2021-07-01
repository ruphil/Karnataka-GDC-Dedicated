<template>
    <div id="drones">
        <br/>
        <button v-on:click="getDrones"><h3 style="display:inline-block;">Fetch Drones</h3></button>
        <br/><br/>

        <table border="1" class="tablecenter">
            <tr>
                <td>Drone Number</td><td>Delete</td>
            </tr>
            <tr v-for="(drone, index) in dronenumbers" v-bind:key="index">
                <td>{{ drone.dronenumber }}</td>
                <td><button v-bind:dronenumber="drone.dronenumber" v-on:click="deleteDroneNumber">Delete User</button></td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import './DronesSection.scss';
import { computed, defineComponent } from 'vue'
import store from '@/store';

import droneNumbersFetch from '@/composables/droneNumbersFetch';
import droneNumberRemove from '@/composables/droneNumberRemove';

export default defineComponent({
    setup() {
        const { getDrones } = droneNumbersFetch();
        const { deleteDrone } = droneNumberRemove();

        const dronenumbers = computed(() => store.getters.getDroneNumbers);

        const deleteDroneNumber = (e: any) => {
            let dronenumber = e.target.getAttribute('dronenumber');
            // console.log(dronenumber);

            deleteDrone(dronenumber);
        }

        return { getDrones, deleteDroneNumber, dronenumbers }
    },
})
</script>
