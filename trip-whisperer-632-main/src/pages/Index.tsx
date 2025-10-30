import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, User as UserIcon } from "lucide-react";
import Hero from "@/components/Hero";
import TripForm from "@/components/TripForm";
import ItineraryDisplay from "@/components/ItineraryDisplay";

interface TripFormData {
  destination: string;
  duration: number;
  budget: string;
  interests: string[];
  travelStyle: string;
  pace: string;
  foodPreferences: string[];
}

interface ItineraryData {
  destination: string;
  duration: number;
  budget: string;
  interests: string[];
  travelStyle: string;
  pace: string;
  foodPreferences: string[];
  days: any[];
}

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  const handleGetStarted = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleGenerateItinerary = async (formData: TripFormData) => {
    if (!user) {
      toast.error("Please sign in to generate itineraries");
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-itinerary", {
        body: formData,
      });

      if (error) throw error;

      setItinerary(data);
      toast.success("Your itinerary is ready!");
      
      // Scroll to itinerary
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }, 100);
    } catch (error: any) {
      console.error("Error generating itinerary:", error);
      toast.error(error.message || "Failed to generate itinerary");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItinerary = async () => {
    if (!user || !itinerary) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("itineraries").insert({
        user_id: user.id,
        destination: itinerary.destination,
        duration: itinerary.duration,
        budget: itinerary.budget,
        interests: itinerary.interests,
        travel_style: itinerary.travelStyle,
        pace: itinerary.pace,
        food_preferences: itinerary.foodPreferences,
        itinerary_data: itinerary.days,
      });

      if (error) throw error;

      toast.success("Itinerary saved successfully!");
    } catch (error: any) {
      console.error("Error saving itinerary:", error);
      toast.error("Failed to save itinerary");
    } finally {
      setSaving(false);
    }
  };

  const handleNewItinerary = () => {
    setItinerary(null);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b shadow-soft">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-peach bg-clip-text text-transparent">
            TripCraft AI
          </h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!showForm && !itinerary && (
        <Hero onGetStarted={handleGetStarted} />
      )}

      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 py-12">
        {showForm && !itinerary && (
          <div ref={formRef}>
            <TripForm onSubmit={handleGenerateItinerary} loading={loading} />
          </div>
        )}

        {itinerary && (
          <ItineraryDisplay
            itinerary={itinerary}
            onSave={handleSaveItinerary}
            onNew={handleNewItinerary}
            saving={saving}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 TripCraft AI. Powered by AI to make your travels unforgettable.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
