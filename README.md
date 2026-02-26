# TELOS Portfolio Purpose Engine

<p align="center">
  <strong>Discover the True Purpose of Your Investment Portfolio</strong>
</p>

TELOS is a sophisticated web-based assessment tool that helps investors understand their ideal portfolio allocation across three key dimensions: **Stability**, **Liquidity**, and **Return**.

## Features

- **15-Question Assessment** - Comprehensive questionnaire across 3 sections
- **Barycentric Triangle Visualization** - Interactive visual representation of your portfolio balance
- **Asset Sleeve Allocation** - Personalized recommendations for Banking, Private/Non-Correlated, and Stocks & Bonds
- **Accredited Investor Qualification** - SEC-compliant investor status verification
- **State Persistence** - Progress saved during assessment
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Embedded Test Suite** - Built-in automated testing
- **Share Results** - Easy sharing via Web Share API or clipboard

## Quick Start

### Prerequisites

- Python 3.x (for local server)
- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- Node.js (optional, for running Puppeteer tests)

### Running Locally

1. **Clone or download** the project

2. **Start the local server:**
   ```bash
   cd "TELOS 2.0"
   python3 -m http.server 8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000/telos.html
   ```

## Project Structure

```
TELOS 2.0/
├── telos.html              # Main application (self-contained)
├── README.md               # This file
├── Planning.md             # Development plan
├── Claude.md               # Development progress log
├── TELOS_2.md              # Original specification
├── requirements.txt        # Dependencies documentation
├── package.json            # Node.js configuration
└── tests/
    ├── puppeteer_test.js       # Single-run sanity test
    ├── puppeteer_100tests.js   # 100 randomized scenarios
    └── puppeteer_navtest.js    # Navigation tests
```

## Assessment Sections

### Section 1: Stability (Questions 1-5)
- Principal preservation importance
- Market volatility concerns
- Preference for steady vs. variable returns
- Government-backed investment preference
- Overall risk aversion

### Section 2: Liquidity (Questions 6-10)
- Immediate fund access needs
- Withdrawal frequency expectations
- Lock-up period comfort
- Emergency fund coverage
- Quick cash conversion importance

### Section 3: Return (Questions 11-15)
- Long-term growth importance
- Short-term loss tolerance
- Aggressive growth interest
- Investment time horizon
- Market outperformance goals

## Scoring Methodology

TELOS uses **barycentric coordinates** to position your results within a triangle where each vertex represents 100% allocation to that dimension:

```
                  STABILITY
                     /\
                    /  \
                   /    \
                  / USER \
                 /   •    \
                /          \
               /____________\
           LIQUIDITY      RETURN
```

### Score Calculation
1. Raw scores: Sum of answers (1-5) for each section's 5 questions
2. Normalization: Scores converted to barycentric coordinates (sum to 1)
3. Visualization: Point plotted on triangle using coordinate weights

### Asset Sleeve Allocation

| Sleeve | Calculation | Investment Types |
|--------|-------------|------------------|
| **Banking** | (Stability + Liquidity) / 2 | Cash, CDs, Money Market |
| **Private/Non-Correlated** | (Stability + Return) / 2 | Real Estate, Private Equity |
| **Stocks & Bonds** | (Liquidity + Return) / 2 | Public Markets |

## Running Tests

### Install Test Dependencies
```bash
npm install
```

### Run Single Sanity Test
```bash
npm run test
# or
node tests/puppeteer_test.js
```

### Run 100 Randomized Tests
```bash
npm run test:100
# or
node tests/puppeteer_100tests.js
```

### Run Navigation Tests
```bash
npm run test:nav
# or
node tests/puppeteer_navtest.js
```

### Run All Tests
```bash
npm run test:all
```

### Embedded Test Suite
Click the "Run Tests" button in the bottom-right corner of the application to run the embedded test suite directly in the browser.

## Customization

### White-Labeling

The header section supports white-labeling. To add your logo:

```html
<div class="header">
    <img src="your-logo.png" alt="Logo" class="header-logo">
    <div class="brand">YOUR BRAND</div>
    <div class="tagline">Your Tagline</div>
</div>
```

### Styling

All CSS is embedded in `telos.html`. Key color variables:
- Primary gradient: `#4fd1c5` to `#63b3ed`
- Background: `#050810` to `#0a0f1a`
- Text primary: `#e0e6ed`
- Text secondary: `#718096`

### Adding Questions

1. Add question HTML in the appropriate section
2. Update question numbering
3. Add radio button name following pattern `q{number}`
4. Update scoring logic ranges in JavaScript

## Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |

### Required Features
- JavaScript enabled
- localStorage available
- CSS Grid/Flexbox support
- Canvas API support

## Accredited Investor Criteria

The assessment includes SEC-compliant accredited investor verification:
- Annual income > $200K (single) or $300K (joint)
- Net worth > $1M (excluding primary residence)
- Series 7, 65, or 82 license holder
- Entity with assets > $5M

## Development

### Files Overview

- **telos.html**: Complete self-contained application
- **Planning.md**: Detailed development roadmap
- **Claude.md**: Session-by-session development log

### Key JavaScript Functions

| Function | Purpose |
|----------|---------|
| `startAssessment()` | Initialize and begin assessment |
| `updateSectionView()` | Handle section navigation |
| `calculateScores()` | Compute barycentric coordinates |
| `drawPortfolioTriangle()` | Render canvas visualization |
| `updateAssetAllocation()` | Calculate sleeve percentages |
| `checkAccreditedStatus()` | Evaluate investor qualification |

### State Management

- `saveState()` - Persist to localStorage
- `loadState()` - Restore from localStorage
- `resetState()` - Clear all saved data

## License

MIT License - See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run all tests
5. Submit a pull request

## Support

For issues or questions, please open an issue on the repository.

---

<p align="center">
  <em>Built with ❤️ for better investment decisions</em>
</p>
