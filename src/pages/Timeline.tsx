import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Memory {
  id: string
  memory_date: string
  memory_text: string
  mood: string
  dear_past_me?: string
  image_url?: string
  year: number
}

const Timeline = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [selectedDate, setSelectedDate] = useState<string>('') // MM-DD format
  const [availableYears, setAvailableYears] = useState<number[]>([])
  const [currentYearIndex, setCurrentYearIndex] = useState(0)
  const [memoriesByYear, setMemoriesByYear] = useState<Record<number, Memory[]>>({})
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
      fetchAllMemories()
    }
  }, [user])

  const fetchAllMemories = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', user.id)
      .order('memory_date', { ascending: false })

    if (error) {
      toast({
        title: "Error loading memories",
        description: error.message,
        variant: "destructive",
      })
    } else {
      const memories = data || []
      
      // Group memories by year and date
      const groupedByYear: Record<number, Memory[]> = {}
      const years = new Set<number>()
      
      memories.forEach(memory => {
        const date = new Date(memory.memory_date)
        const year = date.getFullYear()
        const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        
        years.add(year)
        
        if (!groupedByYear[year]) {
          groupedByYear[year] = []
        }
        
        groupedByYear[year].push({
          ...memory,
          year
        })
      })
      
      const sortedYears = Array.from(years).sort((a, b) => b - a)
      setAvailableYears(sortedYears)
      setMemoriesByYear(groupedByYear)
      
      // Set initial date if there are memories
      if (memories.length > 0) {
        const firstMemory = memories[0]
        const date = new Date(firstMemory.memory_date)
        const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        setSelectedDate(monthDay)
      }
    }
    setLoading(false)
  }

  const getMemoriesForDate = (monthDay: string) => {
    if (!selectedDate) return []
    
    const memories: Array<Memory & { displayYear: number }> = []
    
    availableYears.forEach(year => {
      const yearMemories = memoriesByYear[year] || []
      yearMemories.forEach(memory => {
        const date = new Date(memory.memory_date)
        const memoryMonthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        
        if (memoryMonthDay === monthDay) {
          memories.push({
            ...memory,
            displayYear: year
          })
        }
      })
    })
    
    return memories.sort((a, b) => b.displayYear - a.displayYear)
  }

  const getAllUniqueDates = () => {
    const dates = new Set<string>()
    
    Object.values(memoriesByYear).forEach(memories => {
      memories.forEach(memory => {
        const date = new Date(memory.memory_date)
        const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        dates.add(monthDay)
      })
    })
    
    return Array.from(dates).sort()
  }

  const formatDate = (monthDay: string) => {
    const [month, day] = monthDay.split('-')
    const date = new Date(2000, parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const uniqueDates = getAllUniqueDates()
  const currentDateIndex = uniqueDates.indexOf(selectedDate)

  const nextDate = () => {
    if (currentDateIndex < uniqueDates.length - 1) {
      setSelectedDate(uniqueDates[currentDateIndex + 1])
    }
  }

  const prevDate = () => {
    if (currentDateIndex > 0) {
      setSelectedDate(uniqueDates[currentDateIndex - 1])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="font-display text-2xl text-primary">Memory Timeline</h1>
          <p className="text-sm text-muted-foreground">Compare memories across different years</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Date Navigation */}
          {uniqueDates.length > 0 && (
            <Card className="magical-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Browse by Date
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevDate}
                    disabled={currentDateIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold">
                      {selectedDate ? formatDate(selectedDate) : 'Select a date'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentDateIndex + 1} of {uniqueDates.length} dates
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextDate}
                    disabled={currentDateIndex === uniqueDates.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Date Slider */}
                <div className="px-4">
                  <Slider
                    value={[currentDateIndex]}
                    onValueChange={([index]) => setSelectedDate(uniqueDates[index])}
                    max={uniqueDates.length - 1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Memory Comparison */}
          {selectedDate && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">
                Memories from {formatDate(selectedDate)}
              </h2>
              
              {getMemoriesForDate(selectedDate).length === 0 ? (
                <Card className="magical-shadow">
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No memories for this date</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't recorded any memories for {formatDate(selectedDate)} yet
                    </p>
                    <Button onClick={() => navigate('/add-memory')} variant="outline">
                      Add Memory for This Date
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getMemoriesForDate(selectedDate).map((memory) => (
                    <Card 
                      key={memory.id} 
                      className="magical-shadow hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate(`/memory/${memory.id}`)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <Badge 
                            variant="outline" 
                            className={moodColors[memory.mood as keyof typeof moodColors]}
                          >
                            {moodEmojis[memory.mood as keyof typeof moodEmojis]} {memory.mood}
                          </Badge>
                          <div className="text-lg font-bold text-primary">
                            {memory.displayYear}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {memory.image_url && (
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <img 
                              src={memory.image_url} 
                              alt="Memory"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        
                        <p className="text-sm text-foreground line-clamp-3">
                          {memory.memory_text}
                        </p>
                        
                        {memory.dear_past_me && (
                          <blockquote className="border-l-4 border-primary/20 pl-3 text-xs text-muted-foreground italic line-clamp-2">
                            "Dear Past Me: {memory.dear_past_me}"
                          </blockquote>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No Memories State */}
          {uniqueDates.length === 0 && (
            <Card className="magical-shadow">
              <CardContent className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                <h3 className="text-2xl font-semibold mb-4">No memories yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start building your memory collection to see how different moments compare across the years
                </p>
                <Button onClick={() => navigate('/add-memory')}>
                  Create Your First Memory
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Timeline