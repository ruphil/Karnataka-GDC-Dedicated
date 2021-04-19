<template>
    <div>
        <div>Current Source Folder: <br/> {{ data.sourcefolder }}</div><br/>
        <div>Excel File: <br/> {{ data.excelpath }}</div><br/>
        <div>Target Folder: <br/> {{ data.targetfolder }}</div><br/>
        <hr/>
        <div>Current Folder: <br/> {{ stats.currentdirno }} of {{ stats.totalfolders }}</div><br/>
        <div>Working Status: {{ data.working }}</div>
    </div>
</template>

<script>
export default {
    props: ['data', 'stats']
}
</script>