const fs = require('fs')
let xlsx = require("json-as-xlsx")

let file1 = "output_FINAL/output_mainA_01.json"
let file2 = "output_FINAL/output_mainB_01.json"
let file3 = "output_FINAL/output_mainC_01.json"
let file4 = "output_FINAL/output_mainD_01.json"
let concatedFile = "output_FINAL/results/conc_main.json"

let a = fs.readFileSync(file1, 'utf8', err => console.error(err))
let b = fs.readFileSync(file2, 'utf8', err => console.error(err))
let c = fs.readFileSync(file3, 'utf8', err => console.error(err))
let d = fs.readFileSync(file4, 'utf8', err => console.error(err))

z = '[' + a +  b + c + d + ']'

console.log(z)

// let dataA = JSON.parse(z)
// let FinalData = [
//   {
//     sheet:"first",
//     columns: [
//       { label: "url", value: "url" }, // Top level data
//       {label: "sku", value: "sku"},
//       {label: "name", value: "name"},
//       {label: "breadcrumbs", value: "breadcrumbs"},
//       {label: "image_urls", value: "image_urls"},
//       {label: "length", value: "length"},
//       {label: "width", value: "width"},
//       {label: "height", value: "height"},
//       {label: "weight", value: "weight"},
//       {label: "also_fits_on", value: "also_fits_on"},
//     ],

//     content: dataA
//   }
// ]

// let settings = {
//   fileName: "MySpreadsheet",
//   extraLength: 3,
//   writeMode: 'writeFile',
// }

// xlsx(FinalData, settings)