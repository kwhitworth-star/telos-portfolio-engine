/**
 * TELOS Portfolio Purpose Engine - Navigation Debug Test
 * 
 * Thoroughly tests navigation functionality:
 * - Forward/backward navigation
 * - Button states (enabled/disabled)
 * - Progress bar updates
 * - State persistence between sections
 * - Edge cases (rapid clicking, incomplete sections)
 * 
 * Run: node tests/puppeteer_navtest.js
 * Prerequisite: npm install puppeteer
 */

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8000/telos.html';

async function runNavigationTests() {
    console.log('🚀 Starting TELOS Navigation Tests...\n');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    let testsPassed = 0;
    let testsFailed = 0;
    
    async function test(name, testFn) {
        try {
            await testFn();
            console.log(`  ✓ ${name}`);
            testsPassed++;
        } catch (error) {
            console.log(`  ✗ ${name}: ${error.message}`);
            testsFailed++;
        }
    }
    
    try {
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
        
        // ============================================
        // TEST GROUP 1: Initial State
        // ============================================
        console.log('\n📋 Test Group 1: Initial State');
        
        await test('Welcome section is active on load', async () => {
            const isActive = await page.$eval('#welcomeSection', el => el.classList.contains('active'));
            if (!isActive) throw new Error('Welcome section not active');
        });
        
        await test('Progress bar is hidden initially', async () => {
            const display = await page.$eval('#progressContainer', el => el.style.display);
            if (display !== 'none') throw new Error('Progress bar should be hidden');
        });
        
        await test('Results section is hidden initially', async () => {
            const isActive = await page.$eval('#resultsSection', el => el.classList.contains('active'));
            if (isActive) throw new Error('Results should not be active');
        });
        
        // ============================================
        // TEST GROUP 2: Starting Assessment
        // ============================================
        console.log('\n📋 Test Group 2: Starting Assessment');
        
        await test('Begin Assessment button navigates to Section 1', async () => {
            await page.click('button.btn-primary');
            await page.waitForSelector('#section1.active', { timeout: 3000 });
        });
        
        await test('Progress bar becomes visible', async () => {
            const display = await page.$eval('#progressContainer', el => el.style.display);
            if (display === 'none') throw new Error('Progress bar should be visible');
        });
        
        await test('Previous button is disabled in Section 1', async () => {
            const disabled = await page.$eval('#prev1', btn => btn.disabled);
            if (!disabled) throw new Error('Previous should be disabled');
        });
        
        await test('Next button is disabled without answers', async () => {
            const disabled = await page.$eval('#next1', btn => btn.disabled);
            if (!disabled) throw new Error('Next should be disabled');
        });
        
        // ============================================
        // TEST GROUP 3: Partial Answering
        // ============================================
        console.log('\n📋 Test Group 3: Partial Answering');
        
        await test('Next stays disabled with partial answers (1/5)', async () => {
            await page.click('#q1_3');
            await page.waitForTimeout(100);
            const disabled = await page.$eval('#next1', btn => btn.disabled);
            if (!disabled) throw new Error('Next should still be disabled');
        });
        
        await test('Next stays disabled with partial answers (4/5)', async () => {
            await page.click('#q2_3');
            await page.click('#q3_3');
            await page.click('#q4_3');
            await page.waitForTimeout(100);
            const disabled = await page.$eval('#next1', btn => btn.disabled);
            if (!disabled) throw new Error('Next should still be disabled');
        });
        
        await test('Progress bar shows 4 of 15', async () => {
            const text = await page.$eval('#progressText', el => el.textContent);
            if (!text.includes('4 of 15')) throw new Error(`Expected "4 of 15", got "${text}"`);
        });
        
        // ============================================
        // TEST GROUP 4: Complete Section Navigation
        // ============================================
        console.log('\n📋 Test Group 4: Complete Section Navigation');
        
        await test('Next enables when section complete', async () => {
            await page.click('#q5_3');
            await page.waitForTimeout(100);
            const disabled = await page.$eval('#next1', btn => btn.disabled);
            if (disabled) throw new Error('Next should be enabled');
        });
        
        await test('Navigate to Section 2', async () => {
            await page.click('#next1');
            await page.waitForSelector('#section2.active', { timeout: 3000 });
        });
        
        await test('Section 1 no longer active', async () => {
            const isActive = await page.$eval('#section1', el => el.classList.contains('active'));
            if (isActive) throw new Error('Section 1 should not be active');
        });
        
        await test('Previous button enabled in Section 2', async () => {
            const disabled = await page.$eval('#prev2', btn => btn.disabled);
            if (disabled) throw new Error('Previous should be enabled');
        });
        
        // ============================================
        // TEST GROUP 5: Backward Navigation
        // ============================================
        console.log('\n📋 Test Group 5: Backward Navigation');
        
        await test('Navigate back to Section 1', async () => {
            await page.click('#prev2');
            await page.waitForSelector('#section1.active', { timeout: 3000 });
        });
        
        await test('Answers preserved when going back', async () => {
            const checked = await page.$eval('#q1_3', radio => radio.checked);
            if (!checked) throw new Error('Answer should be preserved');
        });
        
        await test('Navigate forward to Section 2 again', async () => {
            await page.click('#next1');
            await page.waitForSelector('#section2.active', { timeout: 3000 });
        });
        
        // ============================================
        // TEST GROUP 6: Complete All Sections
        // ============================================
        console.log('\n📋 Test Group 6: Complete All Sections');
        
        // Answer Section 2
        for (let i = 6; i <= 10; i++) {
            await page.click(`#q${i}_3`);
        }
        await page.waitForTimeout(100);
        
        await test('Navigate to Section 3', async () => {
            await page.click('#next2');
            await page.waitForSelector('#section3.active', { timeout: 3000 });
        });
        
        // Answer Section 3
        for (let i = 11; i <= 15; i++) {
            await page.click(`#q${i}_3`);
        }
        await page.waitForTimeout(100);
        
        await test('Progress shows 15 of 15', async () => {
            const text = await page.$eval('#progressText', el => el.textContent);
            if (!text.includes('15 of 15')) throw new Error(`Expected "15 of 15", got "${text}"`);
        });
        
        await test('View Results button enabled', async () => {
            const disabled = await page.$eval('#next3', btn => btn.disabled);
            if (disabled) throw new Error('View Results should be enabled');
        });
        
        // ============================================
        // TEST GROUP 7: Results Navigation
        // ============================================
        console.log('\n📋 Test Group 7: Results Navigation');
        
        await test('Navigate to Results', async () => {
            await page.click('#next3');
            await page.waitForSelector('#resultsSection.active', { timeout: 3000 });
        });
        
        await test('Progress bar hidden on results', async () => {
            const display = await page.$eval('#progressContainer', el => el.style.display);
            if (display !== 'none') throw new Error('Progress bar should be hidden');
        });
        
        await test('All sections except results are hidden', async () => {
            const s1 = await page.$eval('#section1', el => el.classList.contains('active'));
            const s2 = await page.$eval('#section2', el => el.classList.contains('active'));
            const s3 = await page.$eval('#section3', el => el.classList.contains('active'));
            const welcome = await page.$eval('#welcomeSection', el => el.classList.contains('active'));
            if (s1 || s2 || s3 || welcome) throw new Error('Other sections should be hidden');
        });
        
        // ============================================
        // TEST GROUP 8: Retake Flow
        // ============================================
        console.log('\n📋 Test Group 8: Retake Flow');
        
        await test('Retake navigates to Section 1', async () => {
            await page.click('button.btn-primary'); // Retake button
            await page.waitForSelector('#section1.active', { timeout: 3000 });
        });
        
        await test('Answers cleared after retake', async () => {
            const checked = await page.$eval('#q1_3', radio => radio.checked);
            if (checked) throw new Error('Answers should be cleared');
        });
        
        await test('Next button disabled after retake', async () => {
            const disabled = await page.$eval('#next1', btn => btn.disabled);
            if (!disabled) throw new Error('Next should be disabled');
        });
        
        await test('Progress reset after retake', async () => {
            const text = await page.$eval('#progressText', el => el.textContent);
            if (!text.includes('0 of 15')) throw new Error(`Expected "0 of 15", got "${text}"`);
        });
        
        // ============================================
        // TEST GROUP 9: Edge Cases
        // ============================================
        console.log('\n📋 Test Group 9: Edge Cases');
        
        await test('Rapid answer changes work correctly', async () => {
            // Rapidly click different options for same question
            await page.click('#q1_1');
            await page.click('#q1_2');
            await page.click('#q1_3');
            await page.click('#q1_4');
            await page.click('#q1_5');
            await page.click('#q1_3');
            await page.waitForTimeout(100);
            const checked = await page.$eval('#q1_3', radio => radio.checked);
            if (!checked) throw new Error('Final answer should be selected');
        });
        
        await test('Answer all and complete flow', async () => {
            // Complete all questions quickly
            for (let i = 1; i <= 5; i++) await page.click(`#q${i}_3`);
            await page.click('#next1');
            await page.waitForSelector('#section2.active', { timeout: 3000 });
            
            for (let i = 6; i <= 10; i++) await page.click(`#q${i}_3`);
            await page.click('#next2');
            await page.waitForSelector('#section3.active', { timeout: 3000 });
            
            for (let i = 11; i <= 15; i++) await page.click(`#q${i}_3`);
            await page.click('#next3');
            await page.waitForSelector('#resultsSection.active', { timeout: 3000 });
        });
        
        // ============================================
        // SUMMARY
        // ============================================
        console.log('\n' + '='.repeat(50));
        console.log('NAVIGATION TEST SUMMARY');
        console.log('='.repeat(50));
        console.log(`Tests Passed: ${testsPassed}`);
        console.log(`Tests Failed: ${testsFailed}`);
        console.log(`Total Tests: ${testsPassed + testsFailed}`);
        console.log(`Pass Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
        console.log('='.repeat(50));
        
        if (testsFailed === 0) {
            console.log('\n✅ All navigation tests passed!\n');
        } else {
            console.log(`\n❌ ${testsFailed} test(s) failed.\n`);
        }
        
    } catch (error) {
        console.error('\n❌ Test suite error:', error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
    
    process.exit(testsFailed > 0 ? 1 : 0);
}

runNavigationTests();
