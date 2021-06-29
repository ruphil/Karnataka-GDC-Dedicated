<template>
    <div id="filescontainer">
        <div class="fileuploadercontainer" v-show="showFileUploader">
            <div class="close"><span class="material-icons-outlined" v-on:click="closeFileUploader">close</span></div>
            <div class="village">
                Current Village: {{ currentvillage }}
            </div>
            <div class="fileuploader">
                <input class="file" type="file" ref="fileEl"><br>
                <input class="description" type="text" v-model="filedetails" placeholder="description" size="40"><br>
                <button class="uploadbtn" v-on:click="calluploadfile" v-bind:disabled="uploadbtndisabled">Upload</button>
            </div>
        </div>
        <div class="filesloader" v-show="showFilesLoader">
            
        </div>
    </div>
</template>

<script lang="ts">
import store from '@/store';
import { computed, defineComponent, ref } from 'vue';
import './FilesContainer.scss';

export default defineComponent({
    setup() {
        const showFileUploader = computed(() => store.getters.getShowFilesUploader);
        const showFilesLoader = computed(() => store.getters.getShowFilesLoader);
        const currentvillage = computed(() => store.getters.getCurrentVillage);

        const fileEl = ref();
        const filedetails = ref('');
        const uploadbtndisabled = ref(false);

        const closeFileUploader = () => {
            store.dispatch('setShowFilesUploader', false);
        }

        const calluploadfile = () => {

        }

        return { 
            showFileUploader, showFilesLoader, currentvillage, closeFileUploader,
            fileEl, filedetails, calluploadfile, uploadbtndisabled
        }
    },
})
</script>
