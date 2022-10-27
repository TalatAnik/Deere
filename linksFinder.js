const puppeteer = require('puppeteer-extra')

const fs = require('fs')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

const fileOut = 'generated_links/links.json'


async function main (url) {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Users/Anik/.cache/puppeteer/chrome/win64-1045629/chrome-win/chrome.exe',
    headless: false,
    args: [`--window-size=1366,768`],
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

  // const partsButton = await page.$(
  //   'body > main > header > nav.navigation.navigation--bottom.js_navigation--bottom.js-enquire-offcanvas-navigation > div > ul.nav__links.nav__links--products.js-offcanvas-links.hidden-xs.hidden-sm > li:nth-child(2) > span.yCmsComponent.nav__link.js_nav__link > a'  
  // )

  // partsButton.hover()

  await wait(1000)

  const cat1 = await page.$$eval(
    '#collapseMaintenanceWearNavNodeMenu > div > h4 > li > a',
    (array) => {
      return array.map(el => el.href)
    }    
  )

  const cat2 = await page.$$eval(
    '#collapseRepairNavNodeMenu > div > h4 > li > a',
    (array) => {
      return array.map(el => el.href)
    }    
  )

  const cats = cat1.concat(cat2)
  let allLinks =[]

  for(let i=0;i<cats.length;i++)
  {
    await page.goto(
      cats[i],
      { waitUntil: "networkidle2" }
    )

    const subcats = await page.$$eval(
      'body > main > div.yCmsContentSlot.row.category-container > div:nth-child(1) > div > div > div > h2 > a',
      arr => {
        return arr.map(el => el.href)
      }
    )

    for(let j=0; j<subcats.length; j++)
    {
      await page.goto(
        subcats[j],
        {waitUntil: "networkidle2"}
      )

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

    }

  }




}


//wait if needed
async function wait(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}


main("https://shop.deere.com/jdb2cstorefront/JohnDeereStore/en/")