<template>
    <div id="digitizedmaps">
        <div class="toolscontainer">
            <button class="toggletools" v-on:click="showtools = !showtools"><span class="material-icons-outlined" title="Tools">handyman</span></button>
            <div class="tools" v-show="showtools">
                <div class="display-table-tools">
                    <div>
                        <div><button class="olbtns" v-on:click="loadBaseMapToExtent">Load Basemap To Extent</button></div>
                        <div><button class="olbtns" v-on:click="unloadBaseMap">Unload BaseMap</button></div>  
                    </div>
                    <div>
                        <div>
                            <select v-model="districtref" style="font-size:0.5em;">
                                <option disabled value="">Select District</option>
                                <option v-for="(district, index) in districtsList" v-bind:key="index">{{ district }}</option>
                            </select>
                        </div>
                        <div><button class="olbtns" v-on:click="loadVillagesBoundsRef">Load Villages By District</button></div>
                    </div>
                    <div>
                        <div><button class="olbtns">Load Villages In View N By District</button></div>
                        <div><button class="olbtns" v-on:click="unloadVillagesBounds">Unload Villages</button></div>
                    </div>
                    <div>
                        <div><button class="olbtns">Load Marked Settlements In View N By District</button></div>
                        <div><button class="olbtns">Unload Marked Settlements</button></div>
                    </div>
                    <div>
                        <div><button class="olbtns" v-on:click="showFileUploader = !showFileUploader">Toggle File Uploader</button></div>
                        <div><button class="olbtns" v-on:click="callgetfilelist">Get Files for Village</button></div>
                    </div>
                </div>
                <div style="font-size:18px;text-align:center">Current Village: {{ currentvillage }}</div>
                <div class="display-table-files">
                    <div>
                        <div><b>No</b></div>
                        <div><b>Identifier</b></div>
                        <div><b>Details</b></div>
                        <div><b>Upload Date</b></div>
                        <div><b>Uploaded By</b></div>
                        <div><b>Approved</b></div>
                        <div><b>Download</b></div>
                    </div>
                    <div v-for="(file, index) in filelist" v-bind:key="index" v-show="toShowFile(file.approved, file.uploaderrole)">
                        <div>{{ index + 1 }}</div>
                        <div>{{ file.identifier }}</div>
                        <div>{{ file.details }}</div>
                        <div>{{ file.serverdate }}</div>
                        <div>{{ file.uploadedby }}</div>
                        <div v-html="getApproveRole(file.approved, file.id)" v-on:click="callapproveFile" v-bind:fileid="file.id"></div>
                        <div><button class="olbtns"><span class="material-icons-outlined" v-bind:fileid="file.id">file_download</span></button></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fileuploadercontainer" v-show="showFileUploader">
            <div class="close"><span class="material-icons-outlined" v-on:click="showFileUploader = false">close</span></div>
            <div class="village">
                Current Village: {{ currentvillage }}
            </div>
            <div class="fileuploader">
                <input class="file" type="file" ref="fileEl"><br>
                <input class="description" type="text" v-model="filedetails" placeholder="description" size="40"><br>
                <button class="uploadbtn" v-on:click="calluploadfile" v-bind:disabled="uploadbtndisabled">Upload</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import store from '@/store';
import { computed, defineComponent, onMounted, ref } from 'vue'

import './DigitizedMaps.scss';

import villagesBoundsLoader from '../composables/villagesBoundsLoader';
import baseMapLoader from '../composables/baseMapLoader';
import globalToast from '../composables/globalToast';
import filemanager from '../composables/filemanager';

