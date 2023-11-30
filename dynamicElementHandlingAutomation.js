const pup = require('puppeteer');

function writeLine(string){
  console.log(string)
}

(async ()=> {

  writeLine('Starting the automation routine')

  writeLine('Accessing browser')
  const browser = await pup.launch();

  const page = await browser.newPage();

  writeLine('Navigating to the main test page')
  await page.goto('https://the-internet.herokuapp.com/');

  writeLine('Clicking on the dynamic content link')
  await page.click('xpath=//*[@id="content"]/ul/li[14]/a');

  //After navigate to the dynamic content page wait for the selectors to show up
  writeLine('Waiting for the specific selectors to show up')
  await page.waitForXPath('//*[@id="content"]/div/a[1]');
  await page.waitForXPath('//*[@id="content"]/div/a[2]');

  //Declare the target handlers
  writeLine('Declaring the target handlers')
  const ButtonHandle1 = await page.$x('//*[@id="content"]/div/a[1]');
  const ButtonHandle2 = await page.$x('//*[@id="content"]/div/a[2]');

  //Get each href from handlers
  writeLine('Extracting each URL Links from targeted handlers')
  const urlLink1 = await (await ButtonHandle1[0].getProperty('href')).jsonValue();
  const urlLink2 = await (await ButtonHandle2[0].getProperty('href')).jsonValue();

  //Open the new tabs
  writeLine('Opening the new tabs with retrieved urls')
    //Page 1 handling hidden Elements
    writeLine('Handling the first tab')
    const page1 = await browser.newPage()
    await page1.goto(urlLink1)
    const hiddenElement = await page1.waitForXPath('//*[@id="finish"]/h4')
    const hiddenElementText = await page1.evaluate(el => el.textContent, hiddenElement)
    writeLine(`retrieved Target Element: ${hiddenElementText}`)
    //Page 2 handling late rendering elements
    writeLine('Handling the second tab')
    const page2 = await browser.newPage()
    await page2.goto(urlLink2)
    await page2.waitForXPath('//*[@id="start"]/button')
    const eventTriggerButton = await page.$x('//*[@id="start"]/button');
    await page2.click('xpath=//*[@id="start"]/button')
    await page2.waitForXPath('//*[@id="finish"]/h4')
    const renderedElement = await page1.waitForXPath('//*[@id="finish"]/h4')
    const renderedElementText = await page1.evaluate(el => el.textContent, renderedElement)
    writeLine(`retrieved Target Element: ${renderedElementText}`)

  writeLine('Automation executed with success, closing the browser')

  browser.close()
})();
