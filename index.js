const jsonfile = require('jsonfile')
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn



const prodLinks = 'generated_links/links.json'

//wait if needed
async function wait(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}

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
      stdoutData += data
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
  
  const links = jsonfile.readFileSync(prodLinks)

  for (var i=336; i<1500; i+=4)
  {
    if(i%200==0)
    {
      console.log("************* time to wait 2 minutes ************")
      await wait(2*60*1000)
    }
      
    let date_ob = new Date()
    let hours = date_ob.getHours()
    let minutes = date_ob.getMinutes()
    let seconds = date_ob.getSeconds()

    console.log('🎉 ' + hours + ':'+ minutes+':'+ seconds +'================== product no: '+ i + ' and '+ (i+1) + ' and '+ (i+2) + ' and '+ (i+3) +'==================')
    await runPupeteer({
      url1: links[i].url,
      url2: links[i+1].url,
      url3: links[i+2].url,
      url4: links[i+3].url
    })
  }
  
}

run()