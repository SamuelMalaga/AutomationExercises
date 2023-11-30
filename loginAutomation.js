const pup = require('puppeteer');


//Main script for automation with syntax (async ()=>{})(); Immediately Invoked Function Expression (IIFE) to execute as soon as the file is executed
(async ()=>{

  //setting headless = false for testing purposes
  const browser = await pup.launch({
    headless: false
  });

  //Open new tab
  const page = await browser.newPage()

  //Configures the page authentication via dialog window
  await page.authenticate({'username':'admin', 'password': 'admin'});

  //Intercepts page prompt
  page.on('dialog', async dialog=>{
    console.log(dialog.accept('admin:admin'));
  })

  //Navigate to specific URL
  await page.goto('https://the-internet.herokuapp.com/basic_auth');

  //Set timeout to load the page
  await new Promise(r => setTimeout(r, 2000));

  //Return the message of successful login
  const successfulLoginTag = await page.waitForXPath('//*[@id="content"]/div/p');
  const successMessage = await page.evaluate(el => el.textContent,successfulLoginTag);
  console.log(successMessage);

  browser.close()

})();
