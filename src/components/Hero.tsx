import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-hourglass.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <section 
      className="min-h-screen flex items-center justify-center hero-gradient relative overflow-hidden"
      style={{ paddingTop: '4rem' }}
    >
      {/* Floating sparkles - fewer on mobile */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-4 lg:left-20 w-2 h-2 bg-memory-sparkle rounded-full sparkle-animation" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-8 lg:right-32 w-1 h-1 bg-primary rounded-full sparkle-animation" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-accent rounded-full sparkle-animation" style={{ animationDelay: '2s' }} />
        <div className="hidden sm:block absolute top-60 right-20 w-1 h-1 bg-secondary rounded-full sparkle-animation" style={{ animationDelay: '0.5s' }} />
        <div className="hidden sm:block absolute bottom-40 right-1/3 w-2 h-2 bg-memory-sparkle rounded-full sparkle-animation" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-8 animate-fade-in-up order-1 lg:order-1">
            {/* Logo/Brand */}
            <div className="space-y-2">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                Memory
                <span className="text-primary block lg:inline"> Bender</span>
              </h1>
              <p className="font-display text-lg sm:text-xl lg:text-2xl text-muted-foreground italic px-2 lg:px-0">
                A journal that remembers what you were feeling... across time.
              </p>
            </div>

            {/* Hero Image - Mobile Only */}
            <div className="lg:hidden relative animate-fade-in-up px-4" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                {/* Magical glow effect */}
                <div className="absolute inset-0 bg-gradient-memory rounded-2xl opacity-20 blur-2xl animate-glow-pulse" />
                
                {/* Main image */}
                <div className="relative magical-shadow rounded-2xl overflow-hidden float-animation">
                  <img 
                    src={heroImage}
                    alt="Magical hourglass pouring memories into a calendar"
                    className="w-full h-auto object-cover"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-accent/10" />
                </div>

                {/* Floating memory bubbles - mobile sizing */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full border-2 border-primary/40 flex items-center justify-center float-animation">
                  <span className="text-primary text-sm">💭</span>
                </div>
                <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-secondary/20 rounded-full border-2 border-secondary/40 flex items-center justify-center float-animation" style={{ animationDelay: '1s' }}>
                  <span className="text-secondary text-base">📅</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 max-w-xl mx-auto lg:mx-0 px-4 lg:px-0">
              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
                Log your memories on any past date. Revisit them year by year. 
                Leave words for the you that once was.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground">
                Travel through your emotional timeline and discover patterns, 
                growth, and beautiful moments you might have forgotten.
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 lg:px-0">
              <Button 
                onClick={() => navigate(user ? '/dashboard' : '/auth')}
                size="lg"
                className="memory-gradient text-foreground hover:shadow-glow group transform hover:scale-110 transition-all duration-300 w-full sm:w-auto"
              >
                <span className="mr-2">✨</span>
                Start Remembering
                <span className="ml-2 group-hover:animate-sparkle">⏳</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:bg-primary/10 hover:border-primary/40 w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-6 lg:pt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                <span>Private & Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span>Your Data, Your Story</span>
              </div>
            </div>
          </div>

          {/* Hero Image - Desktop Only */}
          <div className="hidden lg:block relative animate-fade-in-up order-2 lg:order-2 px-4 lg:px-0" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Magical glow effect */}
              <div className="absolute inset-0 bg-gradient-memory rounded-2xl lg:rounded-3xl opacity-20 blur-2xl lg:blur-3xl animate-glow-pulse" />
              
              {/* Main image */}
              <div className="relative magical-shadow rounded-2xl lg:rounded-3xl overflow-hidden float-animation">
                <img 
                  src={heroImage}
                  alt="Magical hourglass pouring memories into a calendar"
                  className="w-full h-auto object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-accent/10" />
              </div>

              {/* Floating memory bubbles - desktop sizing */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full border-2 border-primary/40 flex items-center justify-center float-animation">
                <span className="text-primary text-lg">💭</span>
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-secondary/20 rounded-full border-2 border-secondary/40 flex items-center justify-center float-animation" style={{ animationDelay: '1s' }}>
                <span className="text-secondary text-xl">📅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - hidden on small mobile */}
        <div className="hidden sm:block absolute bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 lg:w-6 lg:h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-1 h-2 lg:h-3 bg-primary rounded-full mt-1.5 lg:mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;