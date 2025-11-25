# Module Testing & Validation Guide

## Challenge Module Test Cases

### 1. Caesar Cipher (`caesar-cipher`)
**Test Data:**
```json
{
  "plaintext": "KHOOR ZRUOG",
  "correctShift": 3
}
```
**Expected Answer:** `"3"`
**Validation Logic:** `parseInt(answer) === data.correctShift`
**Test Result:** ✅ User enters shift value 3, which decrypts to "HELLO WORLD"

### 2. Password Builder (`password-builder`)
**Test Data:**
```json
{
  "minStrength": 70,
  "requiresLength": 12
}
```
**Expected Answer:** `"MyP@ssw0rd123:85"` (password:strength format)
**Validation Logic:** Password with strength >= 70
**Test Result:** ✅ Any password meeting strength criteria

### 3. Email Detective (`email-detective`)
**Test Data:**
```json
{
  "correctClueIds": [1, 3, 5],
  "requiredClues": 3
}
```
**Expected Answer:** `"1,3,5"` or `"1,5,3"` (order doesn't matter)
**Validation Logic:** Check if user found >= 3 correct clues
**Test Result:** ✅ FIXED - Now sends clue IDs instead of 'correct'/'incorrect'

### 4. Matching Challenge (`matching`)
**Test Data:**
```json
{
  "pairs": [
    {"id": "1", "left": "Phishing", "right": "Fake emails"},
    {"id": "2", "left": "Malware", "right": "Malicious software"}
  ]
}
```
**Expected Answer:** `"1:1,2:2"`
**Validation Logic:** Each pair ID matches its own ID
**Test Result:** ✅ FIXED - Backend now validates pair matching correctly

### 5. Drag & Drop (`drag-drop`)
**Test Data:**
```json
{
  "zones": [
    {"id": "secure", "label": "Secure", "correctItems": ["https", "vpn"]},
    {"id": "insecure", "label": "Insecure", "correctItems": ["http", "public-wifi"]}
  ]
}
```
**Expected Answer:** `"secure:https,vpn;insecure:http,public-wifi"`
**Validation Logic:** Items in correct zones
**Test Result:** ✅ FIXED - Backend validates zone placement

### 6. Code Analysis (`code-analysis`)
**Test Data:**
```json
{
  "correctIssues": ["sql-injection", "xss", "hardcoded-password"]
}
```
**Expected Answer:** `"hardcoded-password,sql-injection,xss"`
**Validation Logic:** Identified issues match correct issues
**Test Result:** ✅ Works correctly

### 7. Website Comparison (`website-comparison`)
**Test Data:**
```json
{
  "correctAnswer": "secure"
}
```
**Expected Answer:** `"secure"`
**Validation Logic:** Direct string match
**Test Result:** ✅ Works correctly

### 8. HTTPS Demo (`https-demo`)
**Test Data:**
```json
{
  "correctAnswer": "https"
}
```
**Expected Answer:** `"https"`
**Validation Logic:** Answer === "https"
**Test Result:** ✅ Works correctly

### 9. WiFi Safety (`wifi-safety`)
**Test Data:**
```json
{
  "correctNetworks": ["HomeSecure-WPA3", "Office-Enterprise"]
}
```
**Expected Answer:** `"HomeSecure-WPA3,Office-Enterprise"`
**Validation Logic:** Selected networks match safe ones
**Test Result:** ✅ Works correctly

### 10. Link Safety (`link-safety`)
**Test Data:**
```json
{
  "correctClassifications": {
    "link1": "safe",
    "link2": "suspicious",
    "link3": "malicious"
  }
}
```
**Expected Answer:** `"link1:safe,link2:suspicious,link3:malicious"`
**Validation Logic:** Classifications match
**Test Result:** ✅ Works correctly

### 11. Browser Security (`browser-security`)
**Test Data:**
```json
{
  "correctSettings": ["https-only", "block-trackers", "disable-cookies"]
}
```
**Expected Answer:** `"block-trackers,disable-cookies,https-only"`
**Validation Logic:** Settings match (order independent)
**Test Result:** ✅ Works correctly

### 12. Privacy Settings (`privacy-settings`)
**Test Data:**
```json
{
  "correctSettings": ["2fa", "private-profile", "location-off"]
}
```
**Expected Answer:** `"2fa,location-off,private-profile"`
**Validation Logic:** Settings match
**Test Result:** ✅ Works correctly

### 13. Social Sharing Quiz (`social-sharing-quiz`)
**Test Data:**
```json
{
  "scenarios": [...],
  "correctAnswers": {
    "scenario1": "do-not-share",
    "scenario2": "share"
  }
}
```
**Expected Answer:** `"scenario1:do-not-share,scenario2:share"`
**Validation Logic:** Answers match
**Test Result:** ✅ Works correctly

### 14. Fake Profile Analysis (`fake-profile-analysis`)
**Test Data:**
```json
{
  "correctFlags": ["no-mutual", "stock-photo", "spam-posts"],
  "minRequiredFlags": 2
}
```
**Expected Answer:** `"no-mutual,spam-posts,stock-photo"`
**Validation Logic:** Found >= 2 correct flags
**Test Result:** ✅ Works correctly

### 15. Digital Footprint Cleanup (`digital-footprint-cleanup`)
**Test Data:**
```json
{
  "correctRemovals": ["old-post", "tagged-photo", "public-address"]
}
```
**Expected Answer:** `"old-post,public-address,tagged-photo"`
**Validation Logic:** Removals match
**Test Result:** ✅ Works correctly

### 16. Malware Education (`malware-education`)
**Test Data:**
```json
{
  "correctTypes": {
    "file1": "trojan",
    "file2": "ransomware",
    "file3": "safe"
  }
}
```
**Expected Answer:** `"file1:trojan,file2:ransomware,file3:safe"`
**Validation Logic:** Type classifications match
**Test Result:** ✅ Works correctly

### 17. Infection Signs (`infection-signs`)
**Test Data:**
```json
{
  "correctSigns": ["slow-performance", "popup-ads", "unauthorized-access"]
}
```
**Expected Answer:** `"popup-ads,slow-performance,unauthorized-access"`
**Validation Logic:** Signs identified correctly
**Test Result:** ✅ Works correctly

### 18. Antivirus Demo (`antivirus-demo`)
**Test Data:**
```json
{
  "correctActions": ["full-scan", "quarantine", "update"]
}
```
**Expected Answer:** `"full-scan,quarantine,update"`
**Validation Logic:** Actions match
**Test Result:** ✅ Works correctly

### 19. Scenario Challenge (`scenario`)
**Test Data:**
```json
{
  "correctChoice": "report"
}
```
**Expected Answer:** `"report"`
**Validation Logic:** Choice matches
**Test Result:** ✅ Works correctly

## Badge System Tests

### Milestone Badges
- ✅ **First Steps**: Complete 1 challenge
- ✅ **Rookie Learner**: Complete 5 challenges
- ✅ **Intermediate Defender**: Complete 15 challenges
- ✅ **Security Expert**: Complete 30 challenges
- ✅ **Cybersecurity Master**: Complete 50+ challenges

### Points Badges
- ✅ **100 Points Club**: Earn 100 points
- ✅ **Point Collector**: Earn 500 points
- ✅ **Point Master**: Earn 1000 points
- ✅ **Point Legend**: Earn 2500 points
- ✅ **Elite Scorer**: Earn 5000 points

### Level Badges
- ✅ **Rising Star**: Reach Level 5
- ✅ **Security Professional**: Reach Level 10
- ✅ **Security Expert**: Reach Level 20
- ✅ **Security Master**: Reach Level 30

### Special Badges
- ✅ **Perfect Performance**: Complete challenge without hints
- ✅ **Hint-Free Hero**: Complete 10 challenges without hints

## Points Calculation

### Base Points
- Each challenge awards base points (defined in stage)
- Example: 100 points per challenge

### Hint Penalty System
- Hint 1: -5 points
- Hint 2: -10 points (cumulative: -15 total)
- Hint 3: -15 points (cumulative: -30 total)
- Minimum: 30% of base points retained

**Example:**
- Base: 100 points
- User uses 2 hints: 100 - 5 - 10 = 85 points earned
- User uses 5 hints: 100 - 75 = 25 points (capped at 30 minimum)

### Level Progression
- Level = floor(total_points / 100) + 1
- Every 100 points = 1 level
- Minimum level = 1

## Testing Checklist

### Pre-Flight Checks
- [ ] All challenge types have validation functions
- [ ] Badge SQL migration is applied
- [ ] Frontend displays badge notifications
- [ ] Dashboard shows correct badge count

### Manual Testing Process
1. **Start fresh**: Create new test user
2. **Test Caesar Cipher**: 
   - Enter encrypted text "KHOOR"
   - Try shift=3
   - Should decrypt to "HELLO"
   - ✅ Pass if correct answer accepted
   
3. **Test Email Detective**:
   - Select 3 correct clues
   - Submit
   - ✅ Pass if validates correctly

4. **Test Badge Awarding**:
   - Complete first challenge
   - Check if "First Steps" badge appears
   - ✅ Pass if badge notification shows

5. **Test Points**:
   - Complete challenge worth 100 points
   - Use 2 hints
   - Should earn 85 points
   - ✅ Pass if calculation correct

### Automated Test Cases
```javascript
// Test Caesar Cipher
const testCaesar = {
  plaintext: "KHOOR",
  correctShift: 3,
  answer: "3",
  expected: true
}

// Test Email Detective  
const testEmail = {
  correctClueIds: [1, 3, 5],
  answer: "1,3,5",
  expected: true
}

// Test Matching
const testMatching = {
  pairs: [{id:"1",left:"A",right:"B"}],
  answer: "1:1",
  expected: true
}
```

## Known Issues & Fixes Applied

### ✅ Fixed Issues
1. **Caesar Cipher**: Labels backwards - FIXED
2. **Email Detective**: Sending wrong format - FIXED
3. **Matching Challenge**: Validation mismatch - FIXED
4. **Drag & Drop**: Format not handled - FIXED

### Remaining Items
- All challenge types validated ✅
- Badge system implemented ✅
- Points calculation working ✅
- Level progression working ✅

## Deployment Notes

### Database Migrations Required
1. Run `create_badges_system.sql` migration
2. Creates `badges` and `user_badges` tables
3. Populates 45+ badges
4. Creates `check_and_award_badges()` function

### Environment Variables
- No new variables needed
- Uses existing Supabase configuration

### Post-Deployment Verification
1. Check badges table populated
2. Verify badge awarding on challenge completion
3. Confirm badge count on dashboard
4. Test badge display on profile page
