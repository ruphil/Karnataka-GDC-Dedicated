<template>
    <div id="filescontainer">
        <div class="fileuploadercontainer" v-show="showFileUploader">
            <div class="close"><span class="material-icons-outlined" v-on:click="closeFileUploader">close</span></div>
            <div class="village">
                <span>Current Village: {{ currentvillage }}</span>
            </div>
            <div class="fileuploader">
                <input class="file" type="file" ref="fileEl"><br>
                <input class="description" type="text" v-model="description" placeholder="description" size="40"><br>
                <progress max="100" v-bind:value="fileuploadprogress"></progress><br>
                <button class="uploadbtn" v-on:click="calluploadfile" v-bind:disabled="uploadbtndisabled">Upload</button>
            </div>
        </div>
        <div class="filesloadercontainer" v-show="showFilesLoader">
            <div class="village">
                <span class="material-icons-outlined close" v-on:click="closeFilesLoader">close</span>
                &emsp;&emsp;&emsp;
                <span>Current Village: {{ currentvillage }}</span>
                &emsp;&emsp;&emsp;
                <button v-on:click="loadFiles">Load Files</button>
            </div>
            <div class="tablecontainer">
                <div class="display-table-fileslist">
                    <div>
                        <div><b>No</b></div>
                        <div>File Type</div>
                        <div><b>Details</b></div>
                        <div><b>Uploader Info</b></div>
                        <div><b>Approver Info</b></div>
                        <div><b>Approve</b></div>
                        <div><b>Download</b></div>
                    </div>
                    <div v-for="(abadi, index) in filesList.abadilist" v-bind:key="index">
                        <div>{{ index + 1 }}</div>
                        <div>KML</div>
                        <div>
                            <span>Abadi Name: </span><span>{{ abadi.abadilimitname }}</span><br>
                            <span>Marked Date: </span><span>{{ abadi.markingenddate }}</span><br>
                            <span>Village: </span><span>{{ abadi.villagename }} ({{ abadi.villagelgdcode }})</span>
                        </div>
                        <div>{{ abadi.creatorinfo }}</div>
                        <div>{{ abadi.approverinfo }}</div>
                        <div><button class="olbtns" v-bind:gid="abadi.gid" v-on:click="approveAbadi"><span class="material-icons-outlined"      v-bind:gid="abadi.gid">thumb_up_alt</span></button></div>
                        <div><button class="olbtns" v-bind:gid="abadi.gid" v-on:click="downloadAbadi"><span class="material-icons-outlined"     v-bind:gid="abadi.gid">file_download</span></button></div>
                    </div>
                    <div v-for="(attachment, index) in filesList.attachmentlist" v-bind:key="index">
                        <div>{{ index + 1 }}</div>
                        <div>Attachment</div>
                        <div>
                            <span>File Name: </span><span>{{ attachment.identifier }}</span><br>
                            <span>Description: </span><span>{{ attachment.description }}</span>&emsp;&emsp;
                            <span>Upload Date: </span><span>{{ attachment.serverdate }}</span>
                        </div>
                        <div>{{ attachment.uploaderinfo }}</div>
                        <div>{{ attachment.approverinfo }}</div>
                        <div><button class="olbtns" v-bind:id="attachment.id" v-on:click="approveFile"><span class="material-icons-outlined"      v-bind:id="attachment.id">thumb_up_alt</span></button></div>
                        <div><button class="olbtns" v-bind:id="attachment.id" v-on:click="downloadAttachment"><span class="material-icons-outlined"     v-bind:id="attachment.id">file_download</span></button></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import store from '@/shared/store';

import { computed, defineComponent, onMounted, ref } from 'vue';
import './FilesContainer.scss';

import globalToast from '@/shared/composables/globalToast';
import fileUploader from '@/shared/composables/fileUploader';
import filesListLoader from '@/shared/composables/filesListLoader';
import downloaderKML from '@/shared/composables/downloaderKML';
import downloaderAttachment from '@/shared/composables/downloaderAttachment';
import approverFilesList from '@/shared/composables/approverFilesList';

export default defineComponent({
    setup() {
        const { showGlobalToast } = globalToast();
        const { uploadFile } = fileUploader();
        const { loadFilesList } = filesListLoader();
        const { downloadKML } = downloaderKML();
        const { downloadFile } = downloaderAttachment();
        const { approveKML, approveAttachment } = approverFilesList();

        const showFileUploader = computed(() => store.getters.getShowFilesUploader);
        const showFilesLoader = computed(() => store.getters.getShowFilesLoader);

        const fileuploadprogress = computed(() => store.getters.getFileUploadProgress);
        
        const currentuser = computed(() => store.getters.getUsername);

        const currentvillage = computed(() => store.getters.getCurrentVillage);
        const currentvillagecode = computed(() => store.getters.getCurrentUniqueVillageCode);
        const currentvillagedetails = computed(() => store.getters.getCurrentVillageDetails);

        const filesList = computed(() => store.getters.getFilesList);

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
            if(currentvillage.value == '' ||  currentvillagecode.value == ''){
                showGlobalToast('Select Village First');
                return 0;
            }
            
            showGlobalToast('Loading Files...');
            loadFilesList();
        }

        onMounted(() => {
            fileEl.value.addEventListener('change', loadFileInformation);
        });

        const approveAbadi = (e: any) => {
            let gid = e.target.getAttribute('gid');
            console.log(gid);

            approveKML(gid);
        }

        const approveFile = (e: any) => {
            let id = e.target.getAttribute('id');
            console.log(id);

            approveAttachment(id);
        }

        const downloadAbadi = (e: any) => {
            let gid = e.target.getAttribute('gid');
            console.log(gid);

            downloadKML(gid);
        }

        const downloadAttachment = (e: any) => {
            let gid = e.target.getAttribute('id');
            console.log(gid);

            downloadFile(gid);
        }

        return { 
            showFileUploader, showFilesLoader, fileuploadprogress,
            currentvillage, closeFileUploader, closeFilesLoader, loadFiles,
            fileEl, description, calluploadfile, uploadbtndisabled, filesList,
            approveAbadi, approveFile,
            downloadAbadi, downloadAttachment
        }
    },
})
</script>
