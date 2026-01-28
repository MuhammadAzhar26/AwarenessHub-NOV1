import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { Trophy, Award, Clock, ExternalLink } from 'lucide-react'

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
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-12 rounded-lg text-white mb-8">
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
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-8 h-8 text-blue-600" />
              <h3 className="text-body font-semibold text-gray-900">Stages Completed</h3>
            </div>
            <p className="text-h1 font-bold text-gray-900">{stats.completedStages}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-8 h-8 text-green-600" />
              <h3 className="text-body font-semibold text-gray-900">Hints Used</h3>
            </div>
            <p className="text-h1 font-bold text-gray-900">{stats.hintsUsed}</p>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h2 font-bold text-gray-900 flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-600" />
              Badge Collection ({badges.filter(b => selectedCategory === 'all' || b.category === selectedCategory).length})
            </h2>
            
            <Link
              to="/badges"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              View All Badges
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <div className="mb-6">
            {badges.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 text-body focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              <p className="text-body text-gray-600">No badges earned yet. Complete challenges to earn badges!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {badges
                .filter(badge => selectedCategory === 'all' || badge.category === selectedCategory)
                .map((badge) => {
                const categoryColors: Record<string, { border: string; bg: string; text: string }> = {
                  milestone: { border: 'border-yellow-400', bg: 'from-yellow-100 to-yellow-50', text: 'text-yellow-700' },
                  points: { border: 'border-blue-400', bg: 'from-blue-100 to-blue-50', text: 'text-blue-700' },
                  module: { border: 'border-green-400', bg: 'from-green-100 to-green-50', text: 'text-green-700' },
                  special: { border: 'border-purple-400', bg: 'from-purple-100 to-purple-50', text: 'text-purple-700' },
                  training: { border: 'border-blue-400', bg: 'from-blue-100 to-blue-50', text: 'text-blue-700' },
                  simulation: { border: 'border-cyan-400', bg: 'from-cyan-100 to-cyan-50', text: 'text-cyan-700' },
                  level: { border: 'border-orange-400', bg: 'from-orange-100 to-orange-50', text: 'text-orange-700' },
                  competitive: { border: 'border-red-400', bg: 'from-red-100 to-red-50', text: 'text-red-700' },
                  consistency: { border: 'border-green-400', bg: 'from-green-100 to-green-50', text: 'text-green-700' },
                  checklist: { border: 'border-indigo-400', bg: 'from-indigo-100 to-indigo-50', text: 'text-indigo-700' },
                  domain: { border: 'border-pink-400', bg: 'from-pink-100 to-pink-50', text: 'text-pink-700' },
                }
                const colors = categoryColors[badge.category] || categoryColors.milestone

                return (
                  <div
                    key={badge.id}
                    className={`bg-gradient-to-br ${colors.bg} p-6 rounded-lg border-2 ${colors.border} text-center transition-all hover:scale-105 hover:shadow-xl`}
                  >
                    <Award className={`w-16 h-16 ${colors.text} mx-auto mb-4`} />
                    <h3 className="text-body font-semibold text-gray-900 mb-2">{badge.title}</h3>
                    <p className="text-small text-gray-600 mb-3">{badge.description}</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`text-caption font-medium px-2 py-1 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {badge.category}
                      </span>
                    </div>
                    <p className="text-caption text-gray-500 mt-2">
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
