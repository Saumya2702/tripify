import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, Calendar, DollarSign, Heart, Users, 
  Clock, Coffee, Sun, Moon, UtensilsCrossed, 
  Save, Sparkles
} from "lucide-react";

interface DayActivity {
  activity: string;
  description: string;
  duration: string;
  cost: string;
  tips: string;
}

interface Restaurant {
  name: string;
  type: string;
  meal: string;
  description: string;
  priceRange: string;
}

interface DayPlan {
  day: number;
  title: string;
  morning: DayActivity;
  afternoon: DayActivity;
  evening: DayActivity;
  restaurants: Restaurant[];
  accommodation?: string;
  transportTips?: string;
}

interface ItineraryData {
  destination: string;
  duration: number;
  budget: string;
  interests: string[];
  travelStyle: string;
  pace: string;
  foodPreferences: string[];
  days: DayPlan[];
}

interface ItineraryDisplayProps {
  itinerary: ItineraryData;
  onSave: () => void;
  onNew: () => void;
  saving: boolean;
}

const ItineraryDisplay = ({ itinerary, onSave, onNew, saving }: ItineraryDisplayProps) => {
  const TimeSlot = ({ 
    icon: Icon, 
    time, 
    activity, 
    color 
  }: { 
    icon: any; 
    time: string; 
    activity: DayActivity; 
    color: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-lg">{activity.activity}</h4>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {activity.duration} • {activity.cost}
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground ml-12">{activity.description}</p>
      <div className="ml-12 p-3 bg-accent/20 rounded-lg">
        <p className="text-xs flex items-start gap-2">
          <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
          <span><strong>Pro tip:</strong> {activity.tips}</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card border-0 gradient-hero text-white">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-4xl mb-2 flex items-center gap-2">
                <MapPin className="w-8 h-8" />
                {itinerary.destination}
              </CardTitle>
              <CardDescription className="text-white/80 text-lg">
                Your personalized {itinerary.duration}-day adventure
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={onSave} disabled={saving} variant="secondary" size="sm">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button onClick={onNew} variant="secondary" size="sm">
                Plan Another Trip
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              <DollarSign className="w-3 h-3 mr-1" />
              {itinerary.budget}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Users className="w-3 h-3 mr-1" />
              {itinerary.travelStyle}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Calendar className="w-3 h-3 mr-1" />
              {itinerary.pace} pace
            </Badge>
            {itinerary.interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="bg-white/20 text-white">
                <Heart className="w-3 h-3 mr-1" />
                {interest}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Day by day itinerary */}
      {itinerary.days.map((day) => (
        <Card key={day.day} className="shadow-card border-0">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardTitle className="text-2xl flex items-center gap-2">
              Day {day.day}: {day.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Morning */}
            <TimeSlot 
              icon={Coffee} 
              time="Morning" 
              activity={day.morning} 
              color="gradient-peach"
            />
            
            <Separator />

            {/* Afternoon */}
            <TimeSlot 
              icon={Sun} 
              time="Afternoon" 
              activity={day.afternoon} 
              color="gradient-mint"
            />
            
            <Separator />

            {/* Evening */}
            <TimeSlot 
              icon={Moon} 
              time="Evening" 
              activity={day.evening} 
              color="gradient-lavender"
            />

            {/* Restaurants */}
            {day.restaurants && day.restaurants.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-primary" />
                    Where to Eat
                  </h4>
                  <div className="grid gap-3">
                    {day.restaurants.map((restaurant, idx) => (
                      <div key={idx} className="p-4 bg-secondary/20 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-semibold">{restaurant.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {restaurant.type} • {restaurant.meal}
                            </p>
                          </div>
                          <Badge variant="outline">{restaurant.priceRange}</Badge>
                        </div>
                        <p className="text-sm">{restaurant.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Transport tips */}
            {day.transportTips && (
              <>
                <Separator />
                <div className="p-4 bg-accent/10 rounded-lg">
                  <h4 className="font-semibold mb-2">Getting Around</h4>
                  <p className="text-sm">{day.transportTips}</p>
                </div>
              </>
            )}

            {/* Accommodation */}
            {day.accommodation && (
              <>
                <Separator />
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Where to Stay</h4>
                  <p className="text-sm">{day.accommodation}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ItineraryDisplay;
