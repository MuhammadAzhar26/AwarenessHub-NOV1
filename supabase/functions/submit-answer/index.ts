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
    const { stageId, userId, answer, timeSpent, hintsUsed, hintUsageTimes } = await req.json()

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

    // Get hints for this stage to calculate penalties
    const { data: hintsData } = await supabaseClient
      .from('hints')
      .select('hint_number, penalty_points')
      .eq('stage_id', stageId)
      .order('hint_number')

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
      case 'secret-message-detective':
        isCorrect = validateSecretMessageDetective(answer, stage.challenge_data)
        break
      case 'base64-decoder':
        isCorrect = validateBase64Decoder(answer, stage.challenge_data)
        break
      case 'xor-cipher':
        isCorrect = validateXorCipher(answer, stage.challenge_data)
        break
      case 'brute-force-estimator':
        isCorrect = validateBruteForceEstimator(answer, stage.challenge_data)
        break
      case 'hash-identifier':
        isCorrect = validateHashIdentifier(answer, stage.challenge_data)
        break
      case 'attachment-risk':
        isCorrect = validateAttachmentRisk(answer, stage.challenge_data)
        break
      case 'email-header-analysis':
        isCorrect = validateEmailHeaderAnalysis(answer, stage.challenge_data)
        break
      case 'text':
      default:
        isCorrect = answer.trim().toLowerCase() === stage.challenge_data?.correctAnswer?.toLowerCase()
    }

    if (isCorrect) {
      const basePoints = stage.points
      const minPoints = Math.floor(basePoints * 0.3) // Minimum 30% of points
      
      // Adaptive Hint Scoring Algorithm
      // S(u,c) = max(S_min, B_c - Σ(H_i * α * e^(-λ * t_i)))
      // Where:
      // - S_min = minimum points (30% of base)
      // - B_c = base points for challenge
      // - H_i = base cost of i-th hint
      // - α = difficulty multiplier (1.0 for standard challenges)
      // - λ = decay factor (0.001)
      // - t_i = time elapsed when hint i was used (in seconds)
      
      const alpha = 1.0  // Difficulty multiplier
      const lambda = 0.001  // Decay factor
      
      let totalPenalty = 0
      const penaltyBreakdown: any[] = []
      
      if (hintsUsed && hintsUsed.length > 0 && hintsData) {
        for (const hintNumber of hintsUsed) {
          const hintInfo = hintsData.find(h => h.hint_number === hintNumber)
          if (!hintInfo) continue
          
          const baseCost = hintInfo.penalty_points
          const timeElapsed = hintUsageTimes?.[hintNumber] || 0
          
          // Calculate penalty with exponential decay
          const decayFactor = Math.exp(-lambda * timeElapsed)
          const penalty = baseCost * alpha * decayFactor
          
          totalPenalty += penalty
          penaltyBreakdown.push({
            hintNumber,
            baseCost,
            timeElapsed,
            decayFactor: decayFactor.toFixed(4),
            penalty: penalty.toFixed(2)
          })
        }
      }
      
      // Calculate final earned points
      earnedPoints = Math.max(minPoints, Math.round(basePoints - totalPenalty))
      
      // Log scoring details for debugging
      console.log('Adaptive Hint Scoring:', {
        basePoints,
        minPoints,
        totalPenalty: totalPenalty.toFixed(2),
        earnedPoints,
        hintsUsed: hintsUsed?.length || 0,
        penaltyBreakdown
      })
    }

    // Check if progress record exists
    const { data: existingProgress } = await supabaseClient
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('stage_id', stageId)
      .maybeSingle()

    // Update or insert user progress
    const progressData = {
      user_id: userId,
      stage_id: stageId,
      status: isCorrect ? 'completed' : 'in_progress',
      completed_at: isCorrect ? new Date().toISOString() : null,
      points_earned: isCorrect ? earnedPoints : 0,
      hints_used: hintsUsed || [],
      time_spent: timeSpent || 0
    }

    let progressError = null
    if (existingProgress) {
      // Update existing record
      const { error } = await supabaseClient
        .from('user_progress')
        .update(progressData)
        .eq('user_id', userId)
        .eq('stage_id', stageId)
      progressError = error
    } else {
      // Insert new record
      const { error } = await supabaseClient
        .from('user_progress')
        .insert(progressData)
      progressError = error
    }

    if (progressError) {
      console.error('Failed to update user progress:', progressError)
      return new Response(
        JSON.stringify({ error: 'Failed to update progress', details: progressError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update user total score and level if correct
    let newBadges: any[] = []
    if (isCorrect && earnedPoints > 0) {
      // Recalculate total_points from all completed stages to ensure accuracy
      const { data: allProgress, error: progressFetchError } = await supabaseClient
        .from('user_progress')
        .select('points_earned')
        .eq('user_id', userId)
        .eq('status', 'completed')

      if (progressFetchError) {
        console.error('Error fetching user progress:', progressFetchError)
      } else {
        // Sum all points_earned from completed stages
        const calculatedTotalPoints = allProgress?.reduce((sum: number, p: any) => {
          return sum + (p.points_earned || 0)
        }, 0) || 0

        // Calculate level based on total points (every 100 points = 1 level, minimum level 1)
        const calculatedLevel = Math.max(1, Math.floor(calculatedTotalPoints / 100) + 1)

        // Get existing profile to preserve other fields
        const { data: existingProfile } = await supabaseClient
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        // Update or insert user profile with calculated points and level
        const { error: profileUpdateError } = await supabaseClient
          .from('user_profiles')
          .upsert({
            id: userId,
            total_points: calculatedTotalPoints,
            level: calculatedLevel,
            username: existingProfile?.username || null,
            member_since: existingProfile?.member_since || new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (profileUpdateError) {
          console.error('Failed to update user profile:', profileUpdateError)
        } else {
          console.log(`Updated user ${userId}: ${calculatedTotalPoints} points, level ${calculatedLevel}`)
        }

        // Check and award badges
        try {
          const { data: badgesAwarded, error: badgeError } = await supabaseClient
            .rpc('check_and_award_badges', { p_user_id: userId })

          if (badgeError) {
            console.error('Error checking badges:', badgeError)
          } else if (badgesAwarded && badgesAwarded.length > 0) {
            newBadges = badgesAwarded.filter((b: any) => b.newly_awarded)
            console.log(`Awarded ${newBadges.length} new badges to user ${userId}`)
          }
        } catch (badgeCheckError) {
          console.error('Badge check exception:', badgeCheckError)
        }
      }
    }

    return new Response(
      JSON.stringify({
        correct: isCorrect,
        points: earnedPoints,
        points_earned: earnedPoints,
        message: isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again!',
        badges: newBadges.length > 0 ? newBadges : undefined
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
  // Answer format: "id1:rightId1,id2:rightId2"
  // Parse the pairs from the answer
  const userPairs = answer.split(',').map(p => p.trim())
  const correctPairs = data.pairs || [] // Array of {id, left, right}
  
  // Check if all pairs match correctly
  let correctCount = 0
  for (const userPair of userPairs) {
    const [leftId, rightId] = userPair.split(':')
    const correctPair = correctPairs.find((p: any) => p.id === leftId)
    if (correctPair && correctPair.id === rightId) {
      correctCount++
    }
  }
  
  return correctCount === correctPairs.length
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
  // Answer format: "zone1:item1,item2;zone2:item3,item4"
  // Parse the zones and their items
  const userZones = answer.split(';').map(z => z.trim())
  const zones = data.zones || [] // Array of {id, label, correctItems: string[]}
  
  // Check if all zones have correct items
  let allCorrect = true
  for (const userZone of userZones) {
    const [zoneId, itemsStr] = userZone.split(':')
    const items = itemsStr && itemsStr !== 'empty' ? itemsStr.split(',') : []
    const correctZone = zones.find((z: any) => z.id === zoneId)
    
    if (!correctZone) {
      allCorrect = false
      break
    }
    
    // Check if items match (order doesn't matter)
    const correctItems = correctZone.correctItems || []
    if (items.length !== correctItems.length) {
      allCorrect = false
      break
    }
    
    const sortedUser = items.sort()
    const sortedCorrect = correctItems.sort()
    if (!sortedUser.every((item: string, idx: number) => item === sortedCorrect[idx])) {
      allCorrect = false
      break
    }
  }
  
  return allCorrect
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

function validateBase64Decoder(answer: string, data: any): boolean {
  return answer.trim().toLowerCase() === (data.correctPlaintext || '').trim().toLowerCase()
}

function validateXorCipher(answer: string, data: any): boolean {
  const numeric = parseInt(answer, 10)
  if (Number.isNaN(numeric)) return false
  return numeric === data.correctKey
}

function validateBruteForceEstimator(answer: string, data: any): boolean {
  const entropy = parseInt(answer, 10)
  if (Number.isNaN(entropy)) return false
  return entropy >= (data.requiredComplexity || 50)
}

function validateHashIdentifier(answer: string, data: any): boolean {
  // Answer format: hash1:MD5,hash2:SHA-256
  const userMappings = answer.split(',').reduce((acc: Record<string, string>, pair) => {
    const [id, algo] = pair.split(':')
    return { ...acc, [id]: algo }
  }, {})
  
  const hashes = data.hashes || []
  return hashes.every((h: any) => userMappings[h.id] === h.algorithm)
}

function validateAttachmentRisk(answer: string, data: any): boolean {
  // Answer format: att1:safe,att2:dangerous
  const userClassifications = answer.split(',').reduce((acc: Record<string, string>, pair) => {
    const [id, risk] = pair.split(':')
    return { ...acc, [id]: risk }
  }, {})
  
  const attachments = data.attachments || []
  return attachments.every((a: any) => userClassifications[a.id] === a.riskLevel)
}

function validateEmailHeaderAnalysis(answer: string, data: any): boolean {
  // Answer format: header1,header3,header5 (comma-separated IDs of flagged headers)
  const flagged = answer.split(',').sort()
  const suspicious = (data.headers || [])
    .filter((h: any) => h.suspicious)
    .map((h: any) => h.id)
    .sort()
  
  const minCorrect = data.minCorrect || 3
  const correctlyFlagged = flagged.filter(id => suspicious.includes(id))
  const incorrectlyFlagged = flagged.filter(id => !suspicious.includes(id))
  
  // Must identify at least minCorrect suspicious headers with no more than 1 false positive
  return correctlyFlagged.length >= minCorrect && incorrectlyFlagged.length <= 1
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

function validateSecretMessageDetective(answer: string, data: any): boolean {
  // Answer format: "msg1:3,msg2:7,msg3:13" (messageId:shift pairs)
  const answers = answer.split(',').map(pair => {
    const [id, shift] = pair.split(':')
    return { id, shift: parseInt(shift) }
  })
  
  const messages = data.messages || []
  
  // Check if all messages have correct shifts
  return messages.every((msg: any) => {
    const userAnswer = answers.find(a => a.id === msg.id)
    return userAnswer && userAnswer.shift === msg.correctShift
  })
}
