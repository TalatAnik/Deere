const puppeteer = require('puppeteer-extra')
const pluginProxy = require('puppeteer-extra-plugin-proxy')
const jsonfile = require('jsonfile')

const ProxyList = require('free-proxy')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))


const blockResourcesPlugin = require('puppeteer-extra-plugin-block-resources')()
puppeteer.use(blockResourcesPlugin)
    

const featCatsFile = "generated_links/featuredLinks.json"

const cache = {}

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
    userDataDir: './data',
    headless: false,
    stealth: true,
    args:[
      "--proxy-server=127.0.0.1:24000"
    ],
    defaultViewport: {
      width:700,
      height:768
    }    
  })

  const page = await browser.newPage()
  blockResourcesPlugin.blockedTypes.delete('other')
  blockResourcesPlugin.blockedTypes.add('image')


  await page.authenticate({
    username: 'brd-customer-hl_55cbe8a8-zone-isp',
    password: 'zm76rukrik0k'
  })


  await page.goto(
    url,
    { waitUntil: "networkidle2" }
  )
  

  await page.waitForSelector('#root > main > section > section > div.MuiBox-root.css-19nojhs > div.MuiBox-root.css-7eskqt > h1')
  
  const prodCountText = await page.$eval(
    '#root > main > section > section > div.MuiBox-root.css-19nojhs > div.MuiBox-root.css-7eskqt > h1',
    el => el.innerText
  )
  let prodCount = prodCountText.split(" ")[0]
  prodCount = parseInt(prodCount)

  
  console.error(prodCount)
  await browser.close()
}



async function run() {
  
  const links = jsonfile.readFileSync(featCatsFile)

  for (var i=0; i<links.length; i++)
  {
    try {
      
      await main({
        url: links[i].url
      })
      
    } catch (error) {
      

      console.log(error)
    }
    
  }
  
}

main('https://shop.deere.com/jdb2cstorefront/JohnDeereStore/en/Residue-Management-Parts/Straw-Chopper-Parts/c/StrawChopperParts/')