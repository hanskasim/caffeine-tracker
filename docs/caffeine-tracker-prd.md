# Caffeine Tracker App - Product Requirements Document

## Overview
A mobile/web app to track caffeine intake and spending, helping users understand their consumption habits, budget impact, and potential effects on sleep patterns.

---

## Problem Statement
Users are:
- Drinking too much caffeine without realizing it (health concern)
- Spending significant money on coffee/tea/energy drinks without awareness (budget concern)
- Potentially drinking caffeine too late in the day, affecting sleep quality

---

## Target Users
1. People with caffeine sensitivity (anxiety, jitters, sleep issues)
2. Budget-conscious individuals tracking spending
3. Health-conscious folks trying to moderate intake
4. Anyone curious about their consumption patterns

---

## Core Value Proposition
**Health + Budget tracking in one place** - see both how much caffeine you're consuming AND how much money you're spending, with time-of-day insights to understand sleep impact.

---

## MVP Features (Phase 1)

### 1. Manual Drink Logging
**Fields to capture:**
- Drink type (coffee, tea, energy drink, boba)
- Drink name (e.g., "Iced Latte", "Matcha", "Red Bull")
- Caffeine amount (in mg)
- Cost (in $)
- Time of consumption (auto-populated with current time, editable)
- Location (optional)

**UX Requirements:**
- Quick entry (target: <30 seconds to log)
- Recent/favorite drinks for one-tap logging
- Simple, clean interface

### 2. Location Entry with Smart Autocomplete
**Implementation:**
- Text input field for location
- Google Places API autocomplete as user types
- Results show business names (e.g., "Starbucks", "Nook Cafe")
- User can select from dropdown OR continue typing custom location
- Saves previously used locations for quick access
- Location field is **optional** - no requirement to fill

**Technical Notes:**
- Google Places API - Autocomplete service
- No device location permission needed
- Can optionally bias results to user's region in API settings
- Cache frequently visited places locally

### 3. Daily Dashboard
**Displays:**
- Total caffeine consumed today (mg) with visual indicator
- Total money spent today ($)
- Timeline of drinks consumed (with times)
- Warning indicator if over recommended daily limit (400mg for adults)

### 4. Stats & Insights
**Weekly/Monthly views showing:**
- Total caffeine consumption over time
- Total spending over time
- Most expensive drinks
- Peak caffeine times (when you typically drink)
- Average daily caffeine/spending

### 5. Data Persistence
- All drink logs saved locally
- Data persists between sessions
- Export capability (CSV or similar)

---

## Phase 2 Features (Post-MVP)

### Location-Based Features
**Most Visited Coffee Shops:**
- Rank locations by frequency
- Spending per location ("You've spent $47 at Starbucks this week")
- Location analytics

**Drink Reviews/Ratings:**
- Rate drinks 1-5 stars
- Add notes/reviews
- View history: "You've tried 8 drinks at Blue Bottle, here's how you ranked them"
- Favorites list

### Enhanced Notifications
- Daily reminder to log (if user hasn't logged anything)
- Warning notifications ("You've had 350mg already today")
- Bedtime caffeine alerts ("You had coffee at 7pm - might affect sleep")

### Expanded Tracking
- Water intake tracking (healthy habits bundle)
- Mood correlation (did caffeine affect anxiety/energy?)
- Sleep quality tracking (manual input, or later: integrate with health apps)

---

## Phase 3 Features (Future Vision)

### Gamification - Character Evolution
**Concept:**
- Virtual character/pet that evolves based on drink consumption
- Similar to Tamagotchi or Pokémon evolution
- Character grows/evolves at milestones (5 drinks, 10 drinks, 50 drinks, etc.)

**Design Considerations:**
- Should it encourage moderation (healthy character vs overcaffeinated/jittery character)?
- Or just grow with any consumption?
- Different evolution paths based on drink types?
- Character could have different states: energized, sleepy, jittery, balanced

**MVP approach:** Make drinks themselves into cute characters/mascots first before full gamification

### Payment Integration
**Apple Pay Integration:**
- Connect to bank via Plaid/similar aggregator
- Detect coffee shop purchases via merchant name/category
- Send push notification: "We see you spent $6.50 at Starbucks - log your drink?"
- Challenge: Can't tell WHAT was purchased (could be food, not coffee)

**Venmo Integration:**
- Monitor Venmo payment descriptions
- If description includes coffee/tea/boba keywords, trigger notification
- Requires Venmo API approval
- Privacy considerations

**Technical Notes:**
- Both require significant security/compliance work
- Financial API integration = Phase 3 complexity
- Better to nail manual logging UX first

**Alternative (easier):** 
- Siri shortcuts integration ("Hey Siri, log my coffee")
- Apple Watch quick log button
- Widget for home screen logging

### Social Features
- Share stats with friends
- Compare spending/consumption
- Coffee shop recommendations from friends
- "Coffee run" coordination

---

## Technical Implementation Notes

### Tech Stack (Suggested)
- **Frontend:** React (web) or React Native (mobile)
- **Storage:** Local storage for MVP, cloud database for sync later
- **APIs:** Google Places Autocomplete API
- **Deployment:** Web app first (claude.ai artifact), native app later

### Google Places API
- **Service needed:** Places Autocomplete
- **Cost:** Free tier covers personal use (pricing after free tier is very reasonable)
- **Implementation:** Trigger on text input, debounce requests to avoid excessive API calls
- **Caching:** Save user's frequent locations locally

### Data Model (Basic)
```
Drink Entry:
- id (unique)
- type (coffee/tea/energy_drink/boba)
- name (string)
- caffeine_mg (number)
- cost (number)
- timestamp (datetime)
- location (string, optional)
- rating (number, Phase 2)
- notes (string, Phase 2)
```

---

## Success Metrics

### MVP Success Criteria:
- User logs at least 3 drinks in first week
- User returns to app at least 3 days in first week
- User finds value in weekly spending/caffeine summary

### Long-term Metrics:
- Daily active users
- Retention rate (7-day, 30-day)
- Average drinks logged per week
- Feature usage (location tracking, ratings, etc.)

---

## Open Questions / Decisions Needed

1. **Platform priority:** Web app first or mobile app?
2. **Monetization:** Free with ads? Freemium? One-time purchase? (Consider later)
3. **Health warnings:** How aggressive should caffeine limit warnings be?
4. **Default caffeine values:** Should we provide a database of common drinks with pre-filled caffeine amounts?
5. **Character design:** If going gamification route, what's the visual style?

---

## User Flow (MVP)

### First Time User:
1. Opens app
2. Brief onboarding (optional): "Track your caffeine and spending"
3. Lands on main dashboard (empty state)
4. Prominent "+" button to add first drink

### Logging a Drink:
1. Tap "+" button
2. Form appears:
   - Select drink type (visual icons: ☕🍵⚡🧋)
   - Enter drink name
   - Enter caffeine amount (mg)
   - Enter cost ($)
   - (Optional) Enter/search location
   - Time auto-filled (editable)
3. Tap "Save"
4. Returns to dashboard with updated stats

### Viewing Stats:
1. Dashboard shows today's summary
2. Swipe/tab to view weekly/monthly views
3. See timeline of drinks
4. View spending and caffeine graphs

---

## Design Principles

1. **Speed:** Logging should be fast and frictionless
2. **Clarity:** Stats should be immediately understandable
3. **Non-judgmental:** Inform, don't shame users about consumption
4. **Delightful:** Use playful design elements (character mascots, etc.)
5. **Privacy-first:** Data stays local unless user opts into cloud sync

---

## Design Direction & Visual Identity

### Design Philosophy
**"Playful Energy Tracker"** - The app should feel warm, friendly, and motivating rather than clinical or judgmental. Users are tracking a habit they enjoy (coffee/tea) even while being mindful of health and budget.

### Color Palette
**Primary:** Warm amber/orange gradient (coffee/energy vibes)
- Amber-50 to Rose-50 for backgrounds (soft, welcoming)
- Amber-500 to Orange-500 for primary actions
- Green accents for money/spending (positive association)
- Purple/Blue for sleep-related warnings (calming but attention-getting)
- Red only for critical warnings (over caffeine limit)

**Avoid:** Generic purple gradients, pure white backgrounds, cold blue tones

### Typography
- **Display/Headers:** Georgia or similar serif (warmth, approachability, coffee shop menu vibes)
- **Body:** Clean sans-serif, but NOT Inter/Roboto/Arial
- **Numbers/Stats:** Bold, prominent - make the data feel important
- Font sizes should be generous - this is mobile-first

### Character Design (Mascot)
**MVP Approach:** Use emoji characters that evolve
- 😴 Empty state / no drinks yet
- 🙂 1-2 drinks (getting energized)
- 😊 3-5 drinks (happy, energized)
- 😵 6+ or >400mg (overcaffeinated, jittery)

**Future Evolution:** Custom illustrated character
- Simple, round, friendly design (think Tamagotchi meets coffee bean)
- Should look energetic but not hyperactive
- Multiple evolution states with distinct personalities
- Could have accessories/outfits based on drink types
- Animation: subtle bounce, steam effects, sparkles

**Character Growth Mechanic:**
- Size increases with drink count (visual feedback)
- Badge/counter shows total drinks logged
- Expression changes based on caffeine levels
- Potential: Different characters for different drink preferences (coffee bean vs tea leaf vs energy bolt)

### UI Components

**Primary Action Button ("Log a Drink"):**
- MUST be first thing user sees - top of screen
- Large, prominent, gradient background
- Animation on tap (scale effect)
- Always accessible (could also be floating button on other views)

**Stat Cards:**
- Rounded corners (friendly, modern)
- Subtle shadows for depth
- Icon + label + large number + context
- Progress bars should be satisfying (smooth animations)
- Color-coded: amber for caffeine, green for money

**Drink Timeline:**
- Card-based layout with emoji icons
- Show time, location, cost, caffeine at a glance
- Hover/tap effects for interactivity
- Newest drinks at top
- Empty state should be encouraging, not guilt-inducing

**Warnings/Alerts:**
- Not aggressive or scary
- Use friendly language: "Late caffeine alert!" vs "WARNING"
- Moon emoji 🌙 for sleep warnings
- Keep them informative, not preachy

### Animations & Micro-interactions
- **Page load:** Stagger-fade content in (mascot → stats → drinks)
- **Logging drink:** Celebration animation (confetti? sparkles?)
- **Mascot:** Subtle idle animation (gentle bounce, blink)
- **Stats update:** Number count-up animation
- **Button presses:** Scale/bounce feedback
- **Progress bars:** Smooth fill animations

### Layout Principles
- **Mobile-first:** Optimized for one-handed use
- **Clear hierarchy:** Primary action → Key stats → Details
- **Generous spacing:** Don't cram information
- **Thumb-friendly:** Important buttons in easy-reach zones
- **Scrollable content:** Timeline can be long, that's okay

### Empty States
- **No drinks today:** Encouraging mascot + "Ready for your first sip?"
- **No stats yet:** "Start logging to see your patterns!"
- **First-time user:** Brief, friendly onboarding (skippable)

### Design References for Inspiration
- Duolingo (gamification, friendly mascot, progress tracking)
- Headspace (calm colors, approachable wellness)
- Mint/YNAB (budget tracking that doesn't feel shameful)
- Pokémon Go (evolution mechanic, collection aspect)
- Instagram Stories (quick logging, visual timeline)

### Accessibility Considerations
- High contrast for text readability
- Large touch targets (minimum 44x44px)
- Clear labels and iconography
- Color not the only indicator (use icons + text)
- Support for larger text sizes

### Platform-Specific Notes
- **iOS:** Rounded corners, smooth animations, haptic feedback
- **Android:** Material Design influences, floating action button
- **Web:** Responsive breakpoints, keyboard shortcuts

---

## Next Steps

1. ✅ Document features and requirements (this doc)
2. Build MVP:
   - Create main dashboard UI
   - Implement drink logging form
   - Add Google Places autocomplete
   - Build stats/insights views
   - Implement local data storage
3. Test with real usage (dogfooding)
4. Iterate based on feedback
5. Plan Phase 2 features

---

## Notes from Ideation Session

- User need is niche but real - combines health + budget motivations
- Financial pain point is very tangible ("$200/month on coffee?!")
- Time tracking adds sleep impact insight
- Gamification could help retention but should encourage healthy behavior
- Location features add depth (most visited shops, reviews)
- Payment integration is cool but Phase 3 complexity
- Focus on making manual logging super smooth for MVP
- Opt-in approach to any permissions (location, notifications)
