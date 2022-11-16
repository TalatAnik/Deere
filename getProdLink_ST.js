const puppeteer = require('puppeteer-extra')
const fs = require('fs')
const jsonfile = require('jsonfile')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))


const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
puppeteer.use(require('puppeteer-extra-plugin-block-resources')({
  blockedTypes: new Set(['image', 'media','other', 'font','websocket']),
  // Optionally enable Cooperative Mode for several request interceptors
  interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
}))

const inpDataB64 = process.argv.find((a) => a.startsWith('--input-data')).replace('--input-data', '')
const inputData = JSON.parse(Buffer.from(inpDataB64, 'base64').toString())

const outputFileA = "generated_links_FINAL/links_MISSED_RESCRAPED.json"
// const outputFileA = "generated_links_FINAL/links_01.json"
// const outputFileB = "generated_links_FINAL/links_02.json"
// const outputFileC = "generated_links_FINAL/links_03.json"
// const outputFileD = "generated_links_FINAL/links_04.json"
// const fileCount = "generated_links_FINAL/count.txt"
const fileCount = "generated_links_FINAL/count_new.txt"
const fileMissed = "generated_links_FINAL/missed_links_FINAL.json"


//wait if needed
async function wait(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}


async function scrollDown(page) {
  await page.$eval(
    'footer',
    e => {
      e.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  )
}



async function main (urlArg, myCache, outputFile)
{


  const browser = await puppeteer.launch({
    executablePath: 'C:/Users/Anik/.cache/puppeteer/chrome/win64-1045629/chrome-win/chrome.exe',
    headless: true,
    userDataDir: myCache,
    stealth: true,
    args:[
      "--proxy-server=127.0.0.1:24000"
    ],
    defaultViewport: {
      width:700,
      height:768
    }    
  })

  // context = browser.defaultBrowserContext()
  const page = await browser.newPage()

  await page.authenticate({
    username: 'brd-customer-hl_55cbe8a8-zone-zone1',
    password: 'zrmm196jg4om'
  })

  await page.goto(
    urlArg,
    { waitUntil: "networkidle2" }
  )


  await wait(500)


  let missedPageNumber = 0
  try {
    const prodCountText = await page.$eval(
      '#root > main > section > section h1',
      el => el.innerText
    )
    let prodCount = prodCountText.split(" ")[0]
    // prodCount = parseInt(prodCount)

    // console.error(prodCount)
    pCount ={
      count: parseInt(prodCount) 
    }
    pCountString = JSON.stringify(pCount,null,2)
    fs.appendFileSync(fileCount, pCountString)
    fs.appendFileSync(fileCount, ',\n')

    let clicks = 0
    if((prodCount%24) !== 0)
      clicks = Math.floor(prodCount/24)
    else
      clicks = prodCount/24
  
    for(let l=0; l<=clicks; l++)
    {
      missedPageNumber = l

      await scrollDown(page)
      await wait(1000)
      
      const prodLinks = await page.$$eval(
        '.ProductCard__StyledProductDetails-bwrMVw > div > div  a',
        arrs => {
          return arrs.map(op => op.href)
        }
      )
  
      let strToWrite = ""
      
      for (let k=0; k<prodLinks.length; k++)
      {
        prod = {
          url: prodLinks[k]
        }
        
        prodStr = JSON.stringify(prod,null,2)
        prodStr += ',\n'
        
        strToWrite += prodStr
      }
      
      fs.appendFileSync(outputFile, strToWrite)
  
      if (clicks>0 && l<clicks)
      {
        const nextButton = await page.$$('ul > li:last-child >button.MuiPaginationItem-previousNext')
        //#root > main > section > section > nav > ul > li:nth-child(4) > button
        nextButton[nextButton.length-1].click()
        await wait(1000)
        // await page.waitForNetworkIdle(
        //   {
        //     idleTime: 100 
        //   }
        // )
      }
      
      
    } 
  } catch (error) {
    missedUrl = {
      uri: urlArg,
      page: missedPageNumber
    }
    urlStr = JSON.stringify(missedUrl, null, 2)
    fs.appendFileSync(fileMissed, urlStr)
    fs.appendFileSync(fileMissed, ',\n  ')
    console.error(error)
  }
  
  
  await browser.close()
}

async function runner(url, bCache, outFile)
{
  main(url, bCache, outFile)
}

async function parallel(data1, data2, data3, data4) {
  Promise.allSettled(
    [
      runner(data1.url, data1.cache, outputFileA),
      runner(data2.url, data2.cache, outputFileB),
      runner(data3.url, data3.cache, outputFileC),
      runner(data4.url, data4.cache, outputFileD)
    ]
  )
}

main(inputData.url, inputData.cache, outputFileA)

// void parallel(inputData[0], inputData[1], inputData[2], inputData[3])