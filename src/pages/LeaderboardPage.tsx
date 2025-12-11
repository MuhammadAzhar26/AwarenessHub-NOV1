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

        const rankedData = profilesData?.map((profile, index) => {
          return {
            user_id: profile.id, // id is the primary key that matches auth.users.id
            username: profile.username || `User_${profile.id.slice(0, 8)}`,
            total_points: profile.total_points || 0,
            level: profile.level || 1,
            rank: index + 1
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Leaderboard</h1>
          <p className="text-lg text-gray-600">
            Compete with other learners and climb to the top!
          </p>
        </div>

        {/* Current User Rank */}
        {currentUserRank && (
          <div className="max-w-3xl mx-auto mb-8 bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Trophy className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">Your Rank</p>
                  <p className="text-sm text-gray-600">Keep learning to improve your position!</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600">#{currentUserRank}</div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Top Performers</h2>
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
                  className={`bg-gradient-to-br ${color.bg} p-8 rounded-xl text-white text-center shadow-lg ${
                    index === 0 ? 'md:scale-110 md:-translate-y-2' : ''
                  }`}
                >
                  <div className="text-6xl mb-4">{color.medal}</div>
                  <h3 className="text-xl font-bold mb-2">{entry.username}</h3>
                  <div className="text-lg font-semibold mb-1">{entry.total_points} points</div>
                  <div className="opacity-90">Level {entry.level}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Username</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Level</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Points</th>
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
                          ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-base font-semibold text-gray-900">
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-base font-semibold text-blue-600">
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          <span className={`text-base ${isCurrentUser ? 'font-semibold' : ''} text-gray-900`}>
                            {entry.username}
                            {isCurrentUser && <span className="ml-2 text-blue-600">(You)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-base text-gray-900">
                        {entry.level}
                      </td>
                      <td className="px-6 py-4 text-right text-base font-semibold text-gray-900">
                        {entry.total_points}
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
              <p className="text-lg text-gray-600">No users on leaderboard yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
