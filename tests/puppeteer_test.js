/**
 * TELOS Portfolio Purpose Engine - Puppeteer Sanity Test
 * 
 * Single-run test to verify basic functionality:
 * - Page loads correctly
 * - Assessment can be started
 * - Questions can be answered
 * - Navigation works
 * - Results display properly
 * 
 * Run: node tests/puppeteer_test.js
 * Prerequisite: npm install puppeteer
 */

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8000/telos.html';

async function runSanityTest() {
    console.log('🚀 Starting TELOS Sanity Test...\n');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    try {
        // Test 1: Page Load
        console.log('Test 1: Loading page...');
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
        const title = await page.title();
        if (title.includes('TELOS')) {
            console.log('  ✓ Page loaded successfully');
        } else {
            throw new Error('Page title does not contain TELOS');
        }

        // Test 2: Welcome Section Visible
        console.log('Test 2: Checking welcome section...');
        const welcomeVisible = await page.$eval('#welcomeSection', el => el.classList.contains('active'));
        if (welcomeVisible) {
            console.log('  ✓ Welcome section is visible');
        } else {
            throw new Error('Welcome section not visible');
        }

        // Test 3: Start Assessment
        console.log('Test 3: Starting assessment...');
        await page.click('button.btn-primary');
        await page.waitForSelector('#section1.active', { timeout: 5000 });
        console.log('  ✓ Assessment started, Section 1 visible');

        // Test 4: Answer Section 1 Questions
        console.log('Test 4: Answering Section 1 questions...');
        for (let i = 1; i <= 5; i++) {
            await page.click(`#q${i}_3`); // Select middle option (3)
            await page.waitForTimeout(100);
        }
        console.log('  ✓ Section 1 questions answered');

        // Test 5: Next Button Enabled
        console.log('Test 5: Checking Next button...');
        const nextDisabled = await page.$eval('#next1', btn => btn.disabled);
        if (!nextDisabled) {
            console.log('  ✓ Next button enabled');
        } else {
            throw new Error('Next button should be enabled');
        }

        // Test 6: Navigate to Section 2
        console.log('Test 6: Navigating to Section 2...');
        await page.click('#next1');
        await page.waitForSelector('#section2.active', { timeout: 5000 });
        console.log('  ✓ Section 2 visible');

        // Test 7: Answer Section 2 Questions
        console.log('Test 7: Answering Section 2 questions...');
        for (let i = 6; i <= 10; i++) {
            await page.click(`#q${i}_3`);
            await page.waitForTimeout(100);
        }
        console.log('  ✓ Section 2 questions answered');

        // Test 8: Navigate to Section 3
        console.log('Test 8: Navigating to Section 3...');
        await page.click('#next2');
        await page.waitForSelector('#section3.active', { timeout: 5000 });
        console.log('  ✓ Section 3 visible');

        // Test 9: Answer Section 3 Questions
        console.log('Test 9: Answering Section 3 questions...');
        for (let i = 11; i <= 15; i++) {
            await page.click(`#q${i}_3`);
            await page.waitForTimeout(100);
        }
        console.log('  ✓ Section 3 questions answered');

        // Test 10: View Results
        console.log('Test 10: Viewing results...');
        await page.click('#next3');
        await page.waitForSelector('#resultsSection.active', { timeout: 5000 });
        console.log('  ✓ Results section visible');

        // Test 11: Check Score Display
        console.log('Test 11: Checking score display...');
        const stabilityScore = await page.$eval('#stabilityScore', el => el.textContent);
        const liquidityScore = await page.$eval('#liquidityScore', el => el.textContent);
        const returnScore = await page.$eval('#returnScore', el => el.textContent);
        
        if (stabilityScore.includes('%') && liquidityScore.includes('%') && returnScore.includes('%')) {
            console.log(`  ✓ Scores displayed: S=${stabilityScore}, L=${liquidityScore}, R=${returnScore}`);
        } else {
            throw new Error('Scores not displaying correctly');
        }

        // Test 12: Check Triangle Canvas
        console.log('Test 12: Checking triangle canvas...');
        const canvasExists = await page.$('#triangleCanvas');
        if (canvasExists) {
            console.log('  ✓ Triangle canvas exists');
        } else {
            throw new Error('Triangle canvas not found');
        }

        // Test 13: Check Asset Allocation
        console.log('Test 13: Checking asset allocation...');
        const bankingPercent = await page.$eval('#bankingPercent', el => el.textContent);
        if (bankingPercent.includes('%')) {
            console.log('  ✓ Asset allocation displayed');
        } else {
            throw new Error('Asset allocation not displayed');
        }

        // Test 14: Retake Button Works
        console.log('Test 14: Testing retake functionality...');
        await page.click('button.btn-primary'); // Retake button
        await page.waitForSelector('#section1.active', { timeout: 5000 });
        console.log('  ✓ Retake navigates to Section 1');

        // Test 15: Answers cleared after retake
        console.log('Test 15: Checking answers cleared...');
        const q1Checked = await page.$eval('#q1_3', radio => radio.checked);
        if (!q1Checked) {
            console.log('  ✓ Answers cleared on retake');
        } else {
            throw new Error('Answers not cleared after retake');
        }

        console.log('\n✅ All 15 tests passed!\n');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

runSanityTest();
