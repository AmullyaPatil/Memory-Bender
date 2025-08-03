import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { CalendarDays, Plus, Search, LogOut, User, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


interface Memory {
  id: string
  memory_date: string
  memory_text: string
  mood: string
  dear_past_me?: string
  image_url?: string
}

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [memories, setMemories] = useState<Memory[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  const moodColors = {
    Happy: 'bg-primary/10 text-primary border-primary/20',
    Sad: 'bg-secondary/10 text-secondary-foreground border-secondary/20', 
    Grateful: 'bg-accent/10 text-accent-foreground border-accent/20',
    Lonely: 'bg-muted text-muted-foreground border-muted-foreground/20',
    Regretful: 'bg-destructive/10 text-destructive border-destructive/20',
    Excited: 'bg-primary/20 text-primary border-primary/30',
    Inspired: 'bg-accent/20 text-accent-foreground border-accent/30'
  }

  const moodEmojis = {
    Happy: '😊',
    Sad: '😢',
    Grateful: '🙏',
    Lonely: '😔',
    Regretful: '😞',
    Excited: '🤩',
    Inspired: '✨'
  }

  useEffect(() => {
    if (user) {
      fetchMemories()
      fetchProfile()
    }
  }, [user, selectedYear])

  const fetchMemories = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', user.id)
      .gte('memory_date', `${selectedYear}-01-01`)
      .lte('memory_date', `${selectedYear}-12-31`)
      .order('memory_date', { ascending: false })

    if (error) {
      toast({
        title: "Error loading memories",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setMemories(data || [])
    }
    setLoading(false)
  }

  const fetchProfile = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setProfile(data)
    }
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      })
    } else {
      navigate('/')
    }
  }

  const getMemoriesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return memories.filter(memory => memory.memory_date === dateStr)
  }

  const hasMemoryOnDate = (date: Date) => {
    return getMemoriesForDate(date).length > 0
  }

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="min-h-screen hero-gradient">
      {/* Dashboard Header */}
      <header className="border-b border-border/20 bg-card/80 backdrop-blur-sm magical-shadow">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-full memory-gradient" style={{ animation: 'float 8s ease-in-out infinite' }}>
                  <CalendarDays className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-xl md:text-3xl text-primary glow-pulse">Memory Bender</h1>
                  <p className="text-xs md:text-sm text-muted-foreground truncate max-w-48 md:max-w-none">
                    Welcome back, {profile?.display_name || profile?.first_name || user?.email}
                  </p>
                </div>
              </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-3">
              <Button onClick={() => navigate('/')} variant="outline" className="magical-shadow">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button onClick={() => navigate('/add-memory')} className="memory-gradient hover-scale">
                <Plus className="h-4 w-4 mr-2" />
                Add Memory
              </Button>
              <Button onClick={() => navigate('/timeline')} variant="outline" className="magical-shadow">
                Timeline
              </Button>
              <Button onClick={() => navigate('/search')} variant="outline" size="sm" className="magical-shadow">
                <Search className="h-4 w-4" />
              </Button>
              <Button onClick={() => navigate('/profile')} variant="outline" size="sm" className="magical-shadow">
                <User className="h-4 w-4" />
              </Button>
              <Button onClick={handleSignOut} variant="outline" size="sm" className="magical-shadow">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden w-full justify-between gap-2">
              <div className="grid grid-cols-4 gap-2 flex-1">
                <Button onClick={() => navigate('/')} variant="outline" size="sm" className="magical-shadow text-xs h-8">
                  <Home className="h-3 w-3 mr-1" />
                  Home
                </Button>
                <Button onClick={() => navigate('/add-memory')} className="memory-gradient text-xs h-8">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
                <Button onClick={() => navigate('/search')} variant="outline" size="sm" className="magical-shadow text-xs h-8">
                  <Search className="h-3 w-3 mr-1" />
                  Search
                </Button>
                <Button onClick={() => navigate('/timeline')} variant="outline" size="sm" className="magical-shadow text-xs h-8">
                  Timeline
                </Button>
              </div>
              <div className="flex gap-1">
                <Button onClick={() => navigate('/profile')} variant="outline" size="sm" className="magical-shadow">
                  <User className="h-3 w-3" />
                </Button>
                <Button onClick={handleSignOut} variant="outline" size="sm" className="magical-shadow">
                  <LogOut className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
          {/* Enhanced Calendar */}
          <div className="md:col-span-2 xl:col-span-2">
            <Card className="magical-shadow memory-card bg-card/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 font-display text-xl">
                    <div className="p-2 rounded-lg memory-gradient" style={{ animation: 'sparkle 8s ease-in-out infinite' }}>
                      <CalendarDays className="h-5 w-5 text-primary-foreground" />
                    </div>
                    Memory Calendar
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Year:</span>
                    <select 
                      value={selectedYear} 
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="px-3 py-2 border border-input rounded-lg bg-background/50 backdrop-blur-sm font-medium magical-shadow focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span>Days with memories</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-xl border w-full bg-background/50 backdrop-blur-sm magical-shadow hover-scale"
                  modifiers={{
                    hasMemory: (date) => hasMemoryOnDate(date)
                  }}
                  modifiersStyles={{
                    hasMemory: { 
                      backgroundColor: 'hsl(var(--primary))', 
                      color: 'hsl(var(--primary-foreground))',
                      fontWeight: 'bold',
                      borderRadius: '6px',
                      position: 'relative'
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Middle Section - Quick Actions & Recent Activity */}
          <div className="space-y-4 md:space-y-6">
            {/* Quick Actions */}
            <Card className="magical-shadow memory-card bg-card/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <div className="p-2 rounded-lg memory-gradient" style={{ animation: 'sparkle 8s ease-in-out infinite' }}>
                    ⚡
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    onClick={() => navigate('/add-memory')} 
                    className="memory-gradient hover-scale justify-start h-12"
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    Add Today's Memory
                  </Button>
                  <Button 
                    onClick={() => navigate('/search')} 
                    variant="outline" 
                    className="magical-shadow justify-start h-12"
                  >
                    <Search className="h-4 w-4 mr-3" />
                    Search Memories
                  </Button>
                  <Button 
                    onClick={() => navigate('/timeline')} 
                    variant="outline" 
                    className="magical-shadow justify-start h-12"
                  >
                    <CalendarDays className="h-4 w-4 mr-3" />
                    View Timeline
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Memories */}
            <Card className="magical-shadow memory-card bg-card/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <div className="p-2 rounded-lg memory-gradient" style={{ animation: 'sparkle 8s ease-in-out infinite' }}>
                    🕒
                  </div>
                  Recent Memories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {memories.slice(0, 3).map((memory) => (
                    <div key={memory.id} className="p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer hover-scale"
                         onClick={() => navigate(`/memory/${memory.id}`)}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(memory.memory_date).toLocaleDateString()}
                        </span>
                        <span className="text-sm">
                          {moodEmojis[memory.mood as keyof typeof moodEmojis]}
                        </span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">{memory.memory_text}</p>
                    </div>
                  ))}
                  {memories.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <p className="text-sm">No memories yet</p>
                      <p className="text-xs">Start creating your journey!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mood Insights */}
            <Card className="magical-shadow memory-card bg-card/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <div className="p-2 rounded-lg memory-gradient" style={{ animation: 'sparkle 8s ease-in-out infinite' }}>
                    🎭
                  </div>
                  Mood Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(
                    memories.reduce((acc, memory) => {
                      acc[memory.mood] = (acc[memory.mood] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([mood, count]) => (
                      <div key={mood} className="flex items-center justify-between p-2 rounded-lg bg-background/30">
                        <div className="flex items-center gap-2">
                          <span>{moodEmojis[mood as keyof typeof moodEmojis]}</span>
                          <span className="text-sm font-medium">{mood}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                    ))}
                  {memories.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      Track your moods as you create memories
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Selected Date Memories */}
          <div className="md:col-span-2 xl:col-span-1 space-y-4 md:space-y-6">
            <Card className="magical-shadow memory-card bg-card/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <div className="p-2 rounded-lg memory-gradient" style={{ animation: 'sparkle 8s ease-in-out infinite' }}>
                    ✨
                  </div>
                  {selectedDate 
                    ? `${selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}`
                    : 'Select a date'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-4">
                    {getMemoriesForDate(selectedDate).map((memory) => (
                      <Card key={memory.id} className="memory-card border-l-4 border-l-primary bg-background/50 backdrop-blur-sm">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <Badge 
                              variant="outline" 
                              className={`${moodColors[memory.mood as keyof typeof moodColors]} magical-shadow sparkle-animation`}
                            >
                              {moodEmojis[memory.mood as keyof typeof moodEmojis]} {memory.mood}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground mb-3 line-height-relaxed">{memory.memory_text}</p>
                          {memory.dear_past_me && (
                            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 mb-3">
                              <p className="text-xs text-accent-foreground italic">
                                💌 "Dear Past Me: {memory.dear_past_me}"
                              </p>
                            </div>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 hover-scale text-primary hover:text-primary"
                            onClick={() => navigate(`/memory/${memory.id}`)}
                          >
                            View Details →
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {getMemoriesForDate(selectedDate).length === 0 && (
                      <div className="text-center py-12">
                        <div className="p-6 rounded-full memory-gradient w-16 h-16 mx-auto mb-4 flex items-center justify-center float-animation">
                          <Plus className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <p className="text-muted-foreground mb-4">No memories for this beautiful day yet</p>
                        <Button 
                          onClick={() => navigate('/add-memory')} 
                          className="memory-gradient hover-scale"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Memory
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="p-6 rounded-full memory-gradient w-16 h-16 mx-auto mb-4 flex items-center justify-center float-animation">
                      <CalendarDays className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <p className="text-muted-foreground">Click on a date to discover your memories</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Memory Stats Card */}
            <Card className="magical-shadow memory-card bg-card/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <div className="p-2 rounded-lg memory-gradient sparkle-animation">
                    📊
                  </div>
                  Your {selectedYear} Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-2xl font-bold text-primary">{memories.length}</div>
                    <div className="text-xs text-muted-foreground">Total Memories</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                    <div className="text-2xl font-bold text-secondary-foreground">
                      {new Set(memories.map(m => m.memory_date)).size}
                    </div>
                    <div className="text-xs text-muted-foreground">Days Captured</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard