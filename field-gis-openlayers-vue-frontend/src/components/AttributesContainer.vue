<template>
    <div id="attributescontainer">
        <div id="attributesbox">
            <select v-model="currentdronenumber">
                <option v-for="(dronenumberfeat, index) in dronenumbersGJ.features" v-bind:key="index">{{ dronenumberfeat.id.replace('tabledronenumbers.', '') }}</option>
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
        
        const dronenumbersGJ = computed(() => store.getters.getDroneNumbersGJ);

        return { currentdronenumber, dronenumbersGJ }
    },
})
</script>
