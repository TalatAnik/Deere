const jsonfile = require('jsonfile')
let xlsx = require("json-as-xlsx")

let file1 = "output_FINAL/FINAL.json"

let xlFile = "deereShope_final"



let content1 = jsonfile.readFileSync(file1)

let data = [
    {
        sheet:"products",
        columns: [
            {label: "url", value: "url"},
            {label: "sku", value: "sku"},
            {label: "name", value: "name"},
            {label: "breadcrumbs", value: "breadcrumbs"},
            {label: "urimage_urlsl", value: "image_urls"},
            {label: "length", value: "length"},
            {label: "width", value: "width"},
            {label: "height", value: "height"},
            {label: "weight", value: "weight"},
            {label: "also_fits_on", value: "also_fits_on"},
        ],
        content: content1
    }
]

let settings = {
    filename: xlFile,
    writeMode: 'writeFile',
}

xlsx(data, settings)