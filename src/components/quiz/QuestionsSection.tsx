import { CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'

interface Question {
  id: number
  question_text: string
  options: { id: string; text: string }[]
  correct_option: string
  difficulty: string
  explanation: string
  points: number
}

interface UserAnswer {
  question_id: number
  selected_option: string
  is_correct: boolean
}

interface QuestionsSectionProps {
  stageId: number
  userId: string
}

export default function QuestionsSection({ stageId, userId }: QuestionsSectionProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [userAnswers, setUserAnswers] = useState<Map<number, UserAnswer>>(new Map())
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, string>>(new Map())
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuestions()
    loadUserAnswers()
  }, [stageId])

  async function loadQuestions() {
    const { data, error } = await supabase
      .from('stage_questions')
      .select('*')
      .eq('tool_stage_id', stageId)
      .order('order_index')

    if (!error && data) {
      setQuestions(data)
    }
    setLoading(false)
  }

  async function loadUserAnswers() {
    const { data } = await supabase
      .from('user_answers')
      .select('question_id, selected_option, is_correct')
      .eq('user_id', userId)
      .in('question_id', questions.map(q => q.id))

    if (data) {
      const answersMap = new Map(data.map(a => [a.question_id, a]))
      setUserAnswers(answersMap)
    }
  }

  const handleAnswerSelect = (questionId: number, optionId: string) => {
    setSelectedAnswers(new Map(selectedAnswers.set(questionId, optionId)))
  }

  const handleSubmitAll = async () => {
    const updates: UserAnswer[] = []
    let totalPoints = 0

    for (const question of questions) {
      const selectedOption = selectedAnswers.get(question.id)
      if (!selectedOption) continue

      const isCorrect = selectedOption === question.correct_option
      if (isCorrect) {
        totalPoints += question.points
      }

      updates.push({
        question_id: question.id,
        selected_option: selectedOption,
        is_correct: isCorrect
      })

      // Save to database
      await supabase.from('user_answers').upsert({
        user_id: userId,
        question_id: question.id,
        selected_option: selectedOption,
        is_correct: isCorrect,
        points_earned: isCorrect ? question.points : 0,
        answered_at: new Date().toISOString()
      })
    }

    // Update user points
    if (totalPoints > 0) {
      await supabase.rpc('increment_user_points', {
        user_id: userId,
        points_to_add: totalPoints
      })
    }

    // Update local state
    const newAnswersMap = new Map(userAnswers)
    updates.forEach(update => {
      newAnswersMap.set(update.question_id, update)
    })
    setUserAnswers(newAnswersMap)
    setShowResults(true)
  }

  const calculateScore = () => {
    let correct = 0
    let total = 0
    questions.forEach(q => {
      const answer = userAnswers.get(q.id)
      if (answer) {
        total++
        if (answer.is_correct) correct++
      }
    })
    return { correct, total }
  }

  if (loading) {
    return <div className="text-neutral-400">Loading questions...</div>
  }

  if (questions.length === 0) {
    return null
  }

  const { correct, total } = calculateScore()

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-h3 text-white font-semibold">Tool Usage Questions</h2>
        {showResults && total > 0 && (
          <div className="text-primary-400 font-medium">
            Score: {correct}/{total} ({Math.round((correct/total)*100)}%)
          </div>
        )}
      </div>

      <div className="space-y-8">
        {questions.map((question, index) => {
          const userAnswer = userAnswers.get(question.id)
          const selectedOption = selectedAnswers.get(question.id)
          const isAnswered = !!userAnswer

          return (
            <div
              key={question.id}
              className="bg-neutral-950 rounded-lg border border-neutral-800 p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-primary-400 font-medium">Q{index + 1}</span>
                <div className="flex-1">
                  <p className="text-body text-white mb-2">{question.question_text}</p>
                  <span className={`text-caption px-2 py-1 rounded ${
                    question.difficulty === 'basic'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-orange-500/10 text-orange-400'
                  }`}>
                    {question.difficulty === 'basic' ? 'Basic Command' : 'Advanced Scenario'} • {question.points} pts
                  </span>
                </div>
              </div>

              <div className="space-y-3 ml-10">
                {question.options.map((option) => {
                  const isSelected = selectedOption === option.id
                  const isCorrect = option.id === question.correct_option
                  const showFeedback = isAnswered || showResults

                  return (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        showFeedback
                          ? isCorrect
                            ? 'bg-green-500/10 border-green-500/50'
                            : isSelected
                            ? 'bg-red-500/10 border-red-500/50'
                            : 'bg-neutral-900 border-neutral-800'
                          : isSelected
                          ? 'bg-primary-500/10 border-primary-500/50'
                          : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(question.id, option.id)}
                        disabled={isAnswered}
                        className="w-4 h-4 text-primary-500 border-neutral-700 focus:ring-primary-500"
                      />
                      <span className="flex-1 text-body text-white">{option.text}</span>
                      {showFeedback && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </label>
                  )
                })}
              </div>

              {(isAnswered || showResults) && (
                <div className="mt-4 ml-10 p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                  <p className="text-caption text-neutral-300">
                    <span className="font-medium text-white">Explanation:</span> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!showResults && selectedAnswers.size > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmitAll}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
          >
            Submit All Answers ({selectedAnswers.size}/{questions.length})
          </button>
        </div>
      )}

      {showResults && (
        <div className="mt-8 p-6 bg-primary-500/10 border border-primary-500/50 rounded-lg text-center">
          <p className="text-body text-white mb-2">
            You scored <span className="font-bold text-primary-400">{correct} out of {total}</span> questions correctly!
          </p>
          <p className="text-caption text-neutral-300">
            Earned {correct * (questions[0]?.points || 10)} points
          </p>
        </div>
      )}
    </div>
  )
}
