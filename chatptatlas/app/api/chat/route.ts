import { NextRequest, NextResponse } from 'next/server';

interface Location {
  lat: number;
  lng: number;
  name?: string;
}

// Simple geocoding database for common locations
const locationDatabase: Record<string, Location> = {
  'paris': { lat: 48.8566, lng: 2.3522, name: 'Paris, France' },
  'london': { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
  'tokyo': { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan' },
  'new york': { lat: 40.7128, lng: -74.0060, name: 'New York, USA' },
  'sydney': { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia' },
  'rome': { lat: 41.9028, lng: 12.4964, name: 'Rome, Italy' },
  'barcelona': { lat: 41.3851, lng: 2.1734, name: 'Barcelona, Spain' },
  'berlin': { lat: 52.5200, lng: 13.4050, name: 'Berlin, Germany' },
  'dubai': { lat: 25.2048, lng: 55.2708, name: 'Dubai, UAE' },
  'los angeles': { lat: 34.0522, lng: -118.2437, name: 'Los Angeles, USA' },
  'san francisco': { lat: 37.7749, lng: -122.4194, name: 'San Francisco, USA' },
  'singapore': { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  'hong kong': { lat: 22.3193, lng: 114.1694, name: 'Hong Kong' },
  'amsterdam': { lat: 52.3676, lng: 4.9041, name: 'Amsterdam, Netherlands' },
  'cairo': { lat: 30.0444, lng: 31.2357, name: 'Cairo, Egypt' },
  'moscow': { lat: 55.7558, lng: 37.6173, name: 'Moscow, Russia' },
  'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai, India' },
  'beijing': { lat: 39.9042, lng: 116.4074, name: 'Beijing, China' },
  'rio de janeiro': { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro, Brazil' },
  'istanbul': { lat: 41.0082, lng: 28.9784, name: 'Istanbul, Turkey' },
  'eiffel tower': { lat: 48.8584, lng: 2.2945, name: 'Eiffel Tower, Paris' },
  'statue of liberty': { lat: 40.6892, lng: -74.0445, name: 'Statue of Liberty, New York' },
  'taj mahal': { lat: 27.1751, lng: 78.0421, name: 'Taj Mahal, India' },
  'great wall': { lat: 40.4319, lng: 116.5704, name: 'Great Wall of China' },
  'mount everest': { lat: 27.9881, lng: 86.9250, name: 'Mount Everest' },
  'grand canyon': { lat: 36.1069, lng: -112.1129, name: 'Grand Canyon, USA' },
};

function findLocation(message: string): Location | null {
  const lowerMessage = message.toLowerCase();

  for (const [key, location] of Object.entries(locationDatabase)) {
    if (lowerMessage.includes(key)) {
      return location;
    }
  }

  return null;
}

function generateResponse(message: string, location: Location | null): string {
  if (!location) {
    return "I'd love to help you explore that location! Could you tell me about a specific city or landmark? I can show you places like Paris, Tokyo, New York, or famous landmarks like the Eiffel Tower or Taj Mahal.";
  }

  const locationName = location.name || 'this location';

  if (message.toLowerCase().includes('tell me about') || message.toLowerCase().includes('what is')) {
    return `${locationName} is located at coordinates ${location.lat.toFixed(4)}°, ${location.lng.toFixed(4)}°. I've marked it on the map for you! What would you like to know about this location?`;
  } else if (message.toLowerCase().includes('show') || message.toLowerCase().includes('find')) {
    return `Here's ${locationName} on the map! The pin shows the exact location.`;
  } else if (message.toLowerCase().includes('where is')) {
    return `${locationName} is right here! I've placed a marker on the map at coordinates ${location.lat.toFixed(4)}°, ${location.lng.toFixed(4)}°.`;
  } else {
    return `I've found ${locationName} and marked it on the map for you! Feel free to ask me about other locations.`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const location = findLocation(message);
    const responseMessage = generateResponse(message, location);

    return NextResponse.json({
      message: responseMessage,
      location: location,
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
