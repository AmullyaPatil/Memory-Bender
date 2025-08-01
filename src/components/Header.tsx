import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Sparkles, User, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Home", path: "/", icon: null },
    { name: "Features", path: "#features", icon: Sparkles },
  ];

  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      const element = document.getElementById(path.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-md border-b border-border/20 magical-shadow">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover-scale"
            onClick={() => navigate('/')}
          >
            <div className="p-2 rounded-full memory-gradient float-animation">
              <CalendarDays className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-primary">Memory Bender</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Journal through time</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors story-link"
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.name}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  className="memory-gradient hover-scale"
                  size="sm"
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => navigate('/auth')} 
                  variant="outline" 
                  className="magical-shadow"
                  size="sm"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/auth')} 
                  className="memory-gradient hover-scale"
                  size="sm"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Free
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-card/95 backdrop-blur-md border-b border-border/20 magical-shadow">
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center gap-2 w-full text-left py-2 text-foreground hover:text-primary transition-colors"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name}
                </button>
              ))}
              
              <div className="pt-4 border-t border-border/20 space-y-3">
                {user ? (
                  <Button 
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="w-full memory-gradient"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={() => {
                        navigate('/auth');
                        setIsMenuOpen(false);
                      }}
                      variant="outline" 
                      className="w-full"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => {
                        navigate('/auth');
                        setIsMenuOpen(false);
                      }}
                      className="w-full memory-gradient"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start Free
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;