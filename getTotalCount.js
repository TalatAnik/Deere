const fs = require('fs')

let fileIn = "generated_links/count2.json"

let fileText = fs.readFileSync(fileIn,"utf8")

countArray = JSON.parse(fileText)



let TotalCount = 0

for(let i=0; i< countArray.length; i++)
  TotalCount += countArray[i].count

  console.log(TotalCount)