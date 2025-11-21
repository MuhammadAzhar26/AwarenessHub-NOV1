import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
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
      console.error('Missing Supabase configuration');
      return res.status(500).json({
        success: false,
        error: 'Database configuration missing',
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

    console.log('Survey saved to database:', dbData.id);

    return res.status(200).json({
      success: true,
      surveyId: dbData.id,
      message: 'Survey submitted successfully',
    });

  } catch (error) {
    console.error('Survey submission error:', error);
    return res.status(500).json({
      error: 'Failed to submit survey',
      message: error.message,
    });
  }
}
  