import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Edit, Trash2, Calendar, MessageSquare } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

interface Memory {
  id: string
  memory_date: string
  memory_text: string
  mood: string
  dear_past_me?: string
  image_url?: string
  created_at: string
  updated_at: string
}

const ViewMemory = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [memory, setMemory] = useState<Memory | null>(null)
  const [loading, setLoading] = useState(true)
  const [flipped, setFlipped] = useState(false)

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
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!memory) return

    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', memory.id)

    if (error) {
      toast({
        title: "Error deleting memory",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Memory deleted",
        description: "Your memory has been removed",
      })
      navigate('/dashboard')
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
            onClick={() => navigate('/dashboard')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="font-display text-2xl text-primary">Memory Details</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(memory.memory_date).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Memory Card */}
            <div className="lg:col-span-2">
              <div 
                className={`flip-card-container relative h-96 cursor-pointer ${flipped ? 'flipped' : ''}`}
                onClick={() => setFlipped(!flipped)}
              >
                {/* Front of card */}
                <Card className={`flip-card flip-card-front absolute inset-0 magical-shadow transition-transform duration-700 ${flipped ? 'rotate-y-180 opacity-0' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge 
                        variant="outline" 
                        className={moodColors[memory.mood as keyof typeof moodColors]}
                      >
                        {moodEmojis[memory.mood as keyof typeof moodEmojis]} {memory.mood}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(memory.memory_date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {memory.image_url && (
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={memory.image_url} 
                          alt="Memory"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="text-foreground leading-relaxed">{memory.memory_text}</p>
                    {memory.dear_past_me && (
                      <div className="text-center pt-4">
                        <p className="text-sm text-muted-foreground">Click to flip and see your message to the past</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Back of card */}
                {memory.dear_past_me && (
                  <Card className={`flip-card flip-card-back absolute inset-0 magical-shadow transition-transform duration-700 bg-gradient-to-br from-primary/5 to-primary/10 ${!flipped ? 'rotate-y-180 opacity-0' : ''}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <MessageSquare className="h-5 w-5" />
                        Dear Past Me
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-full">
                      <blockquote className="text-lg italic text-center border-l-4 border-primary pl-6">
                        "{memory.dear_past_me}"
                      </blockquote>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Actions & Timeline */}
            <div className="space-y-6">
              {/* Actions */}
              <Card className="magical-shadow">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => navigate(`/edit-memory/${memory.id}`)}
                    className="w-full"
                    variant="outline"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Memory
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Memory
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your memory.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Delete Memory
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>

              {/* Memory Info */}
              <Card className="magical-shadow">
                <CardHeader>
                  <CardTitle>Memory Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(memory.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated:</span>
                    <span>{new Date(memory.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mood:</span>
                    <Badge variant="outline" className="text-xs">
                      {moodEmojis[memory.mood as keyof typeof moodEmojis]} {memory.mood}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewMemory