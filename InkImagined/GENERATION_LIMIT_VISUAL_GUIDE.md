# 📊 Generation Limit Feature - Visual Guide

## How It Looks to Users

### State 1: Plenty of Generations Left (5-2 remaining)
```
┌─────────────────────────────────────────────────────┐
│ ✨ 5 Generations Left Today                         │
│                                                      │
│ You can generate 5 more AI artworks today.         │
│ This helps us manage costs while you perfect        │
│ your creation.                                       │
│                                                      │
│ ████░░░░░░░░░░░░░░░░░░  0 / 5 used                 │
│                                        Resets 12:00 AM│
└─────────────────────────────────────────────────────┘
```
- **Color**: Blue background
- **Icon**: ✨ Sparkles
- **Mood**: Encouraging

### State 2: Running Low (1 remaining)
```
┌─────────────────────────────────────────────────────┐
│ ⚠️ 1 Generation Left Today                          │
│                                                      │
│ You can generate 1 more AI artwork today.          │
│ This helps us manage costs while you perfect        │
│ your creation.                                       │
│                                                      │
│ ████████████████████░░  4 / 5 used                 │
│                                        Resets 12:00 AM│
└─────────────────────────────────────────────────────┘
```
- **Color**: Orange background
- **Icon**: ⚠️ Warning
- **Mood**: Cautionary

### State 3: Limit Reached (0 remaining)
```
┌─────────────────────────────────────────────────────┐
│ 🚫 Daily Limit Reached                              │
│                                                      │
│ You've used all 5 daily generations.               │
│ Resets at midnight.                                  │
│                                                      │
│ ████████████████████████  5 / 5 used               │
│                                        Resets 12:00 AM│
├─────────────────────────────────────────────────────┤
│ 💡 Tip: Want unlimited generations?                 │
│ • Upgrade to Pro (coming soon!)                     │
│ • Or wait until midnight for your limit to reset   │
└─────────────────────────────────────────────────────┘
```
- **Color**: Red background
- **Icon**: 🚫 Prohibited
- **Mood**: Blocked with upgrade path

## Button States

### Normal State
```
┌─────────────────────────────────┐
│     ✨ Generate AI Art          │
└─────────────────────────────────┘
```
- Gradient background (orange)
- Enabled and clickable
- Hover effects active

### Generating State
```
┌─────────────────────────────────┐
│  ⟳  Generating...               │
└─────────────────────────────────┘
```
- Spinning animation
- Button disabled
- Loading state

### Limit Reached State
```
┌─────────────────────────────────┐
│  🚫 Daily Limit Reached          │
└─────────────────────────────────┘
```
- Gray background
- Disabled cursor
- No hover effects

## Error Banner (When Limit Hit)
```
╔═════════════════════════════════════════════════════╗
║ 🚫  Generation Limit Reached                        ║
║                                                      ║
║ You've used all 5 generations today.               ║
║ Resets at midnight.                                  ║
╚═════════════════════════════════════════════════════╝
```
- Appears above the theme selector
- Red border and background
- Auto-scrolls into view
- Dismissible (clears on page refresh)

## User Journey Visualization

```
Day 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9:00 AM  │ User signs in
         │ Status: "5 generations left" [✨]
         │
10:00 AM │ Generates Studio Ghibli version
         │ Status: "4 generations left" [✨]
         │ Response: ✅ Success + image
         │
10:15 AM │ Not happy, tries Pixar version
         │ Status: "3 generations left" [✨]
         │ Response: ✅ Success + image
         │
10:30 AM │ Tries Cowboy Bebop version
         │ Status: "2 generations left" [✨]
         │ Response: ✅ Success + image
         │
11:00 AM │ Tries Lo-Fi version
         │ Status: "1 generation left" [⚠️]
         │ Response: ✅ Success + image
         │
11:15 AM │ Tries Spider-Verse version
         │ Status: "0 generations left" [🚫]
         │ Response: ✅ Success + image
         │
11:30 AM │ Wants to try again with different photo
         │ Status: "0 generations left" [🚫]
         │ Response: ❌ Error 429 - Daily limit reached
         │ Shows: Red error banner
         │ Button: Disabled

Day 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
12:00 AM │ (Midnight - counter resets automatically)
         │
9:00 AM  │ User returns
         │ Status: "5 generations left" [✨]
         │ Fresh start! Can generate again
```

## Database State Changes

```
Initial State (New User)
┌─────────────────────────────────────────┐
│ user_generation_limits                  │
├─────────────────────────────────────────┤
│ (No record exists)                      │
└─────────────────────────────────────────┘

After First Generation (Auto-created)
┌─────────────────────────────────────────┐
│ user_generation_limits                  │
├─────────────────────────────────────────┤
│ user_id: abc-123                        │
│ generations_today: 1                    │
│ last_reset_date: 2025-02-04            │
│ total_generations: 1                    │
└─────────────────────────────────────────┘

After 5 Generations (Limit Reached)
┌─────────────────────────────────────────┐
│ user_generation_limits                  │
├─────────────────────────────────────────┤
│ user_id: abc-123                        │
│ generations_today: 5  ← AT LIMIT        │
│ last_reset_date: 2025-02-04            │
│ total_generations: 5                    │
└─────────────────────────────────────────┘

Next Day (Auto-reset on first generation)
┌─────────────────────────────────────────┐
│ user_generation_limits                  │
├─────────────────────────────────────────┤
│ user_id: abc-123                        │
│ generations_today: 1  ← RESET TO 1      │
│ last_reset_date: 2025-02-05 ← NEW DATE │
│ total_generations: 6  ← LIFETIME COUNT  │
└─────────────────────────────────────────┘
```

## API Response Examples

### Success (With Remaining Count)
```json
{
  "success": true,
  "image": {
    "id": "uuid-123",
    "generated_url": "https://...",
    "theme": "studio-ghibli"
  },
  "generationsRemaining": 3,
  "dailyLimit": 5
}
```

### Error (Limit Reached)
```json
{
  "error": "Daily generation limit reached",
  "message": "You've used all 5 generations today. Resets at midnight.",
  "limit": 5,
  "remaining": 0
}
```
HTTP Status: **429 Too Many Requests**

### Limits Check Endpoint
```json
GET /api/limits

Response:
{
  "dailyLimit": 5,
  "used": 3,
  "remaining": 2,
  "totalGenerations": 47,
  "resetsAt": "2025-02-05T00:00:00.000Z"
}
```

## Mobile vs Desktop Display

### Desktop
```
┌────────────────────────────────────────────────────────────┐
│  [✨ Icon]  3 Generations Left Today                       │
│                                                             │
│  You can generate 3 more AI artworks today. This helps us │
│  manage costs while you perfect your creation.             │
│                                                             │
│  ████████████░░░░░░░░  2 / 5 used    Resets 12:00 AM      │
└────────────────────────────────────────────────────────────┘
```

### Mobile (Stacked Layout)
```
┌───────────────────────────────┐
│ [✨]  3 Generations Left      │
│                                │
│ You can generate 3 more AI    │
│ artworks today.                │
│                                │
│ ████████████░░░░░░░░          │
│ 2 / 5 used                     │
│ Resets 12:00 AM                │
└───────────────────────────────┘
```

## Color Coding System

### Progress Bar Colors
```
5-2 remaining: ████████ Blue (#3B82F6)
1 remaining:   ████████ Orange (#F97316)  
0 remaining:   ████████ Red (#EF4444)
```

### Background Colors
```
5-2 remaining: Light Blue (#EFF6FF)
1 remaining:   Light Orange (#FFF7ED)
0 remaining:   Light Red (#FEF2F2)
```

### Border Colors
```
5-2 remaining: Medium Blue (#BFDBFE)
1 remaining:   Medium Orange (#FED7AA)
0 remaining:   Medium Red (#FECACA)
```

## Tips for Users

The component shows helpful context:

**Early in limit:**
> "This helps us manage costs while you perfect your creation."

**At limit with upgrade path:**
> "💡 Tip: Want unlimited generations?
> • Upgrade to Pro (coming soon!)
> • Or wait until midnight for your limit to reset"

This creates awareness and plants the seed for future monetization! 🌱
