import React, { useState, useEffect } from 'react'
import { Trophy, Medal, Award, Star, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface LeaderboardUser {
  id: string
  username: string
  score: number
  modulesCompleted: number
  badges: number
  rank: number
  avatar?: string
  lastActive: string
}

interface LeaderboardProps {
  showTitle?: boolean
  maxUsers?: number
  className?: string
}

// This component now fetches real-time user data from Supabase
// No mock data - all data comes from the live database

export default function Leaderboard({ 
  showTitle = true, 
  maxUsers = 8, 
  className = '' 
}: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real-time user data from Supabase
    const loadLeaderboardData = async () => {
      setLoading(true)
      
      try {
        // Query user profiles with their scores
        const { data: profiles, error: profileError } = await supabase
          .from('user_profiles')
          .select(`
            id,
            username,
            total_points,
            created_at,
            updated_at
          `)
          .order('total_points', { ascending: false })
          .limit(maxUsers * 2) // Get more users to calculate ranks

        if (profileError) {
          throw profileError
        }

        if (!profiles || profiles.length === 0) {
          setLeaderboardData([])
          return
        }

        // Get user progress in a single query for all users
        const userIds = profiles.map(p => p.id)
        const { data: allProgress, error: progressError } = await supabase
          .from('user_progress')
          .select('user_id, status, points_earned')
          .in('user_id', userIds)

        if (progressError) {
          console.warn('Error fetching progress data:', progressError)
        }

        // Calculate stats for each user
        const userStats = profiles.map(profile => {
          const userProgress = allProgress?.filter(p => p.user_id === profile.id) || []
          const completedStages = userProgress.filter(p => p.status === 'completed')
          const modulesCompleted = completedStages.length
          const badges = userProgress.length // Using progress entries as badges count
          
          // Calculate "last active" based on most recent progress or profile update
          const lastActivity = [profile, ...userProgress].reduce((latest, item: any) => {
            const timestamp = item.updated_at || item.created_at || item.updated_at
            const itemTime = timestamp ? new Date(timestamp) : new Date(0)
            return itemTime > latest ? itemTime : latest
          }, new Date(0))
          
          const lastActive = getTimeAgo(lastActivity)

          return {
            id: profile.id,
            username: profile.username || `User_${profile.id.slice(0, 8)}`,
            score: profile.total_points || 0,
            modulesCompleted,
            badges,
            lastActive
          }
        })

        // Sort by score and add ranks
        const rankedUsers = userStats
          .sort((a, b) => b.score - a.score)
          .map((user, index) => ({
            ...user,
            rank: index + 1
          }))
          .slice(0, maxUsers)

        setLeaderboardData(rankedUsers)
        
      } catch (error) {
        console.error('Error loading leaderboard data:', error)
        // Set empty array if error occurs
        setLeaderboardData([])
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboardData()
  }, [maxUsers])

  // Helper function to convert timestamp to "time ago" format
  const getTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return `${Math.floor(diffInSeconds / 2592000)} months ago`
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-body font-semibold text-neutral-500">{rank}</div>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600'
      default:
        return 'bg-neutral-100 text-neutral-700'
    }
  }

  if (loading) {
    return (
      <div className={`bg-background-surface rounded-lg border border-neutral-200 p-6 ${className}`}>
        {showTitle && (
          <h3 className="text-h3 font-bold text-neutral-900 mb-6 text-center">
            🏆 Top Cybersecurity Learners
          </h3>
        )}
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-neutral-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-neutral-200 rounded mb-1"></div>
                  <div className="h-3 bg-neutral-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-background-surface rounded-lg border border-neutral-200 p-6 shadow-card ${className}`}>
      {showTitle && (
        <div className="text-center mb-6">
          <h3 className="text-h3 font-bold text-neutral-900 mb-2">
            🏆 Top Cybersecurity Learners
          </h3>
          <p className="text-body text-neutral-700">
            See how you rank among fellow security professionals
          </p>
        </div>
      )}
      
      <div className="space-y-3">
        {leaderboardData.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-neutral-400 mb-2">No users found</div>
            <p className="text-small text-neutral-500">
              Be the first to complete challenges and appear on the leaderboard!
            </p>
          </div>
        ) : (
          leaderboardData.map((user) => (
            <div 
              key={user.id}
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
            >
              {/* Rank Badge */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-small font-bold ${getRankBadgeColor(user.rank)}`}>
                {user.rank <= 3 ? (
                  getRankIcon(user.rank)
                ) : (
                  <span>{user.rank}</span>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="text-body font-semibold text-neutral-900 truncate">
                    {user.username}
                  </h4>
                  {user.rank <= 3 && (
                    <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center space-x-4 text-small text-neutral-500 mt-1">
                  <span className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{user.modulesCompleted} challenges</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Award className="w-3 h-3" />
                    <span>{user.badges} points</span>
                  </span>
                  <span className="text-neutral-400">
                    {user.lastActive}
                  </span>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="text-body font-bold text-primary-500">
                  {user.score.toLocaleString()}
                </div>
                <div className="text-small text-neutral-500">
                  points
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Call to Action */}
      {leaderboardData.length > 0 && (
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <p className="text-small text-neutral-600 text-center mb-3">
            Real-time leaderboard of active learners
          </p>
          <div className="flex justify-center space-x-4 text-small">
            <div className="flex items-center space-x-1 text-neutral-500">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>Live Scores</span>
            </div>
            <div className="flex items-center space-x-1 text-neutral-500">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span>Progress Tracking</span>
            </div>
            <div className="flex items-center space-x-1 text-neutral-500">
              <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
              <span>Real Users</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}