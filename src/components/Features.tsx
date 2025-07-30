import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: "📅",
      title: "Reverse Calendar",
      description: "Browse memories by date across multiple years. See how the same day felt in different seasons of your life.",
      gradient: "from-primary/20 to-accent/20"
    },
    {
      icon: "💭",
      title: "Dear Past Me",
      description: "Leave heartfelt messages to your past self. Wisdom, comfort, or simply acknowledgment of who you were.",
      gradient: "from-secondary/20 to-primary/20"
    },
    {
      icon: "🎭",
      title: "Mood Tracking",
      description: "Track emotions with beautiful mood indicators. Watch your emotional journey unfold over time.",
      gradient: "from-accent/20 to-secondary/20"
    },
    {
      icon: "🔍",
      title: "Memory Search",
      description: "Find specific memories instantly. Search by keywords, moods, or time periods.",
      gradient: "from-primary/20 to-secondary/20"
    },
    {
      icon: "📸",
      title: "Visual Memories",
      description: "Attach photos to your entries. Create a visual timeline of your most precious moments.",
      gradient: "from-secondary/20 to-accent/20"
    },
    {
      icon: "⏰",
      title: "Time Travel",
      description: "Compare the same date across different years. Discover patterns and growth in your journey.",
      gradient: "from-accent/20 to-primary/20"
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Features that make
            <span className="text-primary block lg:inline"> memories magical</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every feature is designed to help you connect with your past self and 
            understand the beautiful tapestry of your emotional journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover:shadow-memory transition-all duration-500 hover:scale-105 border-primary/10 bg-card/50 backdrop-blur-sm animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <CardTitle className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <p className="text-muted-foreground mb-6">
            Ready to start your memory journey?
          </p>
          <div className="inline-flex items-center space-x-2 text-primary">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="font-medium">Your memories are waiting to be discovered</span>
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;