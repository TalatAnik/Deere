const puppeteer = require('puppeteer-extra')
const pluginProxy = require('puppeteer-extra-plugin-proxy')
const getProxies = require('get-free-https-proxy')


// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))


const countOutFile = "generated_links/count.txt"


const inpDataB64 = process.argv.find((a) => a.startsWith('--input-data')).replace('--input-data', '')
const inputData = JSON.parse(Buffer.from(inpDataB64, 'base64').toString())

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
    // const [proxy] = await getProxies()
 
    // console.log(`host: ${proxy.host} port: ${proxy.port}`)
    
    // puppeteer.use(pluginProxy({
    //     address: `${proxy.host}`,
    //     port: proxy.port
    // }))

  const browser = await puppeteer.launch({
    executablePath: 'C:/Users/Anik/.cache/puppeteer/chrome/win64-1045629/chrome-win/chrome.exe',
    headless: false,
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

  await wait(500)
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

  
  console.error(prodCount)
  await browser.close()
}


try {
    main(inputData.url)
} catch (error) {
   console.log(error) 
}

