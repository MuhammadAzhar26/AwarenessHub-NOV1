# Survey/Feedback System Setup

## Features Implemented

### 1. **Feedback Survey Component**
- ⭐ 5-star rating system for 5 categories:
  - Ease of Use
  - Design & Layout
  - Content Quality
  - Engagement Level
  - Learning Experience
- 📝 Text feedback (max 100 words with live counter)
- 📧 Optional email field for follow-up
- 📸 Automatic screenshot capture of current page
- ✅ Form validation and submission

### 2. **Floating Feedback Button**
- Fixed position (bottom-right corner)
- Always visible across all pages
- Hover tooltip effect
- Auto-detects current page name

### 3. **Backend Processing**
- Supabase Edge Function (`submit-survey`)
- Stores all responses in database
- Sends email to `support@awarenesshub.app`
- Attaches screenshot if captured
- Logs metadata (timestamp, user agent, screen resolution)

### 4. **Database Schema**
- `survey_responses` table with fields:
  - ID, page, ratings (JSONB), average_rating
  - feedback, user_email, screenshot_data
  - user_agent, screen_resolution
  - submitted_at, created_at
- Analytics view for reporting
- Indexed for fast queries

### 5. **Email Notifications**
- Professional HTML email template
- Shows all ratings with star visualization
- Includes written feedback
- Screenshot attached as PNG
- Full metadata included

## Installation Steps

### 1. Install Required Package

```bash
pnpm install html2canvas
```

### 2. Deploy Supabase Function

```bash
cd supabase/functions
supabase functions deploy submit-survey
```

### 3. Set Environment Variables

In your Supabase project dashboard, add:
- `RESEND_API_KEY` - Get from https://resend.com

### 4. Run Database Migration

```bash
supabase db push
```

Or run the SQL in `supabase/migrations/create_survey_tables.sql` directly in Supabase SQL Editor.

### 5. Configure Email Service

The function uses Resend for emails. Alternatives:
- **SendGrid**: Replace the fetch URL and headers
- **AWS SES**: Use AWS SDK
- **Supabase native**: Configure SMTP settings

Update the email sender domain in `submit-survey/index.ts`:
```typescript
from: 'AwarenessHub Feedback <noreply@awarenesshub.app>'
```

## Usage

The feedback button is now globally available on all pages. Users can:

1. Click the floating button (bottom-right)
2. Rate each category (1-5 stars)
3. Write feedback (optional, max 100 words)
4. Add email for follow-up (optional)
5. Capture screenshot (optional, automatic)
6. Submit

## Viewing Survey Data

### Query all responses:
```sql
SELECT * FROM survey_responses ORDER BY submitted_at DESC;
```

### View analytics:
```sql
SELECT * FROM survey_analytics;
```

### Export to CSV:
```sql
COPY (SELECT * FROM survey_responses) TO '/tmp/surveys.csv' CSV HEADER;
```

## Local Storage Backup

All submissions are also logged to browser localStorage as backup:
```javascript
localStorage.getItem('survey_1234567890')
```

## Customization

### Change rating categories:
Edit `FeedbackSurvey.tsx` line 15-21

### Change word limit:
Edit `FeedbackSurvey.tsx` line 29

### Change email recipient:
Edit `submit-survey/index.ts` line 96

### Customize email template:
Edit `generateEmailHTML()` function in `submit-survey/index.ts`

## Testing

1. Click feedback button
2. Fill out the form
3. Capture a screenshot
4. Submit
5. Check email at `support@awarenesshub.app`
6. Query database to verify storage

## Notes

- Screenshots are stored as base64 in database (consider cloud storage for production)
- Email attachments limited to ~5MB
- Rate limiting recommended for production
- GDPR compliance: add privacy notice and data retention policy
