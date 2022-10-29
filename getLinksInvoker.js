const jsonfile = require('jsonfile')
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn



const featCatsFile = 'generated_links/featuredLinks.json'
const missFile = 'generated_links/missedLinks.json'


async function runPupeteer(data) {
  
  const jsonData = JSON.stringify(data)
  const b64Data = Buffer.from(jsonData).toString('base64')
  let stdoutData = ''

  return await new Promise((resolve) => {
    const proc = spawn('node', [
      path.resolve(__dirname, 'getProdLinks.js'),
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
  
  const links = jsonfile.readFileSync(featCatsFile)

  for (var i=0; i<links.length; i++)
  {
    try {
      await runPupeteer({
        url: links[i].url
      })
    } catch (error) {
      

      
      missedLink = JSON.stringify(links[i],null,2)
      fs.appendFileSync(missFile, missedLink)
      fs.appendFileSync(missFile, ',\n  ')
      console.log(error)
    }
    
  }
  
}

run()