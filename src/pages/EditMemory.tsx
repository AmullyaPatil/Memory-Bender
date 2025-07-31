import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { CalendarIcon, ArrowLeft, Upload, Save } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface Memory {
  id: string
  memory_date: string
  memory_text: string
  mood: string
  dear_past_me?: string
  image_url?: string
}

const EditMemory = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [memory, setMemory] = useState<Memory | null>(null)
  const [memoryDate, setMemoryDate] = useState<Date>()
  const [memoryText, setMemoryText] = useState('')
  const [mood, setMood] = useState('')
  const [dearPastMe, setDearPastMe] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const moods = [
    { value: 'Happy', emoji: '😊', color: 'text-yellow-600' },
    { value: 'Sad', emoji: '😢', color: 'text-blue-600' },
    { value: 'Grateful', emoji: '🙏', color: 'text-green-600' },
    { value: 'Lonely', emoji: '😔', color: 'text-purple-600' },
    { value: 'Regretful', emoji: '😞', color: 'text-red-600' },
    { value: 'Excited', emoji: '🤩', color: 'text-orange-600' },
    { value: 'Inspired', emoji: '✨', color: 'text-pink-600' },
  ]

  useEffect(() => {
    if (user && id) {
      fetchMemory()
    }
  }, [user, id])

  const fetchMemory = async () => {
    if (!user || !id) return

    setLoading(true)
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      toast({
        title: "Error loading memory",
        description: error.message,
        variant: "destructive",
      })
      navigate('/dashboard')
    } else {
      setMemory(data)
      setMemoryDate(new Date(data.memory_date))
      setMemoryText(data.memory_text)
      setMood(data.mood)
      setDearPastMe(data.dear_past_me || '')
    }
    setLoading(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }
      setImageFile(file)
    }
  }

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${user!.id}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('memory-images')
      .upload(fileName, file)

    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from('memory-images')
      .getPublicUrl(fileName)
    
    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !memoryDate || !memoryText || !mood || !memory) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      let imageUrl = memory.image_url
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const { error } = await supabase
        .from('memories')
        .update({
          memory_date: memoryDate.toISOString().split('T')[0],
          memory_text: memoryText,
          mood,
          dear_past_me: dearPastMe || null,
          image_url: imageUrl,
        })
        .eq('id', memory.id)

      if (error) throw error

      toast({
        title: "Memory updated!",
        description: "Your changes have been saved ✨",
      })
      
      navigate(`/memory/${memory.id}`)
    } catch (error) {
      console.error('Error updating memory:', error)
      toast({
        title: "Error updating memory",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!memory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Memory not found</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/memory/${memory.id}`)}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Memory
          </Button>
          <h1 className="font-display text-2xl text-primary">Edit Memory</h1>
          <p className="text-sm text-muted-foreground">Update your memory details</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="magical-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5 text-primary" />
                Edit Memory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="space-y-2">
                  <Label>Memory Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !memoryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {memoryDate ? format(memoryDate, "PPP") : "Select a date from the past"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={memoryDate}
                        onSelect={setMemoryDate}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Memory Text */}
                <div className="space-y-2">
                  <Label htmlFor="memory-text">Memory *</Label>
                  <Textarea
                    id="memory-text"
                    placeholder="What happened on this day? Share your memory..."
                    value={memoryText}
                    onChange={(e) => setMemoryText(e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                </div>

                {/* Mood Selection */}
                <div className="space-y-2">
                  <Label>Mood *</Label>
                  <Select value={mood} onValueChange={setMood} required>
                    <SelectTrigger>
                      <SelectValue placeholder="How were you feeling?" />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map((moodOption) => (
                        <SelectItem key={moodOption.value} value={moodOption.value}>
                          <span className="flex items-center gap-2">
                            <span className="text-lg">{moodOption.emoji}</span>
                            <span className={moodOption.color}>{moodOption.value}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Current Image Display */}
                {memory.image_url && !imageFile && (
                  <div className="space-y-2">
                    <Label>Current Image</Label>
                    <div className="aspect-video rounded-lg overflow-hidden border">
                      <img 
                        src={memory.image_url} 
                        alt="Current memory"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image-upload">
                    {memory.image_url ? 'Update Photo (optional)' : 'Memory Photo (optional)'}
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1"
                    />
                    {imageFile && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Upload className="h-4 w-4" />
                        {imageFile.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dear Past Me */}
                <div className="space-y-2">
                  <Label htmlFor="dear-past-me">Dear Past Me (optional)</Label>
                  <Textarea
                    id="dear-past-me"
                    placeholder="What would you tell your past self about this moment?"
                    value={dearPastMe}
                    onChange={(e) => setDearPastMe(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    A message to your past self - advice, comfort, or reflection
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/memory/${memory.id}`)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={saving || !memoryDate || !memoryText || !mood}
                    className="flex-1"
                  >
                    {saving ? 'Updating...' : 'Update Memory'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EditMemory