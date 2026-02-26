# TELOS Portfolio Purpose Engine - Development Plan

## Executive Summary
TELOS is a single-page web application that helps users discover their investment portfolio purpose through an interactive questionnaire. The application visualizes results using a barycentric triangle coordinate system and provides personalized asset allocation recommendations.

---

## Project Architecture

### Technology Stack
| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Fonts | Google Fonts (Cormorant Garamond, DM Mono, Manrope) |
| State Management | localStorage |
| Testing | Puppeteer (Node.js) |
| Local Server | Python 3 http.server |
| Build | No build step required (vanilla JS) |

### File Structure
```
TELOS 2.0/
├── telos.html              # Main application (self-contained)
├── requirements.txt        # Python/Node dependencies
├── package.json            # Node.js dependencies for testing
├── Planning.md             # This file
├── Claude.md               # Development progress log
├── TELOS_2.md              # Original specification
├── tests/
│   ├── puppeteer_test.js       # Single-run sanity check
│   ├── puppeteer_100tests.js   # 100 randomized scenarios
│   └── puppeteer_navtest.js    # Navigation debug script
└── README.md               # Project documentation
```

---

## Feature Breakdown

### Phase 1: Core Application Structure

#### 1.1 HTML Structure
- [ ] Document head with meta tags and SEO
- [ ] Google Fonts integration
- [ ] Container layout with glass-morphism styling
- [ ] Responsive design support

#### 1.2 CSS Styling
- [ ] CSS reset and base styles
- [ ] Dark theme gradient backgrounds
- [ ] Glass-morphism container effects
- [ ] Responsive breakpoints (768px)
- [ ] Animation keyframes (fadeIn)
- [ ] Progress bar styling
- [ ] Button styles (primary, secondary)
- [ ] Radio button custom styling
- [ ] Triangle visualization canvas styling

#### 1.3 Landing/Welcome Page
- [ ] White-label header space
- [ ] TELOS branding and tagline
- [ ] "Begin Assessment" button
- [ ] Purpose explanation text

### Phase 2: Assessment Questionnaire

#### 2.1 Question Framework
- [ ] 15 total questions (5 per section)
- [ ] Section 1: Stability (S)
- [ ] Section 2: Liquidity (L)
- [ ] Section 3: Return (R)
- [ ] 5-point scale responses for each question

#### 2.2 Question Content

**Section 1: Stability Questions**
1. How important is preserving your principal investment?
2. How concerned are you about market volatility affecting your portfolio?
3. How much do you value predictable, steady returns over higher but variable returns?
4. How important is having FDIC-insured or government-backed investments?
5. How risk-averse would you describe yourself?

**Section 2: Liquidity Questions**
1. How important is having immediate access to your invested funds?
2. How often do you anticipate needing to withdraw from your investments?
3. How comfortable are you with investment lock-up periods?
4. How much emergency fund coverage do you maintain outside investments?
5. How important is it that your investments can be quickly converted to cash?

**Section 3: Return Questions**
1. How important is maximizing long-term growth in your portfolio?
2. How willing are you to accept short-term losses for potential higher returns?
3. How interested are you in aggressive growth opportunities?
4. What is your investment time horizon in years?
5. How important is outperforming standard market indices?

#### 2.3 Navigation System
- [ ] Progress bar showing current section
- [ ] Next button (enabled when all section questions answered)
- [ ] Previous button (disabled on first section)
- [ ] Proper scrolling behavior (not sticky)
- [ ] Section validation before advancement

#### 2.4 State Management
- [ ] `saveState()` function for localStorage
- [ ] `loadState()` function for localStorage
- [ ] Reset state on page load
- [ ] Track all 15 answers

### Phase 3: Scoring Engine

#### 3.1 Score Calculation
- [ ] Raw score collection per section (5-25 range)
- [ ] Score normalization (0-1 scale)
- [ ] Barycentric coordinate computation
- [ ] Weighted sum calculations

#### 3.2 Scoring Logic
```javascript
// Raw scores: each section = sum of 5 questions (1-5 scale each)
// Normalized: (rawScore - 5) / 20 gives 0-1 range
// Barycentric: coordinates sum to 1.0

function calculateScores(answers) {
    const sections = ['stability', 'liquidity', 'return'];
    const rawScores = {};
    
    sections.forEach((section, idx) => {
        const sectionAnswers = answers.slice(idx * 5, (idx + 1) * 5);
        rawScores[section] = sectionAnswers.reduce((a, b) => a + b, 0);
    });
    
    // Normalize
    const total = rawScores.stability + rawScores.liquidity + rawScores.return;
    return {
        stability: rawScores.stability / total,
        liquidity: rawScores.liquidity / total,
        return: rawScores.return / total
    };
}
```

### Phase 4: Triangle Visualization

#### 4.1 Canvas Setup
- [ ] Responsive canvas element
- [ ] High-DPI support (devicePixelRatio)
- [ ] Proper sizing for container

#### 4.2 Triangle Drawing
- [ ] Equilateral triangle geometry
- [ ] Vertex labels (S, L, R)
- [ ] Grid lines (optional)
- [ ] Background fill with gradient

#### 4.3 Result Point
- [ ] Barycentric to Cartesian conversion
- [ ] Animated dot entrance
- [ ] Dashed lines from point to edges
- [ ] Color-coded based on position

