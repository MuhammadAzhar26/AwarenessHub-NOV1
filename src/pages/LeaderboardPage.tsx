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
        const { data: profilesData } = await supabase
          .from('user_profiles')
          .select('id, username, total_points, level')
          .order('total_points', { ascending: false })
          .limit(100)

        const rankedData = profilesData?.map((profile, index) => ({
          user_id: profile.id,
          username: profile.username,
          total_points: profile.total_points,
          level: profile.level,
          rank: index + 1
        })) || []

        setLeaderboard(rankedData)

        // Find current user's rank
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
      <div className="min-h-screen bg-neutral-950">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-neutral-400">Loading leaderboard...</div>
        </div>
      </div>
    )
  }

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navigation />
      
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-h1 font-bold text-neutral-100 mb-4">Leaderboard</h1>
          <p className="text-body-lg text-neutral-400">
            Compete with other learners and climb to the top!
          </p>
        </div>

        {/* Current User Rank */}
        {currentUserRank && (
          <div className="max-w-3xl mx-auto mb-8 bg-primary-900/20 p-6 rounded-lg border-2 border-primary-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Trophy className="w-8 h-8 text-primary-500" />
                <div>
                  <p className="text-body font-semibold text-neutral-100">Your Rank</p>
                  <p className="text-small text-neutral-400">Keep learning to improve your position!</p>
                </div>
              </div>
              <div className="text-h2 font-bold text-primary-500">#{currentUserRank}</div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-h2 font-bold text-neutral-100 text-center mb-8">Top Performers</h2>
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
                  <div className="text-body-lg font-semibold mb-1">{entry.total_points} points</div>
                  <div className="text-body opacity-90">Level {entry.level}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="max-w-4xl mx-auto bg-neutral-900 rounded-lg border border-neutral-800 shadow-dark-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800 border-b border-neutral-700">
                <tr>
                  <th className="px-6 py-4 text-left text-small font-semibold text-neutral-100">Rank</th>
                  <th className="px-6 py-4 text-left text-small font-semibold text-neutral-100">Username</th>
                  <th className="px-6 py-4 text-right text-small font-semibold text-neutral-100">Level</th>
                  <th className="px-6 py-4 text-right text-small font-semibold text-neutral-100">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {rest.map((entry) => {
                  const isCurrentUser = entry.user_id === user?.id

                  return (
                    <tr
                      key={entry.user_id}
                      className={`transition-colors ${
                        isCurrentUser 
                          ? 'bg-primary-900/20 border-l-4 border-l-primary-500' 
                          : 'hover:bg-neutral-800/50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-body font-semibold text-neutral-100">
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-900/30 rounded-full flex items-center justify-center text-body font-semibold text-primary-400">
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          <span className={`text-body ${isCurrentUser ? 'font-semibold' : ''} text-neutral-100`}>
                            {entry.username}
                            {isCurrentUser && <span className="ml-2 text-primary-500">(You)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-body text-neutral-100">
                        {entry.level}
                      </td>
                      <td className="px-6 py-4 text-right text-body font-semibold text-neutral-100">
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
              <Trophy className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-body text-neutral-400">No users on leaderboard yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
