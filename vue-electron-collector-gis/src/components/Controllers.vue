<template>
    <div>
        <button v-on:click="selectXLFile" v-bind:disabled="isWorking">Select XL File</button><br/><br/>
        
        <button v-on:click="selectTargetFolder" v-bind:disabled="isWorking">Select Target Folder</button><br/><br/>
        
        <button v-on:click="startSearching" v-bind:disabled="pathsValid">Start Searching</button><br/><br/>

        <button v-on:click="closeApp">Exit</button>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron');

export default {
    props: ['data'],
    methods: {
        startSearching(){
            console.log('Starting...');
            this.$emit('startSearching');
        },

        selectTargetFolder(){
            ipcRenderer.send('open-folder', ['Select Target Folder', 'targetfolder']);
        },

        selectXLFile(){
            ipcRenderer.send('select-xlfile', ['Select Flight IDs Excel File']);
        },

        closeApp(){
            console.log('Sending Signal For Exit...');
            ipcRenderer.send('close-app');
        }
    },

    computed: {
        pathsValid() {
            let cond1 = this.data.sourcefolders.length <= 0;
            let cond2 = cond1 || this.data.targetfolder == 'Target://folder';
            let cond3 = cond2 || this.data.excelpath == 'Path://excel';
            let cond4 = cond3 || this.data.working;
            return cond4;
        },

        isWorking(){
            return this.data.working;
        },
    },

    created: function() {
        ipcRenderer.on('targetfolder', (event, arg) => {
            this.$emit('setPaths', ['targetfolder', arg]);
        });

        ipcRenderer.on('xlfile', (event, arg) => {
            if(arg.length > 0){
                this.$emit('setPaths', ['excelpath', arg]);
            } else {
                this.$emit('setPaths', ['excelpath', 'Select Excel File']);
            }
        });
  }
}
</script>

<style scoped>
    button {
        background-color: white;
        color: rgb(53, 11, 170);
        font-size: 3vw;
        padding: 2vw;
        border-radius: 2vw;
        border: 2px solid rgb(53, 11, 170);
        outline: none;
    }

    button:hover:not([disabled]) {
        background-color: rgb(53, 11, 170);
        color: white;
        cursor: pointer;
    }

    button:active:not([disabled]) {
        background-color: rgb(92, 10, 124);
        color: white;
    }

    button[disabled] {
        background-color: rgb(42, 27, 99);
        color: grey;
        font-size: 3vw;
        padding: 2vw;
        border-radius: 2vw;
        border: 2px solid rgb(53, 11, 170);
        outline: none;
        cursor: not-allowed;
    }
</style>