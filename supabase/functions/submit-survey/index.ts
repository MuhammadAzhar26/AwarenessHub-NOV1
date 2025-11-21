import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SurveyData {
  timestamp: string
  page: string
  ratings: Record<string, { label: string; rating: number }>
  feedback: string
  email: string
  screenshot: string | null
  userAgent: string
  screenResolution: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const surveyData: SurveyData = await req.json()

    // Calculate average rating
    const ratingsArray = Object.values(surveyData.ratings).map(r => r.rating).filter(r => r > 0)
    const averageRating = ratingsArray.length > 0
      ? ratingsArray.reduce((sum, r) => sum + r, 0) / ratingsArray.length
      : 0

    // Store in database
    const { data: dbData, error: dbError } = await supabase
      .from('survey_responses')
      .insert({
        page: surveyData.page,
        ratings: surveyData.ratings,
        average_rating: averageRating,
        feedback: surveyData.feedback,
        user_email: surveyData.email,
        screenshot_data: surveyData.screenshot,
        user_agent: surveyData.userAgent,
        screen_resolution: surveyData.screenResolution,
        submitted_at: surveyData.timestamp,
      })
      .select()
      .single()

    if (dbError) {
      throw dbError
    }

    // Send email notification
    try {
      await sendEmailNotification(surveyData, averageRating, dbData.id)
    } catch (emailError) {
      console.error('Email notification failed:', emailError)
      // Continue even if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Survey submitted successfully',
        surveyId: dbData.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Survey submission error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

async function sendEmailNotification(
  surveyData: SurveyData,
  averageRating: number,
  surveyId: string
) {
  const emailContent = generateEmailHTML(surveyData, averageRating, surveyId)

  // Using Resend email service
  // IMPORTANT: Change 'from' to 'onboarding@resend.dev' for testing, 
  // or verify your domain at https://resend.com/domains to use your own domain
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'AwarenessHub <onboarding@resend.dev>', // Change after domain verification
      to: ['survey@awarenesshub.app'], // Your receiving email
      subject: `New Feedback: ${surveyData.page} - ${averageRating.toFixed(1)}⭐`,
      html: emailContent,
      attachments: surveyData.screenshot ? [{
        filename: `screenshot-${surveyId}.png`,
        content: surveyData.screenshot.split(',')[1], // Remove data:image/png;base64, prefix
        type: 'image/png',
      }] : [],
    }),
  })

  if (!response.ok) {
    throw new Error(`Email service error: ${response.statusText}`)
  }

  return response.json()
}

function generateEmailHTML(
  surveyData: SurveyData,
  averageRating: number,
  surveyId: string
): string {
  const ratingsHTML = Object.entries(surveyData.ratings)
    .map(([key, { label, rating }]) => {
      const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
      return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${label}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${stars} (${rating}/5)</td>
        </tr>
      `
    })
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
        .rating-summary { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea; }
        .feedback-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; background: white; }
        th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
        th { background: #667eea; color: white; }
        .meta { font-size: 12px; color: #666; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">📊 New Survey Response</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">AwarenessHub User Feedback</p>
        </div>
        
        <div class="content">
          <div class="rating-summary">
            <h2 style="margin: 0 0 10px 0; color: #667eea;">
              Average Rating: ${averageRating.toFixed(1)} ⭐
            </h2>
            <p style="margin: 0;"><strong>Page:</strong> ${surveyData.page}</p>
            <p style="margin: 5px 0 0 0;"><strong>Survey ID:</strong> ${surveyId}</p>
          </div>

          <h3>Detailed Ratings</h3>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              ${ratingsHTML}
            </tbody>
          </table>

          ${surveyData.feedback ? `
            <div class="feedback-box">
              <h3 style="margin-top: 0;">Written Feedback</h3>
              <p style="white-space: pre-wrap;">${surveyData.feedback}</p>
            </div>
          ` : ''}

          ${surveyData.email !== 'anonymous' ? `
            <p><strong>User Email:</strong> <a href="mailto:${surveyData.email}">${surveyData.email}</a></p>
          ` : '<p><em>Submitted anonymously</em></p>'}

          <div class="meta">
            <p><strong>Submitted:</strong> ${new Date(surveyData.timestamp).toLocaleString('en-US', { 
              dateStyle: 'full', 
              timeStyle: 'short' 
            })}</p>
            <p><strong>Browser:</strong> ${surveyData.userAgent}</p>
            <p><strong>Screen:</strong> ${surveyData.screenResolution}</p>
          </div>

          ${surveyData.screenshot ? `
            <p style="margin-top: 20px;"><strong>Screenshot attached</strong> 📸</p>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `
}