#### 4.4 Triangle Math
```javascript
// Barycentric to Cartesian conversion
function barycentricToCartesian(s, l, r, triangle) {
    const x = s * triangle.S.x + l * triangle.L.x + r * triangle.R.x;
    const y = s * triangle.S.y + l * triangle.L.y + r * triangle.R.y;
    return { x, y };
}
```

### Phase 5: Results Page

#### 5.1 Results Display
- [ ] Triangle visualization with user's point
- [ ] Percentage breakdown (S%, L%, R%)
- [ ] Interpretation text
- [ ] Portfolio type label

#### 5.2 Asset Sleeve Allocation
- [ ] Banking Sleeve: S + L combined
- [ ] Private/Non-Correlated: S + R combined
- [ ] Stocks & Bonds: L + R combined
- [ ] Visual bars/charts for allocation

#### 5.3 Allocation Logic
| Sleeve | Formula | Description |
|--------|---------|-------------|
| Banking | (S + L) / 2 | Cash, CDs, Money Market |
| Private/Non-Correlated | (S + R) / 2 | Real Estate, Private Equity |
| Stocks & Bonds | (L + R) / 2 | Public Markets |

#### 5.4 Actions
- [ ] Share button (Web Share API or clipboard)
- [ ] Retake assessment button
- [ ] Auto-scroll to top on results

### Phase 6: Accredited Investor Questionnaire

#### 6.1 Regulatory Criteria
- [ ] Income threshold question ($200K single / $300K joint)
- [ ] Net worth question ($1M excluding primary residence)
- [ ] Professional certification question
- [ ] Entity qualification question

#### 6.2 Logic Flow
```javascript
// Accredited investor determination
function isAccreditedInvestor(responses) {
    return (
        responses.income >= 200000 ||
        responses.jointIncome >= 300000 ||
        responses.netWorth >= 1000000 ||
        responses.isProfessional === true ||
        responses.isQualifiedEntity === true
    );
}
```

#### 6.3 Results Impact
- [ ] Different allocation recommendations for accredited investors
- [ ] Access to alternative investments
- [ ] Risk tolerance adjustments

### Phase 7: Automated Testing

#### 7.1 Embedded Test Suite
- [ ] Test runner UI element
- [ ] Unit tests for scoring logic
- [ ] Integration tests for navigation
- [ ] Visual regression basics

#### 7.2 Puppeteer Test Files

**puppeteer_test.js** - Single sanity check
- Load page
- Click through assessment
- Verify results display

**puppeteer_100tests.js** - Randomized scenarios
- 100 different answer combinations
- Verify score ranges
- Check triangle positioning

**puppeteer_navtest.js** - Navigation testing
- Forward/backward navigation
- State persistence
- Edge cases

---

## Dependencies

### Node.js Dependencies
```json
{
  "puppeteer": "^21.0.0"
}
```

### Python Dependencies
```
# Standard library only - no pip packages required
# Uses: python3 -m http.server 8000
```

### Browser Requirements
- Modern browsers (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- JavaScript enabled
- localStorage available

---

## Development Timeline

### Day 1: Foundation
- [x] Read specification
- [x] Create project structure
- [x] Create Planning.md
- [ ] Create telos.html skeleton
- [ ] Implement CSS styling

### Day 2: Questionnaire
- [ ] Implement question sections
- [ ] Build navigation system
- [ ] Add state management
- [ ] Test localStorage persistence

### Day 3: Scoring & Visualization
- [ ] Implement scoring engine
- [ ] Create triangle canvas
- [ ] Add animation effects
- [ ] Test coordinate calculations

### Day 4: Results & Features
- [ ] Build results page
- [ ] Implement asset allocation
- [ ] Add share functionality
- [ ] Implement accredited investor flow

### Day 5: Testing & Polish
- [ ] Write Puppeteer tests
- [ ] Add embedded test suite
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Final documentation

---

## Validation Checklist

### Functional Requirements
- [ ] All 15 questions display correctly
- [ ] Progress bar updates accurately
- [ ] Navigation works without errors
- [ ] Scores calculate correctly
- [ ] Triangle renders properly
- [ ] Asset allocation displays correctly
- [ ] Share/retake buttons work
- [ ] Accredited investor logic correct

### Non-Functional Requirements
- [ ] Page loads under 2 seconds
- [ ] Mobile responsive (320px - 1920px)
- [ ] No console errors
- [ ] Accessible (basic ARIA)
- [ ] Works offline after initial load

### Test Coverage
- [ ] 100% of scoring logic tested
- [ ] Navigation edge cases covered
- [ ] Random answer combinations validated
- [ ] Error states handled

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| localStorage unavailable | High | Fallback to sessionStorage or memory |
| Canvas not supported | Medium | Fallback to static image |
| Slow animation | Low | Reduce animation complexity |
| Font loading failure | Low | System font fallbacks |

---

## Maintenance Notes

1. **Adding Questions**: Update question arrays and adjust scoring normalization
2. **Changing Weights**: Modify the barycentric calculation coefficients
3. **Styling Updates**: All CSS is inline - search for specific class names
4. **Test Updates**: Mirror any logic changes in Puppeteer scripts

---

## Glossary

- **Barycentric Coordinates**: A coordinate system where a point is expressed as weights relative to triangle vertices
- **Asset Sleeve**: A category of investment types grouped by risk/return characteristics
- **Accredited Investor**: SEC designation for individuals meeting specific financial criteria
- **Glass-morphism**: UI design trend featuring frosted glass effects with transparency

---

*Last Updated: February 26, 2026*
