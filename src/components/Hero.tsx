import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-hourglass.jpg";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section 
      className="min-h-screen flex items-center justify-center hero-gradient relative overflow-hidden"
      style={{ paddingTop: '4rem' }}
    >
      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-memory-sparkle rounded-full sparkle-animation" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-32 w-1 h-1 bg-primary rounded-full sparkle-animation" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-accent rounded-full sparkle-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute top-60 right-20 w-1 h-1 bg-secondary rounded-full sparkle-animation" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-memory-sparkle rounded-full sparkle-animation" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
            {/* Logo/Brand */}
            <div className="space-y-2">
              <h1 className="font-display text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                Memory
                <span className="text-primary block lg:inline"> Bender</span>
              </h1>
              <p className="font-display text-xl lg:text-2xl text-muted-foreground italic">
                A journal that remembers what you were feeling... across time.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-4 max-w-xl mx-auto lg:mx-0">
              <p className="text-lg text-foreground/80 leading-relaxed">
                Log your memories on any past date. Revisit them year by year. 
                Leave words for the you that once was.
              </p>
              <p className="text-base text-muted-foreground">
                Travel through your emotional timeline and discover patterns, 
                growth, and beautiful moments you might have forgotten.
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => navigate('/auth')}
                size="lg"
                className="memory-gradient text-foreground hover:shadow-glow group transform hover:scale-110 transition-all duration-300"
              >
                <span className="mr-2">✨</span>
                Start Remembering
                <span className="ml-2 group-hover:animate-sparkle">⏳</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:bg-primary/10 hover:border-primary/40"
              >
                Learn More
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-muted-foreground">
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

          {/* Hero Image */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Magical glow effect */}
              <div className="absolute inset-0 bg-gradient-memory rounded-3xl opacity-20 blur-3xl animate-glow-pulse" />
              
              {/* Main image */}
              <div className="relative magical-shadow rounded-3xl overflow-hidden float-animation">
                <img 
                  src={heroImage}
                  alt="Magical hourglass pouring memories into a calendar"
                  className="w-full h-auto object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-accent/10" />
              </div>

              {/* Floating memory bubbles */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full border-2 border-primary/40 flex items-center justify-center float-animation">
                <span className="text-primary text-lg">💭</span>
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-secondary/20 rounded-full border-2 border-secondary/40 flex items-center justify-center float-animation" style={{ animationDelay: '1s' }}>
                <span className="text-secondary text-xl">📅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;