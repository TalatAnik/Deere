const jsonfile = require('jsonfile')
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn



const prodLinks = 'generated_links/links.json'
const prodMissFile = 'output/missed/missedProds_sample.json'


async function runPupeteer(data) {
  
  const jsonData = JSON.stringify(data)
  const b64Data = Buffer.from(jsonData).toString('base64')

  
  let stdoutData = ''

  return await new Promise((resolve) => {
    const proc = spawn('node', [
      path.resolve(__dirname, 'getProdDetails.js'),
      `--input-data${b64Data}`,
      '--tagprocess'
    ], { shell: false })

    proc.stdout.on('data', (data) => {
      stdoutData += data;
    })

    proc.stderr.on('data', (data) => {
      console.error(`NodeERR: ${data}`)
    })

    proc.on('close', async (code) => {
    })

    proc.on('exit', function () {
      proc.kill()
      resolve(stdoutData)
    })

  })

}


async function run() {
  
  const links = jsonfile.readFileSync(prodLinks)

  for (var i=0; i<50; i++)
  {
    try {
      await runPupeteer({
        url: links[i].url
      })
    } catch (error) {
      

      
      missedLink = JSON.stringify(links[i],null,2)
      fs.appendFileSync(prodMissFile, missedLink)
      fs.appendFileSync(prodMissFile, ',\n  ')
      console.log(error)
    }
    
  }
  
}

run()