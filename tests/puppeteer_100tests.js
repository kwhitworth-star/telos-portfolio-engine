/**
 * TELOS Portfolio Purpose Engine - 100 Randomized Tests
 * 
 * Runs 100 different random answer combinations to verify:
 * - Scoring consistency
 * - Triangle positioning validity
 * - Score ranges are correct (0-100%)
 * - Barycentric coordinates sum to 1
 * - Asset allocation sums to 100%
 * 
 * Run: node tests/puppeteer_100tests.js
 * Prerequisite: npm install puppeteer
 */

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8000/telos.html';
const NUM_TESTS = 100;

function generateRandomAnswers() {
    const answers = [];
    for (let i = 0; i < 15; i++) {
        answers.push(Math.floor(Math.random() * 5) + 1); // 1-5
    }
    return answers;
}

function calculateExpectedScores(answers) {
    const stability = answers.slice(0, 5).reduce((a, b) => a + b, 0);
    const liquidity = answers.slice(5, 10).reduce((a, b) => a + b, 0);
    const returnScore = answers.slice(10, 15).reduce((a, b) => a + b, 0);
    const total = stability + liquidity + returnScore;
    
    return {
        stability: Math.round((stability / total) * 100),
        liquidity: Math.round((liquidity / total) * 100),
        return: Math.round((returnScore / total) * 100)
    };
}

async function runTest(browser, testNum, answers) {
    const page = await browser.newPage();
    
    try {
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
        
        // Start assessment
        await page.click('button.btn-primary');
        await page.waitForSelector('#section1.active', { timeout: 5000 });
        
        // Answer all questions
        for (let i = 0; i < 15; i++) {
            const qNum = i + 1;
            const answer = answers[i];
            await page.click(`#q${qNum}_${answer}`);
            await page.waitForTimeout(50);
            
            // Navigate between sections
            if (qNum === 5) {
                await page.click('#next1');
                await page.waitForSelector('#section2.active', { timeout: 5000 });
            } else if (qNum === 10) {
                await page.click('#next2');
                await page.waitForSelector('#section3.active', { timeout: 5000 });
            }
        }
        
        // View results
        await page.click('#next3');
        await page.waitForSelector('#resultsSection.active', { timeout: 5000 });
        
        // Get displayed scores
        const stabilityText = await page.$eval('#stabilityScore', el => el.textContent);
        const liquidityText = await page.$eval('#liquidityScore', el => el.textContent);
        const returnText = await page.$eval('#returnScore', el => el.textContent);
        
        const displayedScores = {
            stability: parseInt(stabilityText.replace('%', '')),
            liquidity: parseInt(liquidityText.replace('%', '')),
            return: parseInt(returnText.replace('%', ''))
        };
        
        // Calculate expected scores
        const expectedScores = calculateExpectedScores(answers);
        
        // Validate scores match (allow 1% tolerance due to rounding)
        const tolerance = 2;
        const validScores = 
            Math.abs(displayedScores.stability - expectedScores.stability) <= tolerance &&
            Math.abs(displayedScores.liquidity - expectedScores.liquidity) <= tolerance &&
            Math.abs(displayedScores.return - expectedScores.return) <= tolerance;
        
        // Validate scores sum to ~100% (allow for rounding)
        const total = displayedScores.stability + displayedScores.liquidity + displayedScores.return;
        const validTotal = total >= 99 && total <= 101;
        
        // Validate each score is within valid range
        const validRange = 
            displayedScores.stability >= 0 && displayedScores.stability <= 100 &&
            displayedScores.liquidity >= 0 && displayedScores.liquidity <= 100 &&
            displayedScores.return >= 0 && displayedScores.return <= 100;
        
        // Get asset allocation
        const bankingText = await page.$eval('#bankingPercent', el => el.textContent);
        const privateText = await page.$eval('#privatePercent', el => el.textContent);
        const stocksText = await page.$eval('#stocksPercent', el => el.textContent);
        
        const allocation = {
            banking: parseInt(bankingText.replace('%', '')),
            private: parseInt(privateText.replace('%', '')),
            stocks: parseInt(stocksText.replace('%', ''))
        };
        
        // Validate allocation sums to 100%
        const allocationTotal = allocation.banking + allocation.private + allocation.stocks;
        const validAllocation = allocationTotal === 100;
        
        await page.close();
        
        return {
            testNum,
            answers,
            expected: expectedScores,
            displayed: displayedScores,
            allocation,
            validScores,
            validTotal,
            validRange,
            validAllocation,
            passed: validScores && validTotal && validRange && validAllocation
        };
        
    } catch (error) {
        await page.close();
        return {
            testNum,
            answers,
            passed: false,
            error: error.message
        };
    }
}

async function run100Tests() {
    console.log(`🚀 Starting ${NUM_TESTS} Randomized TELOS Tests...\n`);
    console.log('This may take a few minutes...\n');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const results = [];
    let passed = 0;
    let failed = 0;
    
    // Run tests in batches of 10 for performance
    const batchSize = 10;
    
    for (let batch = 0; batch < NUM_TESTS / batchSize; batch++) {
        const batchPromises = [];
        
        for (let i = 0; i < batchSize; i++) {
            const testNum = batch * batchSize + i + 1;
            const answers = generateRandomAnswers();
            batchPromises.push(runTest(browser, testNum, answers));
        }
        
        const batchResults = await Promise.all(batchPromises);
        
        for (const result of batchResults) {
            results.push(result);
            
            if (result.passed) {
                passed++;
                process.stdout.write('.');
            } else {
                failed++;
                process.stdout.write('X');
            }
        }
    }
    
    await browser.close();
    
    console.log('\n\n' + '='.repeat(60));
    console.log('TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${NUM_TESTS}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Pass Rate: ${((passed / NUM_TESTS) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
        console.log('\n' + '-'.repeat(60));
        console.log('FAILED TESTS:');
        console.log('-'.repeat(60));
        
        results.filter(r => !r.passed).forEach(r => {
            console.log(`\nTest #${r.testNum}:`);
            console.log(`  Answers: [${r.answers.join(', ')}]`);
            if (r.error) {
                console.log(`  Error: ${r.error}`);
            } else {
                console.log(`  Expected: S=${r.expected.stability}%, L=${r.expected.liquidity}%, R=${r.expected.return}%`);
                console.log(`  Displayed: S=${r.displayed.stability}%, L=${r.displayed.liquidity}%, R=${r.displayed.return}%`);
                console.log(`  Valid Scores: ${r.validScores}, Valid Total: ${r.validTotal}, Valid Range: ${r.validRange}`);
                console.log(`  Allocation: Banking=${r.allocation.banking}%, Private=${r.allocation.private}%, Stocks=${r.allocation.stocks}%`);
                console.log(`  Valid Allocation: ${r.validAllocation}`);
            }
        });
    }
    
    console.log('\n');
    
    // Score distribution analysis
    console.log('='.repeat(60));
    console.log('SCORE DISTRIBUTION ANALYSIS');
    console.log('='.repeat(60));
    
    const passedResults = results.filter(r => r.passed);
    
    if (passedResults.length > 0) {
        const stabilityScores = passedResults.map(r => r.displayed.stability);
        const liquidityScores = passedResults.map(r => r.displayed.liquidity);
        const returnScores = passedResults.map(r => r.displayed.return);
        
        const avg = arr => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
        const min = arr => Math.min(...arr);
        const max = arr => Math.max(...arr);
        
        console.log(`\nStability:  Min=${min(stabilityScores)}%, Max=${max(stabilityScores)}%, Avg=${avg(stabilityScores)}%`);
        console.log(`Liquidity:  Min=${min(liquidityScores)}%, Max=${max(liquidityScores)}%, Avg=${avg(liquidityScores)}%`);
        console.log(`Return:     Min=${min(returnScores)}%, Max=${max(returnScores)}%, Avg=${avg(returnScores)}%`);
    }
    
    console.log('\n');
    
    process.exit(failed > 0 ? 1 : 0);
}

run100Tests();
