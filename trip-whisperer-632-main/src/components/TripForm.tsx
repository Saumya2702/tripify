import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface TripFormData {
  destination: string;
  duration: number;
  budget: string;
  interests: string[];
  travelStyle: string;
  pace: string;
  foodPreferences: string[];
}

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  loading: boolean;
}

const TripForm = ({ onSubmit, loading }: TripFormProps) => {
  const [formData, setFormData] = useState<TripFormData>({
    destination: "",
    duration: 7,
    budget: "medium",
    interests: [],
    travelStyle: "balanced",
    pace: "balanced",
    foodPreferences: [],
  });

  const interestOptions = [
    "Nature", "Adventure", "History", "Nightlife", 
    "Food", "Shopping", "Art & Culture", "Beach", "Mountains"
  ];

  const foodOptions = [
    "Vegetarian", "Vegan", "Non-Veg", "Street Food", 
    "Fine Dining", "Local Cuisine"
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleFoodToggle = (food: string) => {
    setFormData(prev => ({
      ...prev,
      foodPreferences: prev.foodPreferences.includes(food)
        ? prev.foodPreferences.filter(f => f !== food)
        : [...prev.foodPreferences, food]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="shadow-card border-0">
      <CardHeader>
        <CardTitle className="text-3xl">Plan Your Adventure</CardTitle>
        <CardDescription>Tell us about your dream trip and we'll create a personalized itinerary</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g., Paris, France"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Trip Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="30"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Level</Label>
              <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget-Friendly</SelectItem>
                  <SelectItem value="medium">Moderate</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Interests (select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                  />
                  <Label htmlFor={interest} className="cursor-pointer text-sm">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="travelStyle">Travel Style</Label>
              <Select value={formData.travelStyle} onValueChange={(value) => setFormData({ ...formData, travelStyle: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo Traveler</SelectItem>
                  <SelectItem value="couple">Couple</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pace">Travel Pace</Label>
              <Select value={formData.pace} onValueChange={(value) => setFormData({ ...formData, pace: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relaxed">Relaxed</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="packed">Packed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Food Preferences</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {foodOptions.map((food) => (
                <div key={food} className="flex items-center space-x-2">
                  <Checkbox
                    id={food}
                    checked={formData.foodPreferences.includes(food)}
                    onCheckedChange={() => handleFoodToggle(food)}
                  />
                  <Label htmlFor={food} className="cursor-pointer text-sm">
                    {food}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Crafting Your Itinerary...
              </>
            ) : (
              "Generate My Itinerary"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TripForm;
