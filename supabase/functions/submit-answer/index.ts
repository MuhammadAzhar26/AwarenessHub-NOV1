import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4'

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const { stageId, userId, answer, timeSpent, hintsUsed } = await req.json()

    if (!userId) {
      // Get user ID from auth header if not provided
      const authHeader = req.headers.get('authorization')
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '')
        // For now, we'll need user ID in the request body
        // This would need proper JWT verification in production
      }
    }

    if (!stageId || !userId || answer === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Missing Supabase configuration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false
      }
    })

    // Get stage details
    const { data: stage, error: stageError } = await supabaseClient.from('stages')
      .select('id,challenge_type,challenge_data,points,module_id')
      .eq('id', stageId)
      .single()

    if (stageError || !stage) {
      return new Response(
        JSON.stringify({ error: 'Stage not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate answer based on challenge type
    let isCorrect = false
    let earnedPoints = 0

    switch (stage.challenge_type) {
      case 'matching':
        isCorrect = validateMatching(answer, stage.challenge_data)
        break
      case 'scenario':
        isCorrect = validateScenario(answer, stage.challenge_data)
        break
      case 'drag-drop':
        isCorrect = validateDragDrop(answer, stage.challenge_data)
        break
      case 'code-analysis':
        isCorrect = validateCodeAnalysis(answer, stage.challenge_data)
        break
      case 'caesar-cipher':
        isCorrect = validateCaesarCipher(answer, stage.challenge_data)
        break
      case 'password-builder':
        isCorrect = validatePasswordBuilder(answer, stage.challenge_data)
        break
      case 'email-detective':
        isCorrect = validateEmailDetective(answer, stage.challenge_data)
        break
      case 'website-comparison':
        isCorrect = validateWebsiteComparison(answer, stage.challenge_data)
        break
      case 'https-demo':
        isCorrect = validateHTTPSDemo(answer, stage.challenge_data)
        break
      case 'wifi-safety':
        isCorrect = validateWiFiSafety(answer, stage.challenge_data)
        break
      case 'link-safety':
        isCorrect = validateLinkSafety(answer, stage.challenge_data)
        break
      case 'browser-security':
        isCorrect = validateBrowserSecurity(answer, stage.challenge_data)
        break
      case 'privacy-settings':
        isCorrect = validatePrivacySettings(answer, stage.challenge_data)
        break
      case 'social-sharing-quiz':
        isCorrect = validateSocialSharingQuiz(answer, stage.challenge_data)
        break
      case 'fake-profile-analysis':
        isCorrect = validateFakeProfileAnalysis(answer, stage.challenge_data)
        break
      case 'digital-footprint-cleanup':
        isCorrect = validateDigitalFootprintCleanup(answer, stage.challenge_data)
        break
      case 'malware-education':
        isCorrect = validateMalwareEducation(answer, stage.challenge_data)
        break
      case 'infection-signs':
        isCorrect = validateInfectionSigns(answer, stage.challenge_data)
        break
      case 'antivirus-demo':
        isCorrect = validateAntivirusDemo(answer, stage.challenge_data)
        break
      case 'text':
      default:
        isCorrect = answer.trim().toLowerCase() === stage.challenge_data?.correctAnswer?.toLowerCase()
    }

    if (isCorrect) {
      // Calculate hint penalty: 5 points per hint (progressive: hint 1=5, hint 2=10, hint 3=15)
      const hintPenalty = (hintsUsed || []).reduce((sum: number, h: number) => sum + (h * 5), 0)
      const basePoints = stage.points
      earnedPoints = Math.max(basePoints - hintPenalty, Math.floor(basePoints * 0.3)) // Minimum 30% of points
      
      // Enhanced feedback message with hint breakdown
      if (hintPenalty > 0) {
        const hintCount = hintsUsed?.length || 0
        console.log(`Hint penalty applied: ${hintCount} hints used, ${hintPenalty} points deducted, ${earnedPoints} points earned`)
      }
    }

    // Upsert user progress (create if doesn't exist, update if it does)
    const { error: progressError } = await supabaseClient
      .from('user_progress')
      .upsert({
        user_id: userId,
        stage_id: stageId,
        status: isCorrect ? 'completed' : 'in_progress',
        completed_at: isCorrect ? new Date().toISOString() : null,
        points_earned: isCorrect ? earnedPoints : 0,
        hints_used: hintsUsed || [],
        time_spent: timeSpent || 0
      }, {
        onConflict: 'user_id,stage_id'
      })

    if (progressError) {
      console.error('Failed to update user progress:', progressError)
      return new Response(
        JSON.stringify({ error: 'Failed to update progress', details: progressError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update user total score if correct
    if (isCorrect && earnedPoints > 0) {
      // First, get or create user profile
      const { data: profile, error: profileFetchError } = await supabaseClient
        .from('user_profiles')
        .select('id, total_points')
        .eq('user_id', userId)
        .maybeSingle()

      if (profileFetchError) {
        console.error('Error fetching user profile:', profileFetchError)
      } else {
        const currentPoints = profile?.total_points || 0
        const newTotalPoints = currentPoints + earnedPoints

        // Upsert user profile with updated points
        const { error: profileUpdateError } = await supabaseClient
          .from('user_profiles')
          .upsert({
            user_id: userId,
            total_points: newTotalPoints
          }, {
            onConflict: 'user_id'
          })

        if (profileUpdateError) {
          console.error('Failed to update user profile points:', profileUpdateError)
        } else {
          console.log(`Updated user ${userId} points: ${currentPoints} -> ${newTotalPoints} (+${earnedPoints})`)
        }
      }
    }

    return new Response(
      JSON.stringify({
        correct: isCorrect,
        points: earnedPoints,
        points_earned: earnedPoints,
        message: isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again!'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Validation functions
function validateMatching(answer: string, data: any): boolean {
  const pairs = answer.split(',').map(p => p.trim())
  const correct = data.correctPairs || []
  return pairs.length === correct.length && pairs.every((p: string) => correct.includes(p))
}

function validateScenario(answer: string, data: any): boolean {
  // Answer can be single choice (e.g., "report") or multiple sections (e.g., "report,red_flag")
  const userAnswers = answer.split(',')
  const correctChoice = data.correctChoice
  
  // Single question scenario
  if (correctChoice) {
    return userAnswers[0] === correctChoice
  }
  
  // Multi-section scenario - not commonly used now but kept for compatibility
  return answer === data.correctChoice
}

function validateDragDrop(answer: string, data: any): boolean {
  const order = answer.split(',')
  const correct = data.correctOrder || []
  return order.length === correct.length && order.every((item: string, idx: number) => item === correct[idx])
}

function validateCodeAnalysis(answer: string, data: any): boolean {
  const identified = answer.split(',').sort()
  const correct = (data.correctIssues || []).sort()
  return identified.length === correct.length && identified.every((id: string, idx: number) => id === correct[idx])
}

function validateCaesarCipher(answer: string, data: any): boolean {
  return parseInt(answer) === data.correctShift
}

function validatePasswordBuilder(answer: string, data: any): boolean {
  // Answer format: "password:strength" or just validates that a strong enough password was created
  const parts = answer.split(':')
  if (parts.length === 2) {
    const strength = parseInt(parts[1])
    return strength >= (data.minStrength || 70)
  }
  return false
}

function validateEmailDetective(answer: string, data: any): boolean {
  const selected = answer.split(',').sort()
  const correct = (data.correctClueIds || []).sort()
  const required = data.requiredClues || 3
  
  // Check if enough clues were found and they're mostly correct
  const correctlyIdentified = selected.filter((id: string) => correct.includes(id))
  return correctlyIdentified.length >= required
}

function validateWebsiteComparison(answer: string, data: any): boolean {
  return answer === data.correctAnswer
}

function validateHTTPSDemo(answer: string, data: any): boolean {
  return answer === (data.correctAnswer || 'https')
}

function validateWiFiSafety(answer: string, data: any): boolean {
  const selected = answer.split(',').sort()
  const correct = (data.correctAnswers || []).sort()
  return selected.length === correct.length && selected.every((id: string, idx: number) => id === correct[idx])
}

function validateLinkSafety(answer: string, data: any): boolean {
  const selected = answer.split(',').sort()
  const correct = (data.correctAnswers || []).sort()
  return selected.length === correct.length && selected.every((id: string, idx: number) => id === correct[idx])
}

function validateBrowserSecurity(answer: string, data: any): boolean {
  const selected = answer.split(',').sort()
  const correct = (data.correctSettings || []).sort()
  return selected.length === correct.length && selected.every((id: string, idx: number) => id === correct[idx])
}

function validatePrivacySettings(answer: string, data: any): boolean {
  // Answer format: "option1:value1,option2:value2,..."
  const selections = answer.split(',')
  const correctCount = selections.filter((sel: string) => {
    const [optionId, value] = sel.split(':')
    const option = (data.privacyOptions || []).find((o: any) => o.id === optionId)
    return option && value === option.recommendedOption
  }).length
  
  // Must get at least 80% correct
  return correctCount >= Math.ceil((data.privacyOptions || []).length * 0.8)
}

function validateSocialSharingQuiz(answer: string, data: any): boolean {
  // Answer format: "scenario1:true,scenario2:false,..."
  const answers = answer.split(',')
  const correctAnswers = data.correctAnswers || {}
  
  const correctCount = answers.filter((ans: string) => {
    const [scenarioId, userAnswer] = ans.split(':')
    return correctAnswers[scenarioId] === (userAnswer === 'true')
  }).length
  
  return correctCount === answers.length
}

function validateFakeProfileAnalysis(answer: string, data: any): boolean {
  const selected = answer.split(',').sort()
  const correct = (data.correctFlags || []).sort()
  const required = data.minRequiredFlags || 3
  
  const correctlyIdentified = selected.filter((id: string) => correct.includes(id))
  return correctlyIdentified.length >= required
}

function validateDigitalFootprintCleanup(answer: string, data: any): boolean {
  const selected = answer.split(',').sort()
  const correct = (data.correctRemovals || []).sort()
  
  // Must correctly identify at least 80% of items that should be removed
  const correctlyIdentified = selected.filter((id: string) => correct.includes(id))
  return correctlyIdentified.length >= Math.ceil(correct.length * 0.8)
}

function validateMalwareEducation(answer: string, data: any): boolean {
  const learned = answer.split(',')
  const required = data.requiredLearning || 3
  return learned.length >= required
}

function validateInfectionSigns(answer: string, data: any): boolean {
  const identified = answer.split(',').sort()
  const correct = (data.correctSigns || []).sort()
  const required = data.minCorrectIdentifications || 3
  
  const correctlyIdentified = identified.filter((id: string) => correct.includes(id))
  return correctlyIdentified.length >= required
}

function validateAntivirusDemo(answer: string, data: any): boolean {
  const selected = answer.split(',').sort()
  const correct = (data.correctFeatures || []).sort()
  const required = data.minRequired || 3
  
  const correctlySelected = selected.filter((id: string) => correct.includes(id))
  return correctlySelected.length >= required
}
