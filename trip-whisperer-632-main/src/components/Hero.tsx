import { Button } from "@/components/ui/button";
import { MapPin, Sparkles } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-50" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="inline-block">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Travel Planning</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Your Perfect AI Trip Planner
            <br />
            
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Tell us your preferences, and we'll craft a day-by-day itinerary 
            tailored just for you. No more endless research or planning stress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-8 py-6 shadow-soft hover:shadow-card transition-smooth"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Plan My Trip
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Trips Planned</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">150+</div>
              <div className="text-sm text-muted-foreground">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">4.9★</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
