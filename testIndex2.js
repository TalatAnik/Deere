const jsonfile = require('jsonfile')
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn



const prodLinks = 'generated_links/links.json'

// const outputFileA = "output/output_testA_01.json"
const outputFileB = "output/output_testB_01.json"
// const outputFileC = "output/output_mainC_01.json"
// const outputFileD = "output/output_mainD_01.json"

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
      path.resolve(__dirname, 'testProdDetails.js'),
      `--input-data${b64Data}`,
      '--tagprocess'
    ], { shell: false })

    proc.stdout.on('data', (data) => {
      stdoutData += data
      // console.log(data)
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


async function run2() {
  
  const links = jsonfile.readFileSync(prodLinks)

  for (var i=1600; i<1700; i+=4)
  {
    if(i%96==0)
    {
      console.log("************* time to wait 2 minutes ************")
      await wait(1.5*60*1000)
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


async function parallel(arg1, arg2) {
  await Promise.allSettled(
    [
      runPupeteer(arg1),
      runPupeteer(arg2)
    ]
  )
}

async function run1() {

  const links = jsonfile.readFileSync(prodLinks)

  for (var i=0; i<50; i+=2)
  {
    let date_ob = new Date()
    let hours = date_ob.getHours()
    let minutes = date_ob.getMinutes()
    let seconds = date_ob.getSeconds()
    console.log('🎉 ' + hours + ':'+ minutes+':'+ seconds +'============== product no: '+ i +" & "+ (i+1) + ' =========')

    // await runPupeteer(
    //   {
    //     url: links[i].url
    //   }
    // )
    
    let argOne = {url: links[i].url, outputFile: outputFileA}
    let argTwo = {url: links[i+1].url, outputFile: outputFileB}

    await parallel(argOne, argTwo)
    
     
  }

}

async function run() {

  const links = jsonfile.readFileSync(prodLinks)

  for (var i=1600; i<1650; i++)
  {
    let date_ob = new Date()
    let hours = date_ob.getHours()
    let minutes = date_ob.getMinutes()
    let seconds = date_ob.getSeconds()
    console.log('🎉 ' + hours + ':'+ minutes+':'+ seconds +'============== product no: '+ i +' in index 2 =========')

    await runPupeteer(
      {
        url: links[i].url,
        outputFile: outputFileB,
        cache: "./data2"
      }
    )
    
    
    
     
  }

}

run()