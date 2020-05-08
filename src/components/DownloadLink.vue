<template>
<v-icon download>download</v-icon>
</template>
<script>
import XLSX from 'xlsx'
import {
    mdiDownload
} from '@mdi/js';
export default {
    name: "download-link",
        methods: {
                onExport(table,name) {

                    // export v-data-table to Worksheet of Excel
                    var WS = XLSX.utils.table_to_sheet(table);

                    // A workbook is the name given to an Excel file
                    var wb = XLSX.utils.book_new() // make Workbook of Excel

                    // add Worksheet to Workbook
                    // Workbook contains one or more worksheets
                    XLSX.utils.book_append_sheet(wb, WS, name) // sheetAName is name of Worksheet

                    // export Excel file
                    XLSX.writeFile(wb, name + '.xlsx') // name of the file is parent component'.xlsx'

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
