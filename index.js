const puppeteer = require('puppeteer')
const fs = require('fs')


async function main (url) {
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--window-size=1366,768`],
    defaultViewport: {
      width:1366,
      height:768
    }    
  })

  context = browser.defaultBrowserContext()
  const page = await browser.newPage()

  await page.goto(
    url,
    { waitUntil: "networkidle2" }
  )
  
  

  /***READING AND STORING <<SKU>> HERE***/

  const sku = await page.$eval(
    'div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-lg-7.css-12ybf7 > p',
    el => el.innerText.split(': ')[1]
  )
  console.log(sku)
  
  
  
  /***READING AND STORING <<SKU>> AND <<NAME>> HERE***/
  
  let crumbsText = ''  
  const breadcrumbs = await page.$$eval(
    '.breadcrumb li',
    (el) => {
      return el.map(option => option.innerText)
    }
  )

  for(var i=0;i<breadcrumbs.length-1; i++)
  {
    if(i==breadcrumbs.length-1)
      crumbsText += breadcrumbs[i]

    crumbsText += breadcrumbs[i] + ">"
  }
  console.log(crumbsText)

  let name = breadcrumbs[breadcrumbs.length-1].split(': ')[1]
  console.log(name)


}

//wait if needed
async function wait(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}


main('https://shop.deere.com/jdb2cstorefront/JohnDeereStore/en/product/TY25221A-PL%3A-STRONGBOX%E2%84%A2-ORIGINAL-EQUIPMENT%2C-12-Volt%2C-WET-BATTERY/p/TY25221A-PL')