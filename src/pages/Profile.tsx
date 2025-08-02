import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Lock, Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  display_name: string | null
  avatar_url: string | null
}

const Profile = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    display_name: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      })
    } else if (data) {
      setProfile(data)
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        display_name: data.display_name || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
    }
    setLoading(false)
  }

  const updateProfile = async () => {
    if (!user) return

    setUpdating(true)
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        first_name: formData.first_name || null,
        last_name: formData.last_name || null,
        display_name: formData.display_name || null,
      })

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
      fetchProfile()
    }
    setUpdating(false)
  }

  const updatePassword = async () => {
    if (!formData.new_password || !formData.confirm_password) {
      toast({
        title: "Missing information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      })
      return
    }

    if (formData.new_password !== formData.confirm_password) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both password fields match.",
        variant: "destructive",
      })
      return
    }

    setUpdating(true)
    const { error } = await supabase.auth.updateUser({
      password: formData.new_password
    })

    if (error) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      })
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }))
    }
    setUpdating(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading profile...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')} 
          className="mb-6 hover-scale"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="magical-shadow memory-card bg-card/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="text-2xl bg-primary/10">
                    {(profile?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="font-display text-2xl text-primary">
                {profile?.display_name || 'Your Profile'}
              </CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </CardHeader>
          </Card>

          {/* Profile Information */}
          <Card className="magical-shadow memory-card bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="How you'd like to be addressed"
                />
              </div>
              <Button 
                onClick={updateProfile} 
                disabled={updating}
                className="memory-gradient hover-scale"
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="magical-shadow memory-card bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={formData.new_password}
                  onChange={(e) => setFormData(prev => ({ ...prev, new_password: e.target.value }))}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirm_password: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>
              <Button 
                onClick={updatePassword} 
                disabled={updating}
                variant="outline"
                className="magical-shadow hover-scale"
              >
                {updating ? 'Updating...' : 'Update Password'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile