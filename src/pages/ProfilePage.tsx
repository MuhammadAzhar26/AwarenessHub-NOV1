import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { Trophy, Award, Clock } from 'lucide-react'

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
  icon_name: string
  category: string
  earned_at: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
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

        // Load badges with join query
        const { data: userBadgesData, error: badgesError } = await supabase
          .from('user_badges')
          .select(`
            badge_id,
            earned_at,
            badges!inner (
              id,
              title,
              description,
              icon_name,
              category
            )
          `)
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false })

        if (badgesError) {
          console.error('Error loading badges:', badgesError)
        } else if (userBadgesData && userBadgesData.length > 0) {
          const formattedBadges = userBadgesData.map((ub: any) => ({
            id: ub.badge_id,
            title: ub.badges.title,
            description: ub.badges.description,
            icon_name: ub.badges.icon_name,
            category: ub.badges.category,
            earned_at: ub.earned_at
          }))

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

        setStats({
          completedStages: completed,
          hintsUsed: totalHints,
          avgScore: 0
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
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-gray-600">Loading profile...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-12 rounded-xl text-white mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
              {profile?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{profile?.username}</h1>
              <div className="flex gap-6 text-lg">
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
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Stages Completed</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.completedStages}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Hints Used</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.hintsUsed}</p>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-600" />
              Badge Collection ({badges.filter(b => selectedCategory === 'all' || b.category === selectedCategory).length})
            </h2>
            
            {badges.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-50 text-gray-900 border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {Array.from(new Set(badges.map(b => b.category))).sort().map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {badges.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600">No badges earned yet. Complete challenges to earn badges!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {badges
                .filter(badge => selectedCategory === 'all' || badge.category === selectedCategory)
                .map((badge) => {
                const categoryColors: Record<string, { border: string; bg: string; text: string }> = {
                  milestone: { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-600' },
                  points: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
                  module: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-600' },
                  special: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-600' },
                  training: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
                  simulation: { border: 'border-cyan-500', bg: 'bg-cyan-50', text: 'text-cyan-600' },
                  level: { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-600' },
                  competitive: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-600' },
                  consistency: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-600' },
                  checklist: { border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-600' },
                  domain: { border: 'border-pink-500', bg: 'bg-pink-50', text: 'text-pink-600' },
                }
                const colors = categoryColors[badge.category] || categoryColors.milestone

                return (
                  <div
                    key={badge.id}
                    className={`${colors.bg} p-6 rounded-lg border-2 ${colors.border} text-center transition-all hover:scale-105 hover:shadow-lg`}
                  >
                    <Award className={`w-16 h-16 ${colors.text} mx-auto mb-4`} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{badge.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {badge.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(badge.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
