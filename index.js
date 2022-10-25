const puppeteer = require('puppeteer-extra')

const fs = require('fs')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))



async function main (url) {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    headless: false,
    args: [`--window-size=1366,768`],
    defaultViewport: {
      width:1366,
      height:768
    }    
  })


  const page = await browser.newPage()

  await page.goto(
    url,
    { waitUntil: "networkidle2" }
  )
  
  

  /***READING AND STORING <<SKU>> HERE***/

  const sku = await page.$eval(
    'div.css-12ybf7 > p',
    el => el.innerText.split(': ')[1]
  )
  console.log(sku)
  
  
  
  /***READING AND STORING <<Breadcrumbs>> HERE***/
  
  let crumbsText = ''  
  const breadcrumbs = await page.$$eval(
    '.breadcrumb li',
    (el) => {
      return el.map(option => option.innerText)
    }
  )

  for(var i=0;i<breadcrumbs.length-1; i++)
  {
    if(i==breadcrumbs.length-2)
    {  
      crumbsText += breadcrumbs[i]
    }
    else
      crumbsText += breadcrumbs[i] + " >"
  }
  console.log(crumbsText)

  let name = breadcrumbs[breadcrumbs.length-1].split(': ')[1]
  console.log(name)

  /***READING AND STORING <<IMAGE URL>> HERE***/
  const images = await page.$$eval(
    'li.thumb > img',
    (els) => {
      return els.map(el => el.src)
    }
  )
  
  /***READING AND STORING <<Product Dimensions>> HERE***/
  //.MuiGrid-spacing-xs-10.css-1j4kxi8 > div > div

  const dimensions = await page.$$eval(
    '.MuiGrid-spacing-xs-10.css-1j4kxi8 > div > div',
    (array) => {
      return array.map(el => el.innerText)
    }
  )
  
  let length = 'null'
  let width = 'null'
  let height = 'null'
  let weight='null'
  for(let i=0;i<dimensions.length;i++) 
  {
    let str = dimensions[i]
    if(str.substring(0,6) == "Weight")
      weight = str.split("\n")[1]
    console.log(weight)
    break
  }
}

//wait if needed
async function wait(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}


main('https://shop.deere.com/jdb2cstorefront/JohnDeereStore/en/product/GY20629%3A-Idler-For-100%2C-D100%2C-G100%2C-L100%2C-La100-And-Z200-Series/p/GY20629')