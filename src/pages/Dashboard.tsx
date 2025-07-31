import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { CalendarDays, Plus, Search, LogOut } from 'lucide-react'
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

  const moodColors = {
    Happy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Sad: 'bg-blue-100 text-blue-800 border-blue-200', 
    Grateful: 'bg-green-100 text-green-800 border-green-200',
    Lonely: 'bg-purple-100 text-purple-800 border-purple-200',
    Regretful: 'bg-red-100 text-red-800 border-red-200',
    Excited: 'bg-orange-100 text-orange-800 border-orange-200',
    Inspired: 'bg-pink-100 text-pink-800 border-pink-200'
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl text-primary">Memory Bender</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/add-memory')} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Memory
            </Button>
            <Button onClick={() => navigate('/timeline')} variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Timeline
            </Button>
            <Button onClick={() => navigate('/search')} variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="magical-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Memory Calendar
                  </CardTitle>
                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-3 py-1 border border-input rounded-md bg-background"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                  modifiers={{
                    hasMemory: (date) => hasMemoryOnDate(date)
                  }}
                  modifiersStyles={{
                    hasMemory: { 
                      backgroundColor: 'hsl(var(--primary))', 
                      color: 'hsl(var(--primary-foreground))',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Selected Date Memories */}
          <div>
            <Card className="magical-shadow">
              <CardHeader>
                <CardTitle>
                  {selectedDate 
                    ? `Memories from ${selectedDate.toLocaleDateString()}`
                    : 'Select a date'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-4">
                    {getMemoriesForDate(selectedDate).map((memory) => (
                      <Card key={memory.id} className="border-l-4 border-l-primary">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge 
                              variant="outline" 
                              className={moodColors[memory.mood as keyof typeof moodColors]}
                            >
                              {moodEmojis[memory.mood as keyof typeof moodEmojis]} {memory.mood}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground mb-2">{memory.memory_text}</p>
                          {memory.dear_past_me && (
                            <p className="text-xs text-muted-foreground italic">
                              "Dear Past Me: {memory.dear_past_me}"
                            </p>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 p-0 h-auto text-xs"
                            onClick={() => navigate(`/memory/${memory.id}`)}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {getMemoriesForDate(selectedDate).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No memories for this date</p>
                        <Button 
                          onClick={() => navigate('/add-memory')} 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Memory
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Click on a date to see your memories
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard