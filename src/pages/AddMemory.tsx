import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { CalendarIcon, ArrowLeft, Upload, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const AddMemory = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [memoryDate, setMemoryDate] = useState<Date>()
  const [memoryText, setMemoryText] = useState('')
  const [mood, setMood] = useState('')
  const [dearPastMe, setDearPastMe] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const moods = [
    { value: 'Happy', emoji: '😊', color: 'text-yellow-600' },
    { value: 'Sad', emoji: '😢', color: 'text-blue-600' },
    { value: 'Grateful', emoji: '🙏', color: 'text-green-600' },
    { value: 'Lonely', emoji: '😔', color: 'text-purple-600' },
    { value: 'Regretful', emoji: '😞', color: 'text-red-600' },
    { value: 'Excited', emoji: '🤩', color: 'text-orange-600' },
    { value: 'Inspired', emoji: '✨', color: 'text-pink-600' },
  ]

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
    
    if (!user || !memoryDate || !memoryText || !mood) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const { error } = await supabase
        .from('memories')
        .insert({
          user_id: user.id,
          memory_date: memoryDate.toISOString().split('T')[0],
          memory_text: memoryText,
          mood,
          dear_past_me: dearPastMe || null,
          image_url: imageUrl,
        })

      if (error) throw error

      toast({
        title: "Memory saved!",
        description: "Your memory has been captured in time ✨",
      })
      
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving memory:', error)
      toast({
        title: "Error saving memory",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 lg:py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-2"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="font-display text-xl lg:text-2xl text-primary">Add New Memory</h1>
          <p className="text-xs lg:text-sm text-muted-foreground">Capture a moment from your past</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="magical-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Create Memory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                {/* Date Selection */}
                <div className="space-y-2">
                  <Label className="text-sm lg:text-base">Memory Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-10 lg:h-11",
                          !memoryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="text-sm lg:text-base">
                          {memoryDate ? format(memoryDate, "PPP") : "Select a date from the past"}
                        </span>
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
                  <Label htmlFor="memory-text" className="text-sm lg:text-base">Memory *</Label>
                  <Textarea
                    id="memory-text"
                    placeholder="What happened on this day? Share your memory..."
                    value={memoryText}
                    onChange={(e) => setMemoryText(e.target.value)}
                    className="min-h-[100px] lg:min-h-[120px] text-sm lg:text-base"
                    required
                  />
                </div>

                {/* Mood Selection */}
                <div className="space-y-2">
                  <Label className="text-sm lg:text-base">Mood *</Label>
                  <Select value={mood} onValueChange={setMood} required>
                    <SelectTrigger className="h-10 lg:h-11">
                      <SelectValue placeholder="How were you feeling?" />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map((moodOption) => (
                        <SelectItem key={moodOption.value} value={moodOption.value}>
                          <span className="flex items-center gap-2">
                            <span className="text-base lg:text-lg">{moodOption.emoji}</span>
                            <span className={`${moodOption.color} text-sm lg:text-base`}>{moodOption.value}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image-upload" className="text-sm lg:text-base">Memory Photo (optional)</Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1 text-sm lg:text-base"
                    />
                    {imageFile && (
                      <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                        <Upload className="h-3 w-3 lg:h-4 lg:w-4" />
                        <span className="truncate max-w-32 lg:max-w-none">{imageFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dear Past Me */}
                <div className="space-y-2">
                  <Label htmlFor="dear-past-me" className="text-sm lg:text-base">Dear Past Me (optional)</Label>
                  <Textarea
                    id="dear-past-me"
                    placeholder="What would you tell your past self about this moment?"
                    value={dearPastMe}
                    onChange={(e) => setDearPastMe(e.target.value)}
                    className="min-h-[80px] lg:min-h-[100px] text-sm lg:text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    A message to your past self - advice, comfort, or reflection
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 text-sm lg:text-base"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading || !memoryDate || !memoryText || !mood}
                    className="flex-1 text-sm lg:text-base"
                  >
                    {loading ? 'Saving...' : 'Save Memory'}
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

export default AddMemory