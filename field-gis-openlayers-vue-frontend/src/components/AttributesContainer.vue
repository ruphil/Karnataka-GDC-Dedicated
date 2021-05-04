<template>
    <div id="attributescontainer">
        <div id="attributesbox">
            <select v-model="currentdronenumber">
                <option v-for="(dronenumber, index) in dronenumbersList" v-bind:key="index">{{ dronenumber }}</option>
            </select>
            <input type="text" placeholder="Unique Flight Number"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
    setup() {
        const store = useStore();
        const currentdronenumber = ref();
        
        const dronenumbersList = computed(() => store.getters.getDroneNumbers);

        return { currentdronenumber, dronenumbersList }
    },
})
</script>
