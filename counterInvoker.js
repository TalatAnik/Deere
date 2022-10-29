const jsonfile = require('jsonfile')
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn



const featCatsFile = 'generated_links/featuredLinks.json'
const missFile = 'generated_links/countMissed.json'
const countFile = 'generated_links/count.txt'

let count = 0

async function runPupeteer(data) {
  
  const jsonData = JSON.stringify(data)
  const b64Data = Buffer.from(jsonData).toString('base64')
  let stdoutData = ''
  
  return await new Promise((resolve) => {
    const proc = spawn('node', [
      path.resolve(__dirname, 'productCount.js'),
      `--input-data${b64Data}`,
      '--tagprocess'
    ], { shell: false })

    proc.stdout.on('data', (data) => {
      stdoutData += data;
    })

    proc.stderr.on('data', (data) => {
      count = parseInt(data)
      fs.appendFileSync(countFile, count.toString())
      fs.appendFileSync(countFile, '\n')
      console.error(`NodeERR: ${count}`)
    })

    proc.on('close', async (code) => {
    })

    proc.on('exit', function () {
      proc.kill()
      resolve(stdoutData)
    })

  })

}

async function wait(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}

async function run() {
  
  const links = jsonfile.readFileSync(featCatsFile)

  for (var i=0; i<links.length; i++)
  {
    try {
      await wait(1000)
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