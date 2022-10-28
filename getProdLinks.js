const puppeteer = require('puppeteer-extra')
const fs = require('fs')
const jsonfile = require('jsonfile')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

const featCatsFile = "generated_links/featuredLinks.json"
const proxyListFile = "proxyList.json"

const fileOut = "generated_links/links.json"

let featCatsLinks = jsonfile.readFileSync(featCatsFile)
let proxyList = jsonfile.readFileSync(proxyListFile)

function randomIntFromInterval() { // min and max included 
    return Math.floor(Math.random() * (99))
}

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

// const rndInt = randomIntFromInterval()
// console.log(rndInt)

async function main (url)
{
  let rndInt = randomIntFromInterval()
  let ipAddress = proxyList[rndInt].url

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

  const prodCountText = await page.$eval(
    '#root > main > section > section > div.MuiBox-root.css-19nojhs > div.MuiBox-root.css-7eskqt > h1',
    el => el.innerText
  )
  let prodCount = prodCountText.split(" ")[0]
  prodCount = parseInt(prodCount)

  console.log(prodCount)

  let clicks = Math.floor(prodCount/24)

  let allLinks =[]

  for(let l=0; l<=clicks; l++)
  {
    await wait(1000)

    await scrollDown(page)
    await wait(1000)
    
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
    
    allLinks = allLinks.concat(prodLinks)

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
    console.log(allLinks.length)
    
  }
  await browser.close()
}



for(let a=0;a<featCatsLinks.length;a++)
{
  main(featCatsLinks[a].url)
}
