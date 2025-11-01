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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabaseClient = {
      from: (table: string) => ({
        select: async (columns: string) => {
          const url = `${supabaseUrl}/rest/v1/${table}?select=${columns}&id=eq.${stageId}`
          const response = await fetch(url, {
            headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
          })
          const data = await response.json()
          return { data: data[0] || null, error: null }
        },
        insert: async (record: any) => {
          const url = `${supabaseUrl}/rest/v1/${table}`
          const response = await fetch(url, {
            method: 'POST',
            headers: { 
              'apikey': supabaseKey, 
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(record)
          })
          const data = await response.json()
          return { data, error: null }
        },
        update: async (updates: any) => ({
          eq: async (column: string, value: any) => {
            const url = `${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}`
            const response = await fetch(url, {
              method: 'PATCH',
              headers: { 
                'apikey': supabaseKey, 
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updates)
            })
            return { error: null }
          }
        })
      })
    }

    // Get stage details
    const { data: stage, error: stageError } = await supabaseClient.from('stages')
      .select('challenge_type,challenge_data,points,module_id')

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

    // Update user progress
    await supabaseClient.from('user_progress')
      .update({
        status: isCorrect ? 'completed' : 'in_progress',
        completed_at: isCorrect ? new Date().toISOString() : null,
        points_earned: isCorrect ? earnedPoints : 0,
        hints_used: hintsUsed || [],
        time_spent: timeSpent || 0
      })
      .eq('user_id', userId)
      .eq('stage_id', stageId)

    // Update user total score if correct
    if (isCorrect && earnedPoints > 0) {
      const { data: profile } = await supabaseClient.from('user_profiles')
        .select('total_points')
      
      if (profile) {
        await supabaseClient.from('user_profiles')
          .update({ total_points: (profile.total_points || 0) + earnedPoints })
          .eq('user_id', userId)
      }
    }

    return new Response(
      JSON.stringify({
        correct: isCorrect,
        points: earnedPoints,
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
