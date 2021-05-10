<template>
    <div id="leftsidebar" ref="leftsidebar">
        <div class="soilogo">
            <span class="logo"></span>
            <span class="soi"></span>
        </div>
        <div class="categoryitems">
            <div class="category" title="Add Marked Villages" v-on:click="router.push({path: '/markedvillages'});store.dispatch('setCategoryInfo', 'Add Marked Villages')">
                <span class="icon"><span class="material-icons-outlined">add_location</span></span>
                <span class="label" v-show="expanded">Add Marked Villages</span>
            </div>
            <div class="category" title="Make Mission Plan" v-on:click="router.push({path: '/missionplan'});store.dispatch('setCategoryInfo', 'Make Mission Plan')">
                <span class="icon"><span class="material-icons-outlined">highlight_alt</span></span>
                <span class="label" v-show="expanded">Make Mission Plan</span>
            </div>
            <div class="category" title="Flights Manager" v-on:click="router.push({path: '/flights'});store.dispatch('setCategoryInfo', 'Flights Manager')">
                <span class="icon"><span class="material-icons-outlined">flight_takeoff</span></span>
                <span class="label" v-show="expanded">Flights Manager</span>
            </div>
        </div>
        <div class="expandbtncontainer">
            <button class="expandbtn" v-show="!expanded" v-on:click="toggleExpansion"><span class="material-icons-outlined">arrow_forward</span></button>
            <button class="expandbtn" v-show="expanded" v-on:click="toggleExpansion"><span class="material-icons-outlined">arrow_back</span></button>
        </div>
    </div>
</template>

<script lang="ts">
import router from '@/router';
import store from '@/store';
import { defineComponent, ref } from 'vue'

import './LeftSideBar.scss';

export default defineComponent({
    setup() {
        const leftsidebar = ref();
        const expanded = ref(false);
        
        const toggleExpansion = () => {
            let el = leftsidebar.value;
            
            if(el.classList.contains('grown')){
                el.classList.remove('grown');
                el.classList.add('shrunk');
            } else {
                el.classList.remove('shrunk');
                el.classList.add('grown');
            }

            expanded.value = !expanded.value;
        }

        const clicktest = () => {
            console.log(23);
        }
        
        return { leftsidebar, expanded, toggleExpansion, router, store }
    },
})
</script>
