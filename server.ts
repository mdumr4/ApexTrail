import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Route: AI Personalized Packing Lists and Route Suggestions
app.post('/api/ai/trek-adviser', async (req, res) => {
  try {
    const {
      trailName,
      region,
      elevation,
      durationDays,
      season,
      userSkillLevel,
      fitnessLevel,
      tripType,
      specialNeeds,
    } = req.body;

    if (!trailName) {
      return res.status(400).json({ error: 'Trail name is required' });
    }

    const skillLevel = userSkillLevel || 'Intermediate';
    const fitness = fitnessLevel || 'Active / Moderate';
    const trekSeason = season || 'Autumn / Fall';

    if (ai) {
      const prompt = `You are a certified IFMGA international mountain guide and high-altitude expedition medical advisor.
Generate a comprehensive, tailored expedition plan for a trekker with the following profile:

- Target Mountain Trail: ${trailName} (${region || 'Alpine'}, peak elevation: ${elevation || 3500}m, duration: ${durationDays || 5} days)
- Season / Planned Month: ${trekSeason}
- Trekker Skill Level: ${skillLevel} (Beginner, Intermediate, Advanced, Mountaineer)
- Physical Fitness: ${fitness}
- Expedition Type: ${tripType || 'Guided Group'}
- Specific Notes / Constraints: ${specialNeeds || 'None'}

Provide:
1. Executive Summary & Suitability Assessment: Honest rating of whether this trek matches their skill level, specific cautions, and pace recommendation.
2. Personalized Route Strategy & Pacing:
   - Acclimatization rules tailored to their skill level.
   - Day-by-day suggested pacing schedule with daily target hiking hours, recommended ascent caps, rest stops, turnaround times, and hazard warnings.
   - Emergency and contingency plan.
3. Tailored Smart Packing Checklist:
   - Grouped into standard mountain categories: "Technical & Footwear", "Layering & Clothing", "Hydration & Alpine Nutrition", "Medical & Altitude Care", "Navigation & Camp Electronics", "Personal & Documents".
   - Each item must have: name, essential (boolean), description, estimated weight in grams, and a skill-tailored tip specifically explaining why someone of ${skillLevel} skill level needs or should handle this item carefully.
4. Alpine Safety Golden Rules: 3 to 5 critical rules for this trail.
5. High-Altitude / Weather Coping Strategy: How to handle elevation drop, wind, freezing conditions, or sudden storm fronts.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an elite mountain guide providing realistic, precision safety gear, altitude acclimation, and route pacing guidance for trekkers. Format output strictly as JSON matching the schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: {
                type: Type.STRING,
                description: 'Overview of the expedition and personal readiness verdict.',
              },
              skillFitAssessment: {
                type: Type.OBJECT,
                properties: {
                  suitabilityLevel: {
                    type: Type.STRING,
                    description: 'e.g., "Well Suited with Preparation", "High Challenge - Guide Recommended", "Ideal Match"',
                  },
                  recommendedPaceMultiplier: {
                    type: Type.NUMBER,
                    description: 'Pace factor e.g., 1.0 standard, 1.25 slower/safer, 0.9 fast',
                  },
                  cautionNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Critical warnings based on skill level and altitude.',
                  },
                },
                required: ['suitabilityLevel', 'cautionNotes'],
              },
              routeStrategy: {
                type: Type.OBJECT,
                properties: {
                  acclimatizationProtocol: {
                    type: Type.STRING,
                    description: 'Specific rule for sleep altitude and ascending rate.',
                  },
                  emergencyContingency: {
                    type: Type.STRING,
                    description: 'Evacuation protocol, SAT communicator guidelines, shelter fallback.',
                  },
                  dailyPacing: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        dayNumber: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        targetHikingHours: { type: Type.NUMBER },
                        recommendedAscentCapM: { type: Type.INTEGER },
                        restStops: { type: Type.STRING },
                        turnaroundTime: { type: Type.STRING },
                        keyHazardWarning: { type: Type.STRING },
                      },
                      required: ['dayNumber', 'title', 'targetHikingHours', 'keyHazardWarning'],
                    },
                  },
                },
                required: ['acclimatizationProtocol', 'emergencyContingency', 'dailyPacing'],
              },
              packingList: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    items: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          essential: { type: Type.BOOLEAN },
                          description: { type: Type.STRING },
                          weightEstimateGrams: { type: Type.INTEGER },
                          skillTip: { type: Type.STRING },
                        },
                        required: ['name', 'essential', 'description', 'weightEstimateGrams', 'skillTip'],
                      },
                    },
                  },
                  required: ['category', 'items'],
                },
              },
              criticalSafetyRules: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              weatherCopingStrategy: {
                type: Type.STRING,
              },
            },
            required: [
              'executiveSummary',
              'skillFitAssessment',
              'routeStrategy',
              'packingList',
              'criticalSafetyRules',
              'weatherCopingStrategy',
            ],
          },
        },
      });

      const jsonText = response.text ? response.text.trim() : '{}';
      const parsedData = JSON.parse(jsonText);
      return res.json({ success: true, source: 'gemini', data: parsedData });
    }

    // High quality programmatic fallback if GEMINI_API_KEY is not set
    const fallbackData = generateExpeditionFallback({
      trailName,
      region,
      elevation: Number(elevation) || 3800,
      durationDays: Number(durationDays) || 5,
      season: trekSeason,
      skillLevel,
      fitness,
      tripType,
      specialNeeds,
    });

    return res.json({
      success: true,
      source: 'heuristic-guide',
      data: fallbackData,
    });
  } catch (error: any) {
    console.error('Error generating AI trek plan:', error);
    // Provide safe fallback even on API runtime errors
    const fallbackData = generateExpeditionFallback(req.body);
    return res.json({
      success: true,
      source: 'heuristic-guide-fallback',
      data: fallbackData,
      note: 'Returned guide recommendations via high-altitude heuristics engine',
    });
  }
});

// Route: Mountain Weather Forecast proxy with lapse-rate adjustments
app.get('/api/weather/mountain', async (req, res) => {
  try {
    const lat = req.query.lat ? Number(req.query.lat) : 27.9881;
    const lng = req.query.lng ? Number(req.query.lng) : 86.925;
    const summitElevation = req.query.elevation ? Number(req.query.elevation) : 5364;

    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max&timezone=auto`;

    const weatherResponse = await fetch(openMeteoUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Weather service returned ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();

    // Calculate elevation lapse rate offset if OpenMeteo model elevation differs from peak summit
    const modelElevation = weatherData.elevation || 1500;
    const elevationDiff = Math.max(0, summitElevation - modelElevation);
    // Standard environmental lapse rate: ~6.5°C drop per 1,000 meters
    const lapseRateAdjustment = (elevationDiff / 1000) * 6.5;

    const currentTempAdjusted = Math.round((weatherData.current?.temperature_2m - lapseRateAdjustment) * 10) / 10;
    const feelsLikeAdjusted = Math.round((weatherData.current?.apparent_temperature - lapseRateAdjustment) * 10) / 10;

    const windGusts = weatherData.current?.wind_gusts_10m || weatherData.current?.wind_speed_10m || 0;
    
    // Mountain condition status
    let safetyLevel = 'Good';
    let safetyNotice = 'Favorable alpine window. Proceed with standard gear.';
    if (windGusts > 55 || currentTempAdjusted < -15 || weatherData.current?.precipitation > 5) {
      safetyLevel = 'Severe Caution';
      safetyNotice = 'High winds or deep freeze detected at altitude. Alpine crampons and storm shells mandatory.';
    } else if (windGusts > 35 || currentTempAdjusted < -5 || weatherData.current?.precipitation > 0) {
      safetyLevel = 'Moderate';
      safetyNotice = 'Chilly high-altitude conditions. Keep thermal layers accessible in pack.';
    }

    res.json({
      success: true,
      data: {
        summitElevation,
        stationElevation: modelElevation,
        temperature: currentTempAdjusted,
        feelsLike: feelsLikeAdjusted,
        humidity: weatherData.current?.relative_humidity_2m,
        windSpeed: weatherData.current?.wind_speed_10m,
        windGusts: weatherData.current?.wind_gusts_10m,
        weatherCode: weatherData.current?.weather_code,
        precipitation: weatherData.current?.precipitation,
        safetyLevel,
        safetyNotice,
        daily: weatherData.daily ? {
          time: weatherData.daily.time,
          temperatureMax: weatherData.daily.temperature_2m_max.map((t: number) => Math.round((t - lapseRateAdjustment) * 10) / 10),
          temperatureMin: weatherData.daily.temperature_2m_min.map((t: number) => Math.round((t - lapseRateAdjustment) * 10) / 10),
          weatherCode: weatherData.daily.weather_code,
          precipitationProbability: weatherData.daily.precipitation_probability_max,
          windGustsMax: weatherData.daily.wind_gusts_10m_max,
          uvIndexMax: weatherData.daily.uv_index_max,
        } : null,
      },
    });
  } catch (error: any) {
    console.error('Weather forecast fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve real-time weather from Open-Meteo',
      data: null,
    });
  }
});

// Heuristic fallback generator for rich expedition plans
function generateExpeditionFallback(params: any) {
  const { trailName, elevation = 4200, durationDays = 6, skillLevel = 'Intermediate', fitness = 'Active / Moderate' } = params;
  const isHighAltitude = elevation > 3500;
  const isBeginner = skillLevel === 'Beginner';

  const dailyPacing = Array.from({ length: Math.min(Math.max(durationDays, 3), 7) }).map((_, i) => {
    const day = i + 1;
    const isSummitDay = day === Math.floor(durationDays * 0.7) || day === durationDays - 1;
    return {
      dayNumber: day,
      title: isSummitDay ? `Day ${day}: Summit Ascent & High Col Push` : `Day ${day}: Ridge Traverse to Camp ${day}`,
      targetHikingHours: isSummitDay ? (isBeginner ? 8.5 : 7.0) : (isBeginner ? 6.5 : 5.0),
      recommendedAscentCapM: isSummitDay ? 850 : 500,
      restStops: '15-min hydration break every 75 minutes; sheltered rock garden at midpoint',
      turnaroundTime: isSummitDay ? '13:00 (strict summit turnaround for weather safety)' : '16:30',
      keyHazardWarning: isSummitDay ? 'Scree fields and sudden wind chill drops on upper ridge' : 'Loose gravel on switchbacks and exposed sun exposure',
    };
  });

  return {
    executiveSummary: `Tailored expedition strategy for ${trailName} (${elevation}m) calibrated for a ${skillLevel} trekker with ${fitness} endurance. ${
      isHighAltitude
        ? 'Because this route exceeds 3,500m, gradual acclimatization and meticulous hydration pacing are non-negotiable.'
        : 'This scenic route demands steady cardiovascular output and diligent footwear protection.'
    }`,
    skillFitAssessment: {
      suitabilityLevel: isBeginner && isHighAltitude ? 'High Challenge - Certified Guide Advised' : 'Optimal Skill Match with Preparation',
      recommendedPaceMultiplier: isBeginner ? 1.25 : 1.0,
      cautionNotes: [
        isHighAltitude ? 'Never ascend more than 500m per night above 3,000m to mitigate Acute Mountain Sickness (AMS).' : 'Pace your knee impact on long downhill segments using dual trekking poles.',
        isBeginner ? 'Do not attempt to push through early fatigue; communicate any headache or dizziness immediately to your expedition leader.' : 'Keep spare gloves and a thermal midlayer at the top of your pack for immediate col wind exposure.',
        'Drink a minimum of 3.5 liters of electrolyte-fortified fluids per day.',
      ],
    },
    routeStrategy: {
      acclimatizationProtocol: isHighAltitude
        ? 'Climb high, sleep low doctrine: on Day 3 or 4, hike 300m above camp during afternoon acclimatization walk, then descend to sleep.'
        : 'Maintain steady aerobic zone 2 heart rate (able to converse in full sentences without gasping).',
      emergencyContingency: 'Equip an active satellite SOS communicator (e.g., Garmin inReach) and carry an insulated emergency bivy sack in your daypack.',
      dailyPacing,
    },
    packingList: [
      {
        category: 'Technical & Footwear',
        items: [
          {
            name: 'High-Ankle Waterproof Trekking Boots (Broken In)',
            essential: true,
            description: 'Vibram sole, Gore-Tex or eVent membrane with robust ankle support.',
            weightEstimateGrams: 1400,
            skillTip: isBeginner ? 'Crucial: Never wear brand-new boots! Hike at least 30km in them before your expedition to prevent debilitating blisters.' : 'Check tread depth and inspect lacing eyelets for wear before departure.',
          },
          {
            name: 'FlickLock Adjustable Trekking Poles (Pair)',
            essential: true,
            description: 'Aircraft aluminum or carbon fiber with extended EVA foam grips.',
            weightEstimateGrams: 480,
            skillTip: 'Reduces knee joint stress by up to 25% on downhill descents and aids balance over river boulders.',
          },
          {
            name: 'Microspikes / Traction Cleats',
            essential: elevation > 3000,
            description: 'Stainless steel spikes with elastomer harness for hard-packed snow and icy moraine trails.',
            weightEstimateGrams: 360,
            skillTip: 'Practice putting them on over your boots in 60 seconds before you reach freezing summit passes.',
          },
        ],
      },
      {
        category: 'Layering & Alpine Clothing',
        items: [
          {
            name: 'Merino Wool Base Layers (Top & Bottom, 200gsm)',
            essential: true,
            description: 'Naturally antimicrobial, moisture-wicking and regulates body heat even when damp.',
            weightEstimateGrams: 420,
            skillTip: 'Strict rule: Zero cotton on mountain trails. Cotton traps sweat and leads to rapid hypothermia.',
          },
          {
            name: 'Packable Down / Synthetic Insulated Puffy (800 Fill)',
            essential: true,
            description: 'High loft insulation for sub-zero summit mornings and rest stops.',
            weightEstimateGrams: 460,
            skillTip: 'Put this jacket on within 60 seconds of halting at camp before your body cools down.',
          },
          {
            name: '3-Layer Hardshell Storm Jacket (Gore-Tex / Pertex)',
            essential: true,
            description: 'Fully seam-taped waterproof breathable jacket with helmet-compatible hood.',
            weightEstimateGrams: 390,
            skillTip: 'Your frontline defense against 60km/h ridge gales and unexpected alpine blizzards.',
          },
          {
            name: 'Thermal Buff & Windproof Mountain Gloves',
            essential: true,
            description: 'Fleece-lined neck gaiter and windstopper gloves with touchscreen fingers.',
            weightEstimateGrams: 150,
            skillTip: 'Keep in an accessible outer zippered pocket, not buried inside your main rucksack.',
          },
        ],
      },
      {
        category: 'Hydration & Alpine Nutrition',
        items: [
          {
            name: 'Wide-Mouth Nalgene Bottle (1L) + Thermal Insulated Parka',
            essential: true,
            description: 'Can double as a hot-water sleeping bag heater on freezing nights.',
            weightEstimateGrams: 280,
            skillTip: 'Do not use narrow hydration bladder hoses above freezing line as the bite valve freezes instantly.',
          },
          {
            name: 'Electrolyte Replacement Powder (Daily Sachets)',
            essential: true,
            description: 'Sodium, magnesium, and potassium replenishment for altitude dehydration.',
            weightEstimateGrams: 200,
            skillTip: 'High altitude breathing expels double the moisture of sea-level respiration.',
          },
          {
            name: 'High-Density Calorie Trail Bars & Energy Chews',
            essential: true,
            description: 'Nut butters, dark chocolate, and complex carbohydrates for sustained output.',
            weightEstimateGrams: 600,
            skillTip: 'Eat 150-200 calories every 90 minutes even if altitude suppresses your appetite.',
          },
        ],
      },
      {
        category: 'Medical & Altitude Care',
        items: [
          {
            name: 'Alpine First Aid Kit & Blister Moleskin Kit',
            essential: true,
            description: 'Compeed hydrocolloid patches, sterile gauze, trauma shears, antiseptic wipes.',
            weightEstimateGrams: 310,
            skillTip: 'Treat hot-spots immediately—never wait until skin tears into an open blister.',
          },
          {
            name: 'Acetazolamide (Diamox) & Altitude Medicine',
            essential: isHighAltitude,
            description: 'Prescription altitude prophylactic for acclimatization (consult your physician).',
            weightEstimateGrams: 50,
            skillTip: 'Recommended for rapid ascent profiles; watch for benign fingertip tingling side-effect.',
          },
          {
            name: 'Finger Pulse Oximeter',
            essential: isHighAltitude,
            description: 'Measures blood oxygen saturation (SpO2) and heart rate at rest.',
            weightEstimateGrams: 65,
            skillTip: 'Check SpO2 morning and night; readings below 70% indicate need for immediate rest or descent.',
          },
        ],
      },
      {
        category: 'Navigation & Camp Electronics',
        items: [
          {
            name: 'Rechargeable Headlamp (350+ Lumens) + Red Light Mode',
            essential: true,
            description: 'For pre-dawn 3:00 AM alpine starts and nocturnal camp navigation.',
            weightEstimateGrams: 110,
            skillTip: 'Sleep with the headlamp inside your sleeping bag so freezing cold does not drain the lithium battery.',
          },
          {
            name: '10,000mAh Rugged Cold-Resistant Power Bank',
            essential: true,
            description: 'Keeps GPS navigation and safety phone charged in sub-zero environments.',
            weightEstimateGrams: 240,
            skillTip: 'Keep stored inside an inner jacket pocket near your core warmth.',
          },
          {
            name: 'Physical Topographic Trail Map & Compass',
            essential: true,
            description: '1:25,000 scale map sealed in a waterproof sleeve.',
            weightEstimateGrams: 90,
            skillTip: 'Batteries die in mountain cold; analog paper and magnetic compass never fail.',
          },
        ],
      },
    ],
    criticalSafetyRules: [
      'The Mountain Always Has the Right of Way: The summit is optional, but returning safely is mandatory.',
      'Strict 1:00 PM Summit Turnaround: Descend immediately if you have not reached the pass/peak by 13:00.',
      'Never Ascend With AMS Symptoms: If you experience persistent headache, nausea, or ataxia, stop ascending. If symptoms worsen, descend at least 500m immediately.',
      'Leave No Trace (LNT): Pack out all wrappers, waste, and micro-plastics.',
    ],
    weatherCopingStrategy:
      'Mountain weather can drop 15°C within 30 minutes during sudden squalls. Always keep your rain shell and warm hat within top lid access. If electrical thunder is heard, stay clear of ridgelines and isolated tall trees.',
  };
}

// Dev vs Prod Vite Integration
const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`ApexTrail Expedition Server running on port ${PORT} (dev: ${isDev})`);
});
