import { useState, useEffect } from 'react'
import { X, Trophy, Clock } from 'lucide-react'
import MultipleChoiceQuestion from './MultipleChoiceQuestion'
import FillBlankQuestion from './FillBlankQuestion'
import DragDropQuestion from './DragDropQuestion'

interface QuizQuestion {
  id: number
  question_text: string
  question_type: string
  question_data: any
  correct_answer: any
  explanation: string
  points: number
}

interface Quiz {
  id: number
  points: number
  difficulty: string
  questions: QuizQuestion[]
}

interface QuizModalProps {
  quiz: Quiz
  onComplete: (points: number, correct: boolean) => void
  onClose?: () => void
}

export default function QuizModal({ quiz, onComplete, onClose }: QuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [startTime] = useState(Date.now())
  const [timeBonus, setTimeBonus] = useState(0)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1

  const handleAnswer = (isCorrect: boolean, _answer: any) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    let points = 0

    if (isCorrect) {
      points = currentQuestion.points
      setCorrectAnswers(correctAnswers + 1)

      // Bonus points for quick answers (within 10 seconds)
      if (timeSpent <= 10) {
        const bonus = Math.floor(currentQuestion.points * 0.5)
        setTimeBonus(timeBonus + bonus)
        points += bonus
      }
    }

    setTotalPoints(totalPoints + points)

    // Wait 2 seconds before moving to next question or completing
    setTimeout(() => {
      if (isLastQuestion) {
        const allCorrect = correctAnswers + (isCorrect ? 1 : 0) === quiz.questions.length
        onComplete(totalPoints + points, allCorrect)
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }
    }, 2000)
  }

  const renderQuestion = () => {
    switch (currentQuestion.question_type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            question={currentQuestion.question_text}
            options={currentQuestion.question_data.options}
            correctAnswer={currentQuestion.correct_answer.correct}
            explanation={currentQuestion.explanation}
            onAnswer={handleAnswer}
          />
        )

      case 'fill_blank':
        return (
          <FillBlankQuestion
            question={currentQuestion.question_text}
            prefix={currentQuestion.question_data.prefix}
            suffix={currentQuestion.question_data.suffix}
            placeholder={currentQuestion.question_data.placeholder}
            correctAnswer={currentQuestion.correct_answer.answer}
            alternatives={currentQuestion.correct_answer.alternatives || []}
            explanation={currentQuestion.explanation}
            onAnswer={handleAnswer}
          />
        )

      case 'drag_drop':
        return (
          <DragDropQuestion
            question={currentQuestion.question_text}
            items={currentQuestion.question_data.items}
            zones={currentQuestion.question_data.zones}
            correctPairs={currentQuestion.correct_answer.pairs}
            explanation={currentQuestion.explanation}
            onAnswer={handleAnswer}
          />
        )

      default:
        return <div>Unknown question type</div>
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg border-2 border-blue-600 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-h2 font-bold text-gray-900">Quiz Time!</h2>
                <p className="text-small text-gray-600">
                  Complete this quiz to continue watching
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-small text-gray-600 mb-2">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <span className="text-blue-600 font-semibold">{totalPoints} points</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Difficulty Badge */}
          <div className="mt-4 flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-caption font-semibold ${
              quiz.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
              quiz.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
            </span>
            {timeBonus > 0 && (
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-caption font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Speed Bonus: +{timeBonus}
              </span>
            )}
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6">
          {renderQuestion()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-caption text-neutral-500 text-center">
            Answer correctly to earn points and continue the video
          </div>
        </div>
      </div>
    </div>
  )
}
