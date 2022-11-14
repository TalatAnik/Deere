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
      path.resolve(__dirname, 'getProdLink_ST.js'),
      `--input-data${b64Data}`,
      '--tagprocess'
    ], { shell: false })

    proc.stdout.on('data', (data) => {
      stdoutData += data
      console.log("message: ", Buffer.from(data).toString('base64'))
    })

    proc.stderr.on('data', (data) => {
      console.error(`NodeERR: ${data}`)
      proc.kill()
      resolve(stdoutData)
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

  for (var i=3; i<links.length; i++)
  {

    let date_ob = new Date()
    let hours = date_ob.getHours()
    let minutes = date_ob.getMinutes()
    let seconds = date_ob.getSeconds()

    console.log('🎉 ' + hours + ':'+ minutes+':'+ seconds +'====== featured category no: '+ i +' ===========')
    
    arg1 = {
      url: links[i].url,
      cache: "./browserCache1"
    }

    

    await runPupeteer(arg1)
    
    
  }
  
}

run()