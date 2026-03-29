const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    console.log("Navigating to the page on port 3008...");
    try {
      await page.goto('http://localhost:3008/live2d/model/19a06015-e8af-418f-966d-3086a66fb3f2', {waitUntil: 'networkidle0', timeout: 30000});
    } catch (e) {
      console.log('GOTO ERR:', e.message);
    }
    
    await new Promise(r => setTimeout(r, 6000));
    
    // Evaluate in browser context to poke around the PIXI instance
    await page.evaluate(() => {
      const p = window.PIXI;
      if (!p) { console.log('NO PIXI'); return; }
      
      // We can grab the canvas from the window or just assume it's there
      // Wait, Live2DModelDetail hides PIXI app inside appRef but maybe we can find it?
      // PIXI 6 doesn't store global __PIXI_APP__ by default unless devtools installed.
      // But we can check window arrays, or we can just run a quick lookup!
      // Easier: just look at the network requests for `.model3.json`!
    });

    await page.screenshot({path: 'frontend_screenshot_probe.png'});
    
    await browser.close();
  } catch (err) {
    console.error("SCRIPT ERR:", err);
    process.exit(1);
  }
})();
