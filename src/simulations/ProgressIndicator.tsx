import { CheckCircle, Circle, Clock } from 'lucide-react'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: Array<{
    title: string
    description: string
    completed: boolean
  }>
  onStepClick?: (stepIndex: number) => void
  className?: string
}

const ProgressIndicator = ({ currentStep, totalSteps, steps, onStepClick, className = '' }: ProgressIndicatorProps) => {
  return (
    <div className={`bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Simulation Progress</h3>
        <div className="text-sm text-slate-300">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = step.completed
          const isCurrent = stepNumber === currentStep
          const isPast = stepNumber < currentStep
          const isClickable = onStepClick && (isPast || isCompleted)

          return (
            <div 
              key={index} 
              className={`flex items-start space-x-3 transition-all duration-200 ${
                isClickable ? 'cursor-pointer hover:bg-slate-700/30 rounded-lg p-2 -m-2' : ''
              }`}
              onClick={() => isClickable && onStepClick(index)}
            >
              <div className="flex-shrink-0 mt-1">
                {isCompleted || isPast ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : isCurrent ? (
                  <Clock className="h-5 w-5 text-blue-400" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium transition-colors ${
                  isCompleted || isCurrent ? 'text-white' : 'text-slate-400'
                } ${
                  isClickable ? 'hover:text-blue-400' : ''
                }`}>
                  {step.title}
                  {isClickable && (
                    <span className="text-xs text-slate-500 ml-2">(Click to navigate)</span>
                  )}
                </h4>
                <p className={`text-xs transition-colors ${
                  isCompleted || isCurrent ? 'text-slate-300' : 'text-slate-500'
                } ${
                  isClickable ? 'hover:text-slate-400' : ''
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressIndicator
