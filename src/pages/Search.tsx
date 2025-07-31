import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Search as SearchIcon, Filter, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Memory {
  id: string
  memory_date: string
  memory_text: string
  mood: string
  dear_past_me?: string
  image_url?: string
  created_at: string
}

const Search = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedMood, setSelectedMood] = useState<string>('all')
  const [memories, setMemories] = useState<Memory[]>([])
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(false)

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

  const moods = ['Happy', 'Sad', 'Grateful', 'Lonely', 'Regretful', 'Excited', 'Inspired']

  useEffect(() => {
    if (user) {
      fetchAllMemories()
    }
  }, [user])

  useEffect(() => {
    filterMemories()
  }, [searchQuery, selectedYear, selectedMood, memories])

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
      setMemories(data || [])
    }
    setLoading(false)
  }

  const filterMemories = () => {
    let filtered = memories

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(memory => 
        memory.memory_text.toLowerCase().includes(query) ||
        (memory.dear_past_me && memory.dear_past_me.toLowerCase().includes(query)) ||
        memory.mood.toLowerCase().includes(query)
      )
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(memory => 
        new Date(memory.memory_date).getFullYear().toString() === selectedYear
      )
    }

    // Filter by mood
    if (selectedMood !== 'all') {
      filtered = filtered.filter(memory => memory.mood === selectedMood)
    }

    setFilteredMemories(filtered)
  }

  const getAvailableYears = () => {
    const years = [...new Set(memories.map(memory => 
      new Date(memory.memory_date).getFullYear()
    ))].sort((a, b) => b - a)
    return years
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-primary/20 px-1 rounded">
          {part}
        </mark>
      ) : part
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
          <h1 className="font-display text-2xl text-primary">Search & Filter</h1>
          <p className="text-sm text-muted-foreground">Find your memories</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search and Filter Controls */}
          <Card className="magical-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="h-5 w-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <Input
                    placeholder="Search memories, messages, or moods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Year Filter */}
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {getAvailableYears().map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Mood Filter */}
                <Select value={selectedMood} onValueChange={setSelectedMood}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Moods</SelectItem>
                    {moods.map(mood => (
                      <SelectItem key={mood} value={mood}>
                        <span className="flex items-center gap-2">
                          <span>{moodEmojis[mood as keyof typeof moodEmojis]}</span>
                          <span>{mood}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedYear('all')
                    setSelectedMood('all')
                  }}
                  className="w-full md:w-auto"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>

              {/* Results Summary */}
              <div className="text-sm text-muted-foreground">
                Found {filteredMemories.length} memories
                {searchQuery && ` matching "${searchQuery}"`}
                {selectedYear !== 'all' && ` from ${selectedYear}`}
                {selectedMood !== 'all' && ` with ${selectedMood} mood`}
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading memories...</p>
            </div>
          )}

          {/* Search Results */}
          {!loading && (
            <div className="space-y-4">
              {filteredMemories.length === 0 ? (
                <Card className="magical-shadow">
                  <CardContent className="text-center py-12">
                    <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No memories found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or filters
                    </p>
                    <Button onClick={() => navigate('/add-memory')} variant="outline">
                      Add New Memory
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredMemories.map((memory) => (
                  <Card 
                    key={memory.id} 
                    className="magical-shadow hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/memory/${memory.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Badge 
                            variant="outline" 
                            className={moodColors[memory.mood as keyof typeof moodColors]}
                          >
                            {moodEmojis[memory.mood as keyof typeof moodEmojis]} {memory.mood}
                          </Badge>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(memory.memory_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-foreground">
                          {highlightText(memory.memory_text, searchQuery)}
                        </p>
                        
                        {memory.dear_past_me && (
                          <blockquote className="border-l-4 border-primary/20 pl-4 text-sm text-muted-foreground italic">
                            "Dear Past Me: {highlightText(memory.dear_past_me, searchQuery)}"
                          </blockquote>
                        )}

                        {memory.image_url && (
                          <div className="aspect-video rounded-lg overflow-hidden max-w-md">
                            <img 
                              src={memory.image_url} 
                              alt="Memory"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search