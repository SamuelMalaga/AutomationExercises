const pup = require('puppeteer');


(async ()=> {


  const browser = await pup.launch({headless:false});

  const page = await browser.newPage();

  //Navigate to the main test page
  await page.goto('https://the-internet.herokuapp.com/');

  //Locate the specific tag to access the dynamic content page
  //const dynamicContentLink = await page.waitForXPath('//*[@id="content"]/ul/li[12]/a')

  //Click on the dynamic content link
  await page.click('xpath=//*[@id="content"]/ul/li[14]/a');

  //After navigate to the dynamic content page wait for the selectors to show up
  await page.waitForXPath('//*[@id="content"]/div/a[1]');
  await page.waitForXPath('//*[@id="content"]/div/a[2]');

  //Declare the target handlers
  const ButtonHandle1 = await page.$x('//*[@id="content"]/div/a[1]');
  const ButtonHandle2 = await page.$x('//*[@id="content"]/div/a[2]');
  const buttonHandleTest = await page.$eval('#content > div > a:nth-child(5)', el => el.textContent);
  console.log(buttonHandleTest)

  //Get each href from handlers
  const urlLink1 = await (await ButtonHandle1[0].getProperty('href')).jsonValue();
  const urlLink2 = await (await ButtonHandle2[0].getProperty('href')).jsonValue();

  //Open the new tabs
    //Page 1 handling hidden Elements
    const page1 = await browser.newPage()
    await page1.goto(urlLink1)
    const hiddenElement = await page1.waitForXPath('//*[@id="finish"]/h4')
    const hiddenElementText = await page1.evaluate(el => el.textContent, hiddenElement)
    console.log(hiddenElementText)
    //Page 2 handling late rendering elements
    const page2 = await browser.newPage()
    await page2.goto(urlLink2)
    await page2.waitForXPath('//*[@id="start"]/button')
    const eventTriggerButton = await page.$x('//*[@id="start"]/button');
    await page2.click('xpath=//*[@id="start"]/button')
    await page2.waitForXPath('//*[@id="finish"]/h4')
    const renderedElement = await page1.waitForXPath('//*[@id="finish"]/h4')
    const renderedElementText = await page1.evaluate(el => el.textContent, renderedElement)
    console.log(renderedElementText)

  browser.close()
})();
