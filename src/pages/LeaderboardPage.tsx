import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { Trophy, Medal, Award } from 'lucide-react'

interface LeaderboardEntry {
  user_id: string
  username: string
  total_points: number
  level: number
  rank: number
  modules_completed: number
  badges_earned: number
  challenge_score: number
  avg_hint_efficiency: number
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLeaderboard() {
      if (!user) return

      try {
        // Load all user profiles sorted by points
        // Use 'id' to match other components (DashboardPage, ProfilePage use .eq('id', user.id))
        const { data: profilesData, error } = await supabase
          .from('user_profiles')
          .select('id, username, total_points, level')
          .order('total_points', { ascending: false })
          .limit(100)

        if (error) {
          console.error('Error loading leaderboard:', error)
          throw error
        }

        // Fetch user progress data for all users to calculate comprehensive stats
        const userIds = profilesData?.map(p => p.id) || []
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('user_id, status, points_earned, hints_used')
          .in('user_id', userIds)

        // Fetch user badges data
        const { data: badgesData } = await supabase
          .from('user_badges')
          .select('user_id, badge_id')
          .in('user_id', userIds)

        const rankedData = profilesData?.map((profile, index) => {
          // Calculate modules completed
          const userProgress = progressData?.filter(p => p.user_id === profile.id && p.status === 'completed') || []
          const modulesCompleted = userProgress.length

          // Count badges earned
          const badgesEarned = badgesData?.filter(b => b.user_id === profile.id).length || 0

          // Calculate average hint efficiency using Adaptive Hint Scoring metrics
          // Hint efficiency = average points earned as % of max possible (accounting for hints)
          let totalHintEfficiency = 0
          let challengesWithHints = 0
          userProgress.forEach(progress => {
            if (progress.hints_used && progress.hints_used.length > 0) {
              // Calculate efficiency: higher is better (closer to 100% means fewer/later hints)
              const hintsUsed = progress.hints_used.length
              const efficiency = Math.max(0, 100 - (hintsUsed * 15)) // 15% penalty per hint
              totalHintEfficiency += efficiency
              challengesWithHints++
            }
          })
          const avgHintEfficiency = challengesWithHints > 0 
            ? Math.round(totalHintEfficiency / challengesWithHints)
            : 100 // 100% if no hints used

          // Calculate challenge score (avg points per completed challenge)
          const totalChallengePoints = userProgress.reduce((sum, p) => sum + (p.points_earned || 0), 0)
          const challengeScore = modulesCompleted > 0 
            ? Math.round(totalChallengePoints / modulesCompleted)
            : 0

          return {
            user_id: profile.id, // id is the primary key that matches auth.users.id
            username: profile.username || `User_${profile.id.slice(0, 8)}`,
            total_points: profile.total_points || 0,
            level: profile.level || 1,
            rank: index + 1,
            modules_completed: modulesCompleted,
            badges_earned: badgesEarned,
            challenge_score: challengeScore,
            avg_hint_efficiency: avgHintEfficiency
          }
        }).filter(entry => entry.total_points !== null && entry.total_points !== undefined && entry.total_points > 0) || []

        // Sort by total_points descending to ensure correct ranking (in case order by didn't work)
        rankedData.sort((a, b) => b.total_points - a.total_points)
        
        // Re-assign ranks after sorting
        rankedData.forEach((entry, index) => {
          entry.rank = index + 1
        })

        setLeaderboard(rankedData)

        // Find current user's rank using id (which matches auth.users.id)
        const userRank = rankedData.find(entry => entry.user_id === user.id)?.rank
        setCurrentUserRank(userRank || null)
      } catch (error) {
        console.error('Error loading leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-gray-600">Loading leaderboard...</div>
        </div>
      </div>
    )
  }

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-h1 font-bold text-gray-900 mb-4">Leaderboard</h1>
          <p className="text-body-lg text-gray-600">
            Compete with other learners and climb to the top!
          </p>
        </div>

        {/* Current User Rank */}
        {currentUserRank && (
          <div className="max-w-3xl mx-auto mb-8 bg-blue-50 p-6 rounded-lg border-2 border-blue-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Trophy className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-body font-semibold text-gray-900">Your Rank</p>
                  <p className="text-small text-gray-600">Keep learning to improve your position!</p>
                </div>
              </div>
              <div className="text-h2 font-bold text-blue-600">#{currentUserRank}</div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-h2 font-bold text-gray-900 text-center mb-8">Top Performers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {top3.map((entry, index) => {
              const colors = [
                { bg: 'from-yellow-400 to-yellow-600', icon: 'text-yellow-600', medal: '🥇' },
                { bg: 'from-gray-300 to-gray-500', icon: 'text-gray-600', medal: '🥈' },
                { bg: 'from-orange-400 to-orange-600', icon: 'text-orange-600', medal: '🥉' }
              ]
              const color = colors[index]

              return (
                <div
                  key={entry.user_id}
                  className={`bg-gradient-to-br ${color.bg} p-8 rounded-lg text-white text-center shadow-card-hover ${
                    index === 0 ? 'md:scale-110 md:-translate-y-2' : ''
                  }`}
                >
                  <div className="text-6xl mb-4">{color.medal}</div>
                  <h3 className="text-h3 font-bold mb-2">{entry.username}</h3>
                  <div className="text-body-lg font-semibold mb-1">{entry.total_points.toLocaleString()} points</div>
                  <div className="text-body opacity-90 mb-2">Level {entry.level}</div>
                  <div className="text-small opacity-80 space-y-1">
                    <div>📚 {entry.modules_completed} Modules</div>
                    <div>🏅 {entry.badges_earned} Badges</div>
                    <div>⚡ {entry.avg_hint_efficiency}% Efficiency</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-4 text-left text-small font-semibold text-gray-900">Rank</th>
                  <th className="px-6 py-4 text-left text-small font-semibold text-gray-900">Username</th>
                  <th className="px-6 py-4 text-center text-small font-semibold text-gray-900">Modules</th>
                  <th className="px-6 py-4 text-center text-small font-semibold text-gray-900">Badges</th>
                  <th className="px-6 py-4 text-center text-small font-semibold text-gray-900">Avg Score</th>
                  <th className="px-6 py-4 text-center text-small font-semibold text-gray-900">Hint Eff.</th>
                  <th className="px-6 py-4 text-right text-small font-semibold text-gray-900">Level</th>
                  <th className="px-6 py-4 text-right text-small font-semibold text-gray-900">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rest.map((entry) => {
                  const isCurrentUser = entry.user_id === user?.id

                  return (
                    <tr
                      key={entry.user_id}
                      className={`transition-colors ${
                        isCurrentUser 
                          ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-body font-semibold text-gray-900">
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-body font-semibold text-blue-700">
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          <span className={`text-body ${isCurrentUser ? 'font-semibold' : ''} text-gray-900`}>
                            {entry.username}
                            {isCurrentUser && <span className="ml-2 text-blue-600">(You)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-body text-gray-900">
                        {entry.modules_completed}
                      </td>
                      <td className="px-6 py-4 text-center text-body text-gray-900">
                        {entry.badges_earned}
                      </td>
                      <td className="px-6 py-4 text-center text-body text-gray-900">
                        {entry.challenge_score}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-small font-medium ${
                          entry.avg_hint_efficiency >= 85 ? 'bg-green-100 text-green-800' :
                          entry.avg_hint_efficiency >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {entry.avg_hint_efficiency}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-body text-gray-900">
                        {entry.level}
                      </td>
                      <td className="px-6 py-4 text-right text-body font-semibold text-gray-900">
                        {entry.total_points.toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-body text-gray-600">No users on leaderboard yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
