<template>
    <div id="filescontainer">
        <div class="fileuploadercontainer" v-show="showFileUploader">
            <div class="close"><span class="material-icons-outlined" v-on:click="closeFileUploader">close</span></div>
            <div class="village">
                Current Village: {{ currentvillage }}
            </div>
            <div class="fileuploader">
                <input class="file" type="file" ref="fileEl"><br>
                <input class="description" type="text" v-model="description" placeholder="description" size="40"><br>
                <progress max="100" v-bind:value="fileuploadprogress"></progress><br>
                <button class="uploadbtn" v-on:click="calluploadfile" v-bind:disabled="uploadbtndisabled">Upload</button>
            </div>
        </div>
        <div class="filesloadercontainer" v-show="showFilesLoader">
            <div class="close"><span class="material-icons-outlined" v-on:click="closeFilesLoader">close</span></div>
            <div class="village">
                Current Village: {{ currentvillage }}
            </div>
            <button v-on:click="loadFiles">Load Files</button>
        </div>
    </div>
</template>

<script lang="ts">
import store from '@/store';
import { computed, defineComponent, onMounted, ref } from 'vue';
import './FilesContainer.scss';

import fileUploader from '@/composables/fileUploader';
import globalToast from '../composables/globalToast';

export default defineComponent({
    setup() {
        const { showGlobalToast } = globalToast();
        const { uploadFile } = fileUploader();

        const showFileUploader = computed(() => store.getters.getShowFilesUploader);
        const showFilesLoader = computed(() => store.getters.getShowFilesLoader);

        const fileuploadprogress = computed(() => store.getters.getFileUploadProgress);
        
        const currentuser = computed(() => store.getters.getUsername);
        const currentvillage = computed(() => store.getters.getCurrentVillage);
        const currentvillagecode = computed(() => store.getters.getCurrentUniqueVillageCode);
        const currentvillagedetails = computed(() => store.getters.getCurrentVillageDetails);

        const fileEl = ref();
        const fileName = ref('');
        const fileType = ref('');

        const description = ref('');
        const uploadbtndisabled = computed(() => store.getters.getUploadBtnDisabled);

        const closeFileUploader = () => {
            store.dispatch('setShowFilesUploader', false);
        }

        const closeFilesLoader = () => {
            store.dispatch('setShowFilesLoader', false);
        }

        const loadFileInformation = (e: any) => {
            let file = e.target.files[0];
            let fileFullname = file.name;
            let lastDot = fileFullname.lastIndexOf('.');
            let extension = fileFullname.substring(lastDot + 1);
            let filename = fileFullname.substring(0, lastDot);

            fileName.value = filename;
            fileType.value = extension;
        }

        const calluploadfile = () => {
            if(fileName.value == '' || fileType.value == ''){
                showGlobalToast('Select Valid File');
                return 0;
            }

            if(currentvillage.value == '' ||  currentvillagecode.value == ''){
                showGlobalToast('Select Village First');
                return 0;
            }

            if(description.value == ''){
                showGlobalToast('Enter Some Description');
                return 0;
            }

            uploadFile(currentvillagedetails.value, currentvillage.value, currentvillagecode.value, fileName.value, fileType.value, description.value, currentuser.value, fileEl.value);
            store.dispatch('setUploadBtnDisabled', true);
        }

        const loadFiles = () => {
            showGlobalToast('Loading Files...');
            
        }

        onMounted(() => {
            fileEl.value.addEventListener('change', loadFileInformation);
        });

        return { 
            showFileUploader, showFilesLoader, fileuploadprogress,
            currentvillage, closeFileUploader, closeFilesLoader, loadFiles,
            fileEl, description, calluploadfile, uploadbtndisabled
        }
    },
})
</script>
