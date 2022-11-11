const puppeteer = require('puppeteer-extra')

const fs = require('fs')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))


const blockResourcesPlugin = require('puppeteer-extra-plugin-block-resources')()
puppeteer.use(blockResourcesPlugin)

const outputFileA = "output/output_mainA_02.json"
const outputFileB = "output/output_mainB_02.json"
const outputFileC = "output/output_mainC_02.json"
const prodMissFile = 'output/missed/missedProds_main.json'

const inpDataB64 = process.argv.find((a) => a.startsWith('--input-data')).replace('--input-data', '')
const inputData = JSON.parse(Buffer.from(inpDataB64, 'base64').toString())

console.log(inputData)



//wait if needed
async function wait(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}




async function main (urlArg, outputFile) {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Users/Anik/.cache/puppeteer/chrome/win64-1045629/chrome-win/chrome.exe',
    // executablePath: 'C:/Users/talat/AppData/Local/Google/Chrome SxS/Application/chrome.exe',
    headless: true,
    userDataDir: './data',
    // args: [`--window-size=1366,768`],
    // args:[
    //   "--proxy-server=127.0.0.1:24001"
    // ],
    defaultViewport: {
      width:1366,
      height:768
    }    
  })

  
  const page = await browser.newPage()

  blockResourcesPlugin.blockedTypes.add('image')
  blockResourcesPlugin.blockedTypes.add('other')
  blockResourcesPlugin.blockedTypes.add('media')
  blockResourcesPlugin.blockedTypes.add('stylesheet')

  // await page.authenticate({
  //   username: 'brd-customer-hl_55cbe8a8-zone-zone1',
  //   password: 'zrmm196jg4om'
  // })

  await page.goto(
    urlArg,
    { waitUntil: "networkidle2" }
  )
  
  await wait(1000)

  /***READING AND STORING <<SKU>> HERE***/

  const sku = await page.$eval(
    'div.css-12ybf7 > p',
    el => el.innerText.split(': ')[1]
  )
  
  
  
  
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
  

  let name = breadcrumbs[breadcrumbs.length-1].split(': ')[1]
  

  /***READING AND STORING <<IMAGE URL>> HERE***/
  
  let image_urls = ""

  const images = await page.$$eval(
    'li.thumb > img',
    (els) => {
      return els.map(el => el.src)
    }
  )



  for(let i = 0; i< images.length; i++)
  {
    if(i == images.length)
      image_urls += images[i]
    else
      image_urls += images[i] + ","
  }

  //https://shop.deere.com/medias/GY20629_Media_JD1200Wx1200H?context=bWFzdGVyfHJvb3R8MTE2MTQyfGltYWdlL2pwZWd8aGNiL2g2ZC84ODQ5NTA4NjMwNTU4LmpwZ3xjNmUxYmE1OWIwMTg1OWVkODM2OTQ5OGE0ODVjZTRmYzc0ZmJiYmIyMjFkODcxNjg2NTEwOWQyNzNiZTg2OTRk
  //https://shop.deere.com/medias/GY20629_Media_JD1200Wx1200H?context=bWFzdGVyfHJvb3R8MTE2MTQyfGltYWdlL2pwZWd8aGNiL2g2ZC84ODQ5NTA4NjMwNTU4LmpwZ3xjNmUxYmE1OWIwMTg1OWVkODM2OTQ5O


  
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
    if(str.substring(0,6) == "Length")
      length = str.split("\n")[1]

    if(str.substring(0,5) == "Width")
      width = str.split("\n")[1]

    if(str.substring(0,6) == "Height")
      height = str.split("\n")[1]
    
    if(str.substring(0,6) == "Weight")
      weight = str.split("\n")[1]
  }

  

  /***READING AND STORING <<Also Fits On>> HERE***/
  //button.MuiTab-root


  
  let fitsOn = 'null'

  const tabs = await page.$x(
    "//button[contains(text(),'Also Fits on')]"
  )

  if(tabs.length>0)
  {
    fitsOn = ''

    await tabs[0].click()
    const fitsOnArray = await page.$$eval(
      '.css-1fz6teg',
      (array) => {
        return array.map(el => el.innerText)
      }
    )

    
    for(i=0;i<fitsOnArray.length;i++)
    {
      if(i == fitsOnArray.length-1)
        fitsOn += fitsOnArray[i]
      else
        fitsOn += fitsOnArray[i] + '<br>'
    }
       
    
  }  
  
  const prod = {
    url: urlArg,
    sku: sku,
    name: name,
    breadcrumbs: crumbsText,
    image_urls: image_urls,
    length: length,
    width: width,
    height: height,
    weight: weight,
    also_fits_on: fitsOn
  }

  output = JSON.stringify(prod, null, 2)
  console.log(output)

  
  fs.appendFileSync(outputFile, output+', \n')
  
  await browser.close()
  
}




// 

// try {
//   main(inputData.url)
// } catch (error) {
//   console.error('--index error--', error)
//   missedLink = JSON.stringify(inputData.url,null,2)
//   fs.appendFileSync(prodMissFile, missedLink)
//   fs.appendFileSync(prodMissFile, ',\n  ')
// }

async function runner(url, outFile)
{
  try {
    await main(url, outFile)
  } catch (error) {
    console.error('-- runner error --', error)
    errData = { url: inputData.url}
    missedLink = JSON.stringify(errData,null,2)
    
    fs.appendFileSync(prodMissFile, missedLink + ',\n  ')
    
    return
  }
}


async function parallel(url1, url2) {
  Promise.allSettled(
    [
      runner(url1, outputFileA),
      runner(url2, outputFileB),
      runner(url2, outputFileC)
    ]
  )
}


void parallel(inputData.url1, inputData.url2, inputData.url2)