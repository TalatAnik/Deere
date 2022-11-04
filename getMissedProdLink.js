const puppeteer = require('puppeteer-extra')
const fs = require('fs')
const jsonfile = require('jsonfile')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))


const blockResourcesPlugin = require('puppeteer-extra-plugin-block-resources')()
puppeteer.use(blockResourcesPlugin)
    

// const inpDataB64 = process.argv.find((a) => a.startsWith('--input-data')).replace('--input-data', '')
// const inputData = JSON.parse(Buffer.from(inpDataB64, 'base64').toString())

const fileOut = "generated_links/prev_missed_prodLinks.json"
const fileCount = "generated_links/prev_missed_count.txt"
const fileMissed = "generated_links/prev_missed_links.json"


//wait if needed
async function wait(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}


async function scrollDown(page) {
  await page.$eval(
    'button.MuiPaginationItem-previousNext',
    e => {
      e.scrollIntoView({ behavior: 'smooth' })
    }
  )
}



async function main (url)
{


  const browser = await puppeteer.launch({
    executablePath: 'C:/Users/Anik/.cache/puppeteer/chrome/win64-1045629/chrome-win/chrome.exe',
    headless: false,
    userDataDir: './data',
    stealth: true,
    args:[
      "--proxy-server=127.0.0.1:24000"
    ],
    defaultViewport: {
      width:600,
      height:768
    }    
  })

  // context = browser.defaultBrowserContext()
  const page = await browser.newPage()

  blockResourcesPlugin.blockedTypes.add('other')
  blockResourcesPlugin.blockedTypes.add('image')

  await page.authenticate({
    username: 'brd-customer-hl_55cbe8a8-zone-isp',
    password: 'zm76rukrik0k'
  })

  await page.goto(
    url,
    { waitUntil: "networkidle2" }
  )

  let missedPageNumber = 0
  try {
    const prodCountText = await page.$eval(
      '#root > main > section > section > div.MuiBox-root.css-19nojhs > div.MuiBox-root.css-7eskqt > h1',
      el => el.innerText
    )
    let prodCount = prodCountText.split(" ")[0]
    // prodCount = parseInt(prodCount)

    console.log(prodCount)
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
      await wait(500)
      
      const prodLinks = await page.$$eval(
        '.ProductCard__StyledProductDetails-bwrMVw > div > div  a',
        arrs => {
          return arrs.map(op => op.href)
        }
      )
  
      
      for (let k=0; k<prodLinks.length; k++)
      {
        prod = {
          url: prodLinks[k]
        }
        
        prodStr = JSON.stringify(prod,null,2)
        fs.appendFileSync(fileOut, prodStr)
        fs.appendFileSync(fileOut, ',\n  ')
  
      }
      
      
  
      if (clicks>0 && l<clicks)
      {
        const nextButton = await page.$$('ul > li:last-child >button.MuiPaginationItem-previousNext')
        //#root > main > section > section > nav > ul > li:nth-child(4) > button
        nextButton[nextButton.length-1].click()
        await wait(500)
        // await page.waitForNetworkIdle(
        //   {
        //     idleTime: 100 
        //   }
        // )
      }
      
      
    } 
  } catch (error) {
    missedUrl = {
      uri: url,
      page: missedPageNumber
    }
    urlStr = JSON.stringify(missedUrl, null, 2)
    fs.appendFileSync(fileMissed, urlStr)
    fs.appendFileSync(fileMissed, ',\n  ')
    console.log(error)
  }
  
  
  await browser.close()
}



// main(inputData.url)
main('https://shop.deere.com/jdb2cstorefront/JohnDeereStore/en/Batteries/Strong-Box-Original-Equipment/c/StrongBoxOriginalEquipment/')
