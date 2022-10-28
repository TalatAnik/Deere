const fs = require('fs')
let inputFile = 'proxies.txt'
let OutputFile = 'proxyList.json'

const proxyStrs = fs.readFileSync(inputFile, 'utf-8')

let proxyList = []
proxyStrs.split(/\r?\n/).forEach(
    line => {
    let ip = line.split(" ")[0]
    let port = line.split(" ")[1]
    
    let ipset = {
        url: ip + ":"+port
    }

    proxyList.push(ipset)
  }
)


pxLst = JSON.stringify(proxyList, null, 2)
fs.writeFileSync(OutputFile, pxLst)