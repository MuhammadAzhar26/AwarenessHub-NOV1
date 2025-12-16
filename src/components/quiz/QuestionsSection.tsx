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
    return <div className="text-gray-600">Loading questions...</div>
  }

  if (questions.length === 0) {
    return null
  }

  const { correct, total } = calculateScore()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-h3 text-gray-900 font-semibold">Tool Usage Questions</h2>
        {showResults && total > 0 && (
          <div className="text-blue-600 font-medium">
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
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-blue-600 font-medium">Q{index + 1}</span>
                <div className="flex-1">
                  <p className="text-body text-gray-900 mb-2">{question.question_text}</p>
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
                            : 'bg-white border-gray-200'
                          : isSelected
                          ? 'bg-blue-50 border-blue-500/50'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(question.id, option.id)}
                        disabled={isAnswered}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="flex-1 text-body text-gray-900">{option.text}</span>
                      {showFeedback && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </label>
                  )
                })}
              </div>

              {(isAnswered || showResults) && (
                <div className="mt-4 ml-10 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-caption text-gray-700">
                    <span className="font-medium text-gray-900">Explanation:</span> {question.explanation}
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
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Submit All Answers ({selectedAnswers.size}/{questions.length})
          </button>
        </div>
      )}

      {showResults && (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-body text-gray-900 mb-2">
            You scored <span className="font-bold text-blue-600">{correct} out of {total}</span> questions correctly!
          </p>
          <p className="text-caption text-gray-700">
            Earned {correct * (questions[0]?.points || 10)} points
          </p>
        </div>
      )}
    </div>
  )
}
