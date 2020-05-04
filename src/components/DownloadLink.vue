<template>
<v-icon>download</v-icon>
</template>
<script>
import XLSX from 'xlsx'
import { mdiDownload } from '@mdi/js';
export default {
    name: "download-link",
    props: {
    dataParent:{
    },
    parentName:{
    }
    },
    methods: {

        onExport() {
            // export json to Worksheet of Excel
            // only array possible
            var WS = XLSX.utils.json_to_sheet(this.dataParent)


            // A workbook is the name given to an Excel file
            var wb = XLSX.utils.book_new() // make Workbook of Excel

            // add Worksheet to Workbook
            // Workbook contains one or more worksheets
            XLSX.utils.book_append_sheet(wb, WS, this.parentName) // sheetAName is name of Worksheet

            // export Excel file
            XLSX.writeFile(wb, this.parentName+'.xlsx') // name of the file is parent component'.xlsx'
        },
    },
computed: {

    },
    created: function() {

    }
};
</script>
<style>
</style>