export default defineComponent({
    setup() {
        const { loadVillagesBounds, unloadVillagesBounds } = villagesBoundsLoader();
        const { loadBaseMapToExtent, unloadBaseMap } = baseMapLoader();
        const { showGlobalToast } = globalToast();
        const { uploadfile, getfilelist, approvefile, downloadfile } = filemanager();

        const return0 = { unloadVillagesBounds, loadBaseMapToExtent, unloadBaseMap };

        const districtsList = computed(() => store.getters.getDistrictsList);
        const districtref = ref('');
        const loadedDistrict = ref('');

        const showtools = ref(false);
        
        const loadVillagesBoundsRef = () => {
            if(districtref.value != '' && loadedDistrict.value != districtref.value){
                loadVillagesBounds(districtref.value);
                loadedDistrict.value = districtref.value;
            }
        }

        const return1 = { districtsList, districtref, showtools, loadVillagesBoundsRef }

        onMounted(() => {
            store.dispatch('setCategoryInfo', 'Digitized Maps');
        });

        const fileEl = ref();
        const currentvillage = computed(() => store.getters.getCurrentVillage);
        const currentuniquevillagecode = computed(() => store.getters.getCurrentUniqueVillageCode);
        const showFileUploader = ref(false);
        const filedetails = ref('');
        const uploadbtndisabled = ref(false);

        const roles = computed(() => store.getters.getUserRoles);

        const getApproveRole = computed(() => {
            return (fileApproved: any) => {
                console.log(fileApproved);
                if(fileApproved == false){
                    if(roles.value.includes('KGDC_APPROVER') || roles.value.includes('STATE_APPROVER')){
                        return '<button class="olbtns">Approve</button>'
                    } else {
                        return '<span style="color:red;">Not Approved</span>'
                    }
                } else {
                    return '<span style="color:green;">Approved</span>';
                }
            }
        });

        const mimetype = ref('');

        const rolecalculated = computed(() => {
            if(roles.value.includes('KGDC_APPROVER')){
                return 'KGDC_APPROVER';
            } else if (roles.value.includes('KGDC_UPLOADER')) {
                return 'KGDC_UPLOADER';
            } else if (roles.value.includes('STATE_APPROVED')) {
                return 'STATE_APPROVED';
            } else if (roles.value.includes('STATE_UPLOADER')) {
                return 'STATE_UPLOADER';
            }
        });

        const calluploadfile = () => {
            if (currentvillage.value == '' || currentuniquevillagecode.value == ''){
                showGlobalToast('Load Villages and Click on One...');
                return 0;
            }

            let file = fileEl.value.files[0];

            if (file == undefined){
                showGlobalToast('Select a File');
                return 0;
            } else {
                let fileFullname = file.name;
                let lastDot = fileFullname.lastIndexOf('.');
                let extension = fileFullname.substring(lastDot + 1);

                if(extension == 'pdf'){
                    mimetype.value = 'application/pdf';
                } else if (extension == 'zip'){
                    mimetype.value = 'application/zip';
                } else {
                    fileEl.value.value = '';
                    showGlobalToast('Only PDF / Zip Files are Supported');
                    return 0;
                }
            }

            if (filedetails.value == ''){
                showGlobalToast('Enter Some Description');
                return 0;
            }

            uploadbtndisabled.value = true;
            showGlobalToast('Uploading file... Please Wait...');

            const uploadedby = store.getters.getUsername;

            uploadfile(file, currentvillage.value, filedetails.value, currentuniquevillagecode.value, mimetype.value, rolecalculated.value, uploadedby)
            .then(() => {
                uploadbtndisabled.value = false;
                showFileUploader.value = false;
                filedetails.value = '';
                fileEl.value.value = '';
                showGlobalToast('Uploaded File...');
                callgetfilelist();
            })
            .catch(() => {
                uploadbtndisabled.value = false;
                showGlobalToast('Error Uploading...');
            })
            
        }

        const filelist = ref();

        const callgetfilelist = () => {
            let village = currentvillage.value;
            if (village == ''){
                showGlobalToast('Load Villages and Click on One...');
                return 0;
            }

            getfilelist(village, currentuniquevillagecode.value)
            .then((res) => {
                console.log(res);
                filelist.value = res;
            })
            .catch(() => {
                showGlobalToast('Error Fetching Files...');
            })
        }

        const toShowFile = computed(() => {
            return (approved: any, uploaderrole: any) => {
                if(approved){
                    return true;
                } else {
                    let cond1 = uploaderrole == 'KGDC_UPLOADER' || uploaderrole == 'KGDC_APPROVER';
                    let cond2 = roles.value.includes('KGDC_UPLOADER') || roles.value.includes('KGDC_APPROVER');
                    console.log(cond1, cond2);

                    if (cond1 && cond2) return true;

                    let cond3 = uploaderrole == 'STATE_UPLOADER' || uploaderrole ==  'STATE_APPROVER';
                    let cond4 = roles.value.includes('STATE_UPLOADER') || roles.value.includes('STATE_APPROVER');

                    if (cond3 && cond4) return true;

                    return false;
                }
            }
        });

        const callapproveFile = (e: any) => {
            let fileid = e.target.parentNode.getAttribute('fileid');

            approvefile(fileid)
            .then(() => {
                callgetfilelist();
            })
            .catch(() => {
                showGlobalToast('Error Approving...');
            });
        }

        const return2 = {
            fileEl, currentvillage, showFileUploader, filedetails, 
            uploadbtndisabled, getApproveRole, 
            calluploadfile, filelist, callgetfilelist, toShowFile, callapproveFile
        };

        return { ...return0, ...return1, ...return2 }
    },
})
</script>
