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


const featCatsFile = "generated_links/featuredLinks.json"



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
  const proxyList = new ProxyList()

  let proxies
  try {
    proxy = await proxyList.randomByProtocol('https')
  } catch (error) {
    throw new Error(error)
  }
  
  
  // console.log(`host: ${proxy.ip} port: ${proxy.port}`)
  
  // await puppeteer.use(pluginProxy({
  //   address: `89.163.152.206`,
  //   port: 8080
  // }))

  
  const browser = await puppeteer.launch({
    executablePath: 'C:/Users/Anik/.cache/puppeteer/chrome/win64-1045629/chrome-win/chrome.exe',
    headless: false,
    stealth: true,
    defaultViewport: {
      width:700,
      height:768
    }    
  })

  const page = await browser.newPage()

  
  await page.goto(
    url,
    { waitUntil: "networkidle2" }
  )
  await wait(5000)

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
      await wait(30000)
    } catch (error) {
      

      console.log(error)
    }
    
  }
  
}

main('https://shop.deere.com/jdb2cstorefront/JohnDeereStore/en/Sensors/Pressure-Sensors/c/PressureSensors/')