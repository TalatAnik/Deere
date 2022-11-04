const puppeteer = require('puppeteer-extra')
const fs = require('fs')
const jsonfile = require('jsonfile')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))



const inpDataB64 = process.argv.find((a) => a.startsWith('--input-data')).replace('--input-data', '')
const inputData = JSON.parse(Buffer.from(inpDataB64, 'base64').toString())

const fileOut = "generated_links/links2.json"
const fileCount = "generated_links/count2.txt"
const fileMissed = "generated_links/missed_links2.json"


//wait if needed
async function wait(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}


async function scrollDown(page) {
  await page.$eval(
    '#jumptopriv > li:nth-child(1) > a',
    e => {
      e.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' })
    }
  )
}



async function main (url)
{


  const browser = await puppeteer.launch({
    executablePath: 'C:/Users/Anik/.cache/puppeteer/chrome/win64-1045629/chrome-win/chrome.exe',
    headless: true,
    ignoreHTTPSErrors: true,
    args: 
    [
      `--window-size=1366,768`
    ],
    defaultViewport: {
      width:700,
      height:768
    }    
  })

  context = browser.defaultBrowserContext()
  const page = await browser.newPage()

  await page.goto(
    url,
    { waitUntil: "networkidle2" }
  )

  try {
    const prodCountText = await page.$eval(
      '#root > main > section > section > div.MuiBox-root.css-19nojhs > div.MuiBox-root.css-7eskqt > h1',
      el => el.innerText
    )
    let prodCount = prodCountText.split(" ")[0]
    // prodCount = parseInt(prodCount)

    console.error(prodCount)
    fs.appendFileSync(fileCount, prodCount)
    fs.appendFileSync(fileCount, '\n')

    let clicks = Math.floor(prodCount/24)

  
    for(let l=0; l<=clicks; l++)
    {

  
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
      
      
  
      if (clicks>0 || l<clicks)
      {
        const nextButton = await page.$('#root > main > section > section > nav > ul > li:last-child > button')
  
        nextButton.click()
        await page.waitForNetworkIdle(
          {
            idleTime: 100 
          }
        )
      }
      
      
    } 
  } catch (error) {
    missedUrl = {
      uri: url
    }
    urlStr = JSON.stringify(missedUrl, null, 2)
    fs.appendFileSync(fileMissed, urlStr)
    fs.appendFileSync(fileMissed, ',\n  ')
    console.log(error)
  }
  
  
  await browser.close()
}



main(inputData.url)
