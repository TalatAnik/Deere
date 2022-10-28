const puppeteer = require('puppeteer-extra')

const fs = require('fs')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

const fileOut = 'generated_links/featuredLinks.json'


async function main (url) {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Users/Anik/.cache/puppeteer/chrome/win64-1045629/chrome-win/chrome.exe',
    headless: true,
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

  

  await wait(1000)

  const maintenance = await page.$$eval(
    '#collapseMaintenanceWearNavNodeMenu > div > h4 > li > a',
    (array) => {
      return array.map(el => el.href)
    }    
  )

  const repair = await page.$$eval(
    '#collapseRepairNavNodeMenu > div > h4 > li > a',
    (array) => {
      return array.map(el => el.href)
    }    
  )

  const parts = maintenance.concat(repair)
  

  for(let i=0;i<parts.length;i++)
  {
    await wait(1000)

    await page.goto(
      parts[i],
      { waitUntil: "networkidle2" }
    )

    const featuredCats = await page.$$eval(
      'body > main > div.yCmsContentSlot.row.category-container > div:nth-child(1) > div > div > div > h2 > a',
      arr => {
        return arr.map(el => el.href)
      }
    )

    for (let n=0; n< featuredCats.length; n++)
    {
      let data = { url: featuredCats[n]}
      prodStr = JSON.stringify(data,null,2)
      fs.appendFileSync(fileOut, prodStr)
      fs.appendFileSync(fileOut, ',\n  ')
    }

          
  
    

    // for(let j=0; j<featuredCats.length-1; j++)
    // {
    //   await page.goto(
    //     featuredCats[j],
    //     {waitUntil: "networkidle2"}
    //   )

    //   const prodCountText = await page.$eval(
    //     '#root > main > section > section > div.MuiBox-root.css-19nojhs > div.MuiBox-root.css-7eskqt > h1',
    //     el => el.innerText
    //   )
    //   let prodCount = prodCountText.split(" ")[0]
    //   prodCount = parseInt(prodCount)

    //   console.log(prodCount)

    //   let clicks = Math.floor(prodCount/24)

    //   for(let l=1; l<clicks-1; l++)
    //   {
    //     await wait(1000)
    //     const prodLinks = await page.$$eval(
    //       '.ProductCard__StyledProductDetails-bwrMVw > div > div  a',
    //       arrs => {
    //         return arrs.map(op => op.href)
    //       }
    //     )
  
        
    //     for (let k=0; k<prodLinks.length; k++)
    //     {
    //       prod = {
    //         url: prodLinks[k]
    //       }
  
          
    //       prodStr = JSON.stringify(prod,null,2)
    //       fs.appendFileSync(fileOut, prodStr)
    //       fs.appendFileSync(fileOut, ',\n  ')
  
    //     }
        
    //     allLinks = allLinks.concat(prodLinks)

    //     if (clicks>0)
    //     {
    //       const nextButton = await page.$('#root > main > section > section > nav > ul > li:nth-child(7) > button > svg')

    //       nextButton.click()
    //       await page.waitForNetworkIdle(
    //         {
    //           idleTime: 100 
    //         }
    //       )
    //     }
        
    //   }

      

    // }

  }




}


//wait if needed
async function wait(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}


main("https://shop.deere.com/jdb2cstorefront/JohnDeereStore/en/")