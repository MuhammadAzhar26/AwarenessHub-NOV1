import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const surveyData = req.body;
    console.log('Received survey data:', { page: surveyData.page, timestamp: surveyData.timestamp });

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing env vars:', { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseKey 
      });
      
      // Still save locally even if backend is not configured
      return res.status(200).json({
        success: true,
        message: 'Survey received (database not configured)',
        surveyId: `local-${Date.now()}`,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate average rating
    const ratingsArray = Object.values(surveyData.ratings).map((r: any) => r.rating).filter((r: number) => r > 0);
    const averageRating = ratingsArray.length > 0
      ? ratingsArray.reduce((sum: number, r: number) => sum + r, 0) / ratingsArray.length
      : 0;

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
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Send email via Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'AwarenessHub Feedback <onboarding@resend.dev>',
            to: ['survey@awarenesshub.app'],
            subject: `New Feedback: ${surveyData.page} - ${averageRating.toFixed(1)}⭐`,
            html: generateEmailHTML(surveyData, averageRating, dbData.id),
            attachments: surveyData.screenshot ? [{
              filename: `screenshot-${dbData.id}.png`,
              content: surveyData.screenshot.split(',')[1],
            }] : [],
          }),
        });

        if (!emailResponse.ok) {
          console.error('Email sending failed:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Email error (non-critical):', emailError);
        // Don't fail the request if email fails
      }
    }

    return res.status(200).json({
      success: true,
      surveyId: dbData.id,
      message: 'Survey submitted successfully',
    });

  } catch (error: any) {
    console.error('Survey submission error:', error);
    return res.status(500).json({
      error: 'Failed to submit survey',
      message: error.message,
    });
  }
}

function generateEmailHTML(surveyData: any, averageRating: number, surveyId: string): string {
  const ratingsHTML = Object.entries(surveyData.ratings)
    .map(([key, value]: [string, any]) => {
      const stars = '⭐'.repeat(value.rating) + '☆'.repeat(5 - value.rating);
      return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${value.label}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${stars} (${value.rating}/5)</td>
        </tr>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Survey Feedback</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(to right, #2563eb, #9333ea); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">New Feedback Received</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Survey ID: ${surveyId}</p>
      </div>
      
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="color: #1f2937; margin-top: 0;">Survey Details</h2>
        
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Page:</td>
            <td style="padding: 8px 0;">${surveyData.page}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Average Rating:</td>
            <td style="padding: 8px 0;">${averageRating.toFixed(2)}/5 ${'⭐'.repeat(Math.round(averageRating))}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Timestamp:</td>
            <td style="padding: 8px 0;">${new Date(surveyData.timestamp).toLocaleString()}</td>
          </tr>
          ${surveyData.email !== 'anonymous' ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0;">${surveyData.email}</td>
          </tr>
          ` : ''}
        </table>

        <h3 style="color: #1f2937; margin-bottom: 10px;">Ratings</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #e5e7eb;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Category</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Rating</th>
            </tr>
          </thead>
          <tbody>
            ${ratingsHTML}
          </tbody>
        </table>

        ${surveyData.feedback ? `
        <h3 style="color: #1f2937; margin-bottom: 10px;">Feedback</h3>
        <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
          <p style="margin: 0; white-space: pre-wrap;">${surveyData.feedback}</p>
        </div>
        ` : ''}

        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          <p style="margin: 5px 0;"><strong>Browser:</strong> ${surveyData.userAgent}</p>
          <p style="margin: 5px 0;"><strong>Screen:</strong> ${surveyData.screenResolution}</p>
        </div>
      </div>
      
      <div style="background: #f3f4f6; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280;">
        <p style="margin: 0;">This is an automated message from AwarenessHub Feedback System</p>
      </div>
    </body>
    </html>
  `;
}
