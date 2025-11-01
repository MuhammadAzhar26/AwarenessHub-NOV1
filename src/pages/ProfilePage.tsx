import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { Trophy, Award, Target, Clock } from 'lucide-react'

interface UserProfile {
  username: string
  level: number
  total_points: number
  member_since: string
}

interface Badge {
  id: number
  title: string
  description: string
  earned_at: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [stats, setStats] = useState({
    completedStages: 0,
    hintsUsed: 0,
    avgScore: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      if (!user) return

      try {
        // Load profile
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        setProfile(profileData)

        // Load badges - manually fetch badge info
        const { data: userBadgesData } = await supabase
          .from('user_badges')
          .select('badge_id, earned_at')
          .eq('user_id', user.id)

        if (userBadgesData && userBadgesData.length > 0) {
          const badgeIds = userBadgesData.map(ub => ub.badge_id)
          const { data: badgesInfo } = await supabase
            .from('badges')
            .select('id, title, description')
            .in('id', badgeIds)

          const formattedBadges = userBadgesData.map((ub: any) => {
            const badgeInfo = badgesInfo?.find(b => b.id === ub.badge_id)
            return {
              id: ub.badge_id,
              title: badgeInfo?.title || '',
              description: badgeInfo?.description || '',
              earned_at: ub.earned_at
            }
          })

          setBadges(formattedBadges)
        }

        // Load stats
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')

        const completed = progressData?.length || 0
        const totalHints = progressData?.reduce((sum: number, p: any) => 
          sum + (p.hints_used?.length || 0), 0) || 0
        const avgPoints = completed > 0 
          ? Math.round(progressData!.reduce((sum: number, p: any) => 
              sum + (p.points_earned || 0), 0) / completed)
          : 0

        setStats({
          completedStages: completed,
          hintsUsed: totalHints,
          avgScore: avgPoints
        })
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-neutral-400">Loading profile...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navigation />
      
      <div className="container mx-auto py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-12 rounded-lg text-white mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-h1 font-bold">
              {profile?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-h1 font-bold mb-2">{profile?.username}</h1>
              <div className="flex gap-6 text-body-lg">
                <div>
                  <span className="opacity-75">Level:</span> <strong>{profile?.level}</strong>
                </div>
                <div>
                  <span className="opacity-75">Total Points:</span> <strong>{profile?.total_points}</strong>
                </div>
                <div>
                  <span className="opacity-75">Member Since:</span>{' '}
                  <strong>{new Date(profile?.member_since || '').toLocaleDateString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 shadow-dark-card">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-8 h-8 text-primary-500" />
              <h3 className="text-body font-semibold text-neutral-100">Stages Completed</h3>
            </div>
            <p className="text-h1 font-bold text-neutral-100">{stats.completedStages}</p>
          </div>

          <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 shadow-dark-card">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-8 h-8 text-warning-700" />
              <h3 className="text-body font-semibold text-neutral-100">Average Score</h3>
            </div>
            <p className="text-h1 font-bold text-neutral-100">{stats.avgScore} pts</p>
          </div>

          <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 shadow-dark-card">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-8 h-8 text-success-600" />
              <h3 className="text-body font-semibold text-neutral-100">Hints Used</h3>
            </div>
            <p className="text-h1 font-bold text-neutral-100">{stats.hintsUsed}</p>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 shadow-dark-card">
          <h2 className="text-h2 font-bold text-neutral-100 mb-6 flex items-center gap-3">
            <Award className="w-8 h-8 text-primary-500" />
            Badge Collection ({badges.length})
          </h2>

          {badges.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-body text-neutral-400">No badges earned yet. Complete challenges to earn badges!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gradient-to-br from-primary-900/30 to-neutral-900 p-6 rounded-lg border border-primary-700 text-center"
                >
                  <Award className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-body font-semibold text-neutral-100 mb-2">{badge.title}</h3>
                  <p className="text-small text-neutral-400 mb-3">{badge.description}</p>
                  <p className="text-caption text-neutral-500">
                    Earned {new Date(badge.earned_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
