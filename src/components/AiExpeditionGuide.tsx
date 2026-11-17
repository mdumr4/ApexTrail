import React, { useState, useEffect } from 'react';
import { useTrek } from '../context/TrekContext';
import { MountainTrail, SkillLevel, FitnessLevel, ExpeditionPlan, PackingCategory, PackingItem } from '../types';
import {
  Sparkles,
  Mountain,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  Copy,
  Check,
  ShieldAlert,
  Weight,
  Layers,
  RefreshCw,
} from 'lucide-react';

export const AiExpeditionGuide: React.FC = () => {
  const { trails, userProfile, setUserProfile, prefilledAiTrail, setBookingModalTrail } = useTrek();

  // Selected Trail
  const [selectedTrailId, setSelectedTrailId] = useState<string>(
    prefilledAiTrail?.id || trails[0]?.id || ''
  );

  // Profile overrides
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(userProfile.skillLevel);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(userProfile.fitnessLevel);
  const [season, setSeason] = useState<string>('Autumn / Peak Clear (Oct-Nov)');
  const [tripType, setTripType] = useState<string>('Small Guided Group (4-8 Trekkers)');
  const [specialNeeds, setSpecialNeeds] = useState<string>('');

  // AI Response state
  const [plan, setPlan] = useState<ExpeditionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active filter for packing list
  const [packingFilter, setPackingFilter] = useState<'all' | 'essential' | 'unpacked'>('all');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');
  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    if (prefilledAiTrail) {
      setSelectedTrailId(prefilledAiTrail.id);
    }
  }, [prefilledAiTrail]);

  const currentTrail: MountainTrail | undefined = trails.find((t) => t.id === selectedTrailId) || trails[0];

  const handleGenerate = async () => {
    if (!currentTrail) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/trek-adviser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trailName: currentTrail.name,
          region: currentTrail.region,
          elevation: currentTrail.highestPointMeters,
          durationDays: currentTrail.durationDays,
          season,
          userSkillLevel: skillLevel,
          fitnessLevel,
          tripType,
          specialNeeds: specialNeeds.trim() || 'Standard gear requirements',
        }),
      });

      if (!response.ok) {
        throw new Error(`Advisor engine responded with HTTP ${response.status}`);
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        const formattedPackingList: PackingCategory[] = resJson.data.packingList.map(
          (cat: any, cIdx: number) => ({
            category: cat.category,
            items: cat.items.map((item: any, iIdx: number) => ({
              id: `item-${cIdx}-${iIdx}`,
              name: item.name,
              essential: Boolean(item.essential),
              description: item.description,
              weightEstimateGrams: Number(item.weightEstimateGrams) || 250,
              skillTip: item.skillTip || 'Essential mountain item.',
              packed: false,
            })),
          })
        );

        const newPlan: ExpeditionPlan = {
          trailName: currentTrail.name,
          skillLevel,
          fitnessLevel,
          season,
          executiveSummary: resJson.data.executiveSummary,
          skillFitAssessment: resJson.data.skillFitAssessment,
          routeStrategy: resJson.data.routeStrategy,
          packingList: formattedPackingList,
          criticalSafetyRules: resJson.data.criticalSafetyRules || [],
          weatherCopingStrategy: resJson.data.weatherCopingStrategy || '',
          generatedAt: new Date().toLocaleTimeString(),
        };

        setPlan(newPlan);
      } else {
        throw new Error(resJson.error || 'Failed to generate advisory');
      }
    } catch (err: any) {
      console.error('Advisor error:', err);
      setErrorMsg(err.message || 'Could not connect to AI advisor. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemPacked = (itemId: string) => {
    if (!plan) return;
    setPlan((prev) => {
      if (!prev) return null;
      const updatedCategories = prev.packingList.map((cat) => ({
        ...cat,
        items: cat.items.map((item) =>
          item.id === itemId ? { ...item, packed: !item.packed } : item
        ),
      }));
      return { ...prev, packingList: updatedCategories };
    });
  };

  const allItems: PackingItem[] = plan ? plan.packingList.flatMap((c) => c.items) : [];
  const totalItemsCount = allItems.length;
  const packedCount = allItems.filter((i) => i.packed).length;
  const packedPercent = totalItemsCount > 0 ? Math.round((packedCount / totalItemsCount) * 100) : 0;
  const totalWeightGrams = allItems.reduce((acc, i) => acc + i.weightEstimateGrams, 0);
  const totalWeightKg = (totalWeightGrams / 1000).toFixed(1);

  const getFilteredCategories = () => {
    if (!plan) return [];
    return plan.packingList
      .filter((cat) => activeCategoryTab === 'all' || cat.category === activeCategoryTab)
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => {
          if (packingFilter === 'essential') return item.essential;
          if (packingFilter === 'unpacked') return !item.packed;
          return true;
        }),
      }))
      .filter((cat) => cat.items.length > 0);
  };

  const handleCopyChecklist = () => {
    if (!plan) return;
    let text = `APEXTRAIL EXPEDITION PACKING LIST: ${plan.trailName}\n`;
    text += `Skill Level: ${plan.skillLevel} | Fitness: ${plan.fitnessLevel}\n`;
    text += `Total Weight Estimate: ${totalWeightKg} kg\n\n`;

    plan.packingList.forEach((cat) => {
      text += `--- ${cat.category.toUpperCase()} ---\n`;
      cat.items.forEach((item) => {
        text += `[${item.packed ? 'X' : ' '}] ${item.name} (${item.weightEstimateGrams}g) - ${item.essential ? 'MANDATORY' : 'RECOMMENDED'}\n`;
        text += `    Tip (${plan.skillLevel}): ${item.skillTip}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#ffffff]">
      {/* Title Header */}
      <div className="border-b border-[#ebebeb] pb-6">
        <div className="inline-flex items-center gap-2 text-[12px] font-bold text-[#ff385c] uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          AI Mountain Expeditions Engine
        </div>
        <h1 className="text-[26px] sm:text-[32px] font-semibold text-[#222222] tracking-tight">
          Personalized Packing Lists &amp; Route Pacing
        </h1>
        <p className="mt-1 text-[15px] text-[#6a6a6a] max-w-2xl leading-relaxed">
          High-altitude gear checklists and daily ascent limits tailored specifically to your personal skill level, physical fitness, and the route elevation.
        </p>
      </div>

      {/* Form Controls Card (Airbnb Clean Box) */}
      <div className="p-6 rounded-2xl border border-[#dddddd] shadow-airbnb bg-[#ffffff] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Trail Selector */}
          <div>
            <label className="block text-[12px] font-bold uppercase text-[#222222] mb-1.5">
              Mountain Trail
            </label>
            <select
              value={selectedTrailId}
              onChange={(e) => setSelectedTrailId(e.target.value)}
              className="w-full h-12 px-3 rounded-lg border border-[#dddddd] text-[14px] text-[#222222] bg-white focus:border-[#222222] focus:outline-none cursor-pointer"
            >
              {trails.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.highestPointMeters}m)
                </option>
              ))}
            </select>
          </div>

          {/* 2. Skill Level */}
          <div>
            <label className="block text-[12px] font-bold uppercase text-[#222222] mb-1.5">
              Your Skill Level
            </label>
            <select
              value={skillLevel}
              onChange={(e) => {
                const newSkill = e.target.value as SkillLevel;
                setSkillLevel(newSkill);
                setUserProfile((p) => ({ ...p, skillLevel: newSkill }));
              }}
              className="w-full h-12 px-3 rounded-lg border border-[#dddddd] text-[14px] text-[#222222] bg-white focus:border-[#222222] focus:outline-none cursor-pointer"
            >
              <option value="Beginner">Beginner (Day hikes, &lt;2,500m)</option>
              <option value="Intermediate">Intermediate (Multi-day, 3,500m)</option>
              <option value="Advanced">Advanced (High passes, 4,500m+)</option>
              <option value="Mountaineer">Mountaineer (5,500m+, glaciers)</option>
            </select>
          </div>

          {/* 3. Fitness Level */}
          <div>
            <label className="block text-[12px] font-bold uppercase text-[#222222] mb-1.5">
              Physical Fitness
            </label>
            <select
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value as FitnessLevel)}
              className="w-full h-12 px-3 rounded-lg border border-[#dddddd] text-[14px] text-[#222222] bg-white focus:border-[#222222] focus:outline-none cursor-pointer"
            >
              <option value="Casual Walker">Casual Walker</option>
              <option value="Active / Moderate">Active / Moderate</option>
              <option value="Marathon / High Endurance">Marathon / High Endurance</option>
              <option value="Peak Athlete">Peak Athlete</option>
            </select>
          </div>
        </div>

        {/* Secondary row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#ebebeb]">
          <div>
            <label className="block text-[12px] font-medium text-[#6a6a6a] mb-1">
              Season / Departure Month
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-[#dddddd] text-[14px] text-[#222222] bg-white focus:border-[#222222] focus:outline-none cursor-pointer"
            >
              <option value="Spring (Mar-May)">Spring (Meltwater &amp; snow passes)</option>
              <option value="Summer (Jun-Aug)">Summer (Warm days, afternoon squalls)</option>
              <option value="Autumn / Peak Clear (Oct-Nov)">Autumn (Crisp days, clear skies)</option>
              <option value="Winter (Dec-Feb)">Winter (Deep freeze conditions)</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#6a6a6a] mb-1">
              Expedition Style
            </label>
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-[#dddddd] text-[14px] text-[#222222] bg-white focus:border-[#222222] focus:outline-none cursor-pointer"
            >
              <option value="Small Guided Group (4-8 Trekkers)">Guided Group with Lead Guide</option>
              <option value="Self-Guided Fastpacking">Self-Guided Fastpacking</option>
              <option value="Porter-Assisted Lodge Trek">Porter-Assisted Lodge Trek</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#6a6a6a] mb-1">
              Specific Needs (Optional)
            </label>
            <input
              type="text"
              value={specialNeeds}
              onChange={(e) => setSpecialNeeds(e.target.value)}
              placeholder="e.g. Cold sensitive, photography kit..."
              className="w-full h-11 px-3 rounded-lg border border-[#dddddd] text-[14px] text-[#222222] focus:border-[#222222] focus:outline-none"
            />
          </div>
        </div>

        {/* Primary CTA (button-primary in Rausch #ff385c) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[13px] text-[#6a6a6a]">
            Targeting <strong>{currentTrail?.name}</strong> &bull; Peak {currentTrail?.highestPointMeters}m
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGenerate}
            className="w-full sm:w-auto h-12 px-8 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] active:bg-[#e00b41] text-[#ffffff] font-medium text-[15px] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating expedition strategy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Tailored Plan &amp; Packing List</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[14px] flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* PLAN OUTPUT DISPLAY */}
      {plan && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Suitability Banner */}
          <div className="p-6 rounded-2xl border border-[#dddddd] bg-[#ffffff] shadow-airbnb space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebebeb] pb-4">
              <div>
                <div className="text-[12px] font-semibold text-[#ff385c] uppercase">
                  Skill Assessment &bull; {plan.skillLevel}
                </div>
                <h3 className="text-[20px] font-semibold text-[#222222]">
                  {plan.skillFitAssessment.suitabilityLevel}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#f7f7f7] text-[#222222] text-[12px] font-semibold border border-[#dddddd]">
                  Pace Factor: {plan.skillFitAssessment.recommendedPaceMultiplier}x
                </span>

                <button
                  onClick={handleCopyChecklist}
                  className="px-3 py-1.5 rounded-lg border border-[#dddddd] hover:border-[#222222] text-[13px] font-medium text-[#222222] flex items-center gap-1.5 transition-colors"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy plan</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-[15px] text-[#3f3f3f] leading-relaxed">
              {plan.executiveSummary}
            </p>

            {plan.skillFitAssessment.cautionNotes.length > 0 && (
              <div className="p-4 rounded-xl bg-[#f7f7f7] border border-[#ebebeb] space-y-2">
                <div className="text-[13px] font-semibold text-[#222222] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#ff385c]" />
                  <span>Important cautions for {plan.skillLevel} trekkers:</span>
                </div>
                <ul className="space-y-1.5 text-[13px] text-[#3f3f3f] pl-2">
                  {plan.skillFitAssessment.cautionNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#222222] shrink-0 mt-1.5" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Guided Route Pacing Strategy */}
          <div className="p-6 rounded-2xl border border-[#dddddd] bg-[#ffffff] shadow-airbnb space-y-5">
            <div>
              <h3 className="text-[18px] font-semibold text-[#222222]">
                Day-by-Day Hiking Strategy &amp; Turnaround Rules
              </h3>
              <p className="text-[13px] text-[#6a6a6a]">
                Acclimatization rule: {plan.routeStrategy.acclimatizationProtocol}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {plan.routeStrategy.dailyPacing.map((day) => (
                <div
                  key={day.dayNumber}
                  className="p-4 rounded-xl border border-[#dddddd] bg-[#ffffff] space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[12px] text-[#6a6a6a] mb-1">
                      <span className="font-bold text-[#ff385c]">Day {day.dayNumber}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {day.targetHikingHours} hrs
                      </span>
                    </div>
                    <div className="text-[14px] font-semibold text-[#222222]">
                      {day.title}
                    </div>
                  </div>

                  <div className="text-[12px] text-[#6a6a6a] border-t border-[#ebebeb] pt-2 space-y-1">
                    {day.turnaroundTime && (
                      <div className="text-[#222222] font-medium">
                        Turnaround: {day.turnaroundTime}
                      </div>
                    )}
                    <div className="text-rose-700 flex items-start gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                      <span>{day.keyHazardWarning}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Packing Checklist */}
          <div className="p-6 rounded-2xl border border-[#dddddd] bg-[#ffffff] shadow-airbnb space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ebebeb] pb-4">
              <div>
                <h3 className="text-[18px] font-semibold text-[#222222]">
                  Interactive Packing Checklist ({plan.skillLevel} Calibrated)
                </h3>
                <p className="text-[13px] text-[#6a6a6a]">
                  Check off items as you pack into your expedition duffel.
                </p>
              </div>

              {/* Weight Badge */}
              <div className="p-2.5 px-4 rounded-xl bg-[#f7f7f7] border border-[#dddddd] flex items-center gap-2.5">
                <Weight className="w-4 h-4 text-[#222222]" />
                <div className="text-[13px]">
                  Estimated Weight: <strong className="text-[#222222] font-semibold">{totalWeightKg} kg</strong>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#3f3f3f]">
                  Packed: {packedCount} of {totalItemsCount} items
                </span>
                <span className="font-semibold text-[#222222]">{packedPercent}% complete</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#ebebeb] overflow-hidden">
                <div
                  className="h-full bg-[#222222] rounded-full transition-all duration-300"
                  style={{ width: `${packedPercent}%` }}
                />
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPackingFilter('all')}
                  className={`px-3 py-1 rounded-full border text-[13px] font-medium transition-colors ${
                    packingFilter === 'all'
                      ? 'border-[#222222] bg-[#222222] text-[#ffffff]'
                      : 'border-[#dddddd] text-[#222222] hover:border-[#222222]'
                  }`}
                >
                  All ({totalItemsCount})
                </button>
                <button
                  onClick={() => setPackingFilter('essential')}
                  className={`px-3 py-1 rounded-full border text-[13px] font-medium transition-colors ${
                    packingFilter === 'essential'
                      ? 'border-[#222222] bg-[#222222] text-[#ffffff]'
                      : 'border-[#dddddd] text-[#222222] hover:border-[#222222]'
                  }`}
                >
                  Essential Only
                </button>
                <button
                  onClick={() => setPackingFilter('unpacked')}
                  className={`px-3 py-1 rounded-full border text-[13px] font-medium transition-colors ${
                    packingFilter === 'unpacked'
                      ? 'border-[#222222] bg-[#222222] text-[#ffffff]'
                      : 'border-[#dddddd] text-[#222222] hover:border-[#222222]'
                  }`}
                >
                  Remaining Unpacked ({totalItemsCount - packedCount})
                </button>
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1 overflow-x-auto text-[12px]">
                <button
                  onClick={() => setActiveCategoryTab('all')}
                  className={`px-2.5 py-1 rounded-lg ${
                    activeCategoryTab === 'all' ? 'font-semibold text-[#222222]' : 'text-[#6a6a6a]'
                  }`}
                >
                  All
                </button>
                {plan.packingList.map((c) => (
                  <button
                    key={c.category}
                    onClick={() => setActiveCategoryTab(c.category)}
                    className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${
                      activeCategoryTab === c.category ? 'font-semibold text-[#222222]' : 'text-[#6a6a6a]'
                    }`}
                  >
                    {c.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Grouped Checklist */}
            <div className="space-y-6 pt-2">
              {getFilteredCategories().map((cat) => (
                <div key={cat.category} className="space-y-3">
                  <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#222222] border-b border-[#ebebeb] pb-1">
                    {cat.category}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cat.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleItemPacked(item.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          item.packed
                            ? 'border-[#ebebeb] bg-[#f7f7f7] opacity-60'
                            : 'border-[#dddddd] bg-[#ffffff] hover:border-[#222222]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.packed}
                          onChange={() => toggleItemPacked(item.id)}
                          className="mt-1 w-4 h-4 rounded accent-[#ff385c] cursor-pointer"
                        />

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-[14px] font-semibold ${
                                item.packed ? 'line-through text-[#6a6a6a]' : 'text-[#222222]'
                              }`}
                            >
                              {item.name}
                            </span>
                            <span className="text-[12px] text-[#6a6a6a] shrink-0 font-mono">
                              ~{item.weightEstimateGrams}g
                            </span>
                          </div>

                          <p className="text-[13px] text-[#6a6a6a] leading-snug">
                            {item.description}
                          </p>

                          <div className="text-[12px] text-[#222222] pt-1">
                            <span className="text-[#ff385c] font-semibold">[{plan.skillLevel} Tip]: </span>
                            {item.skillTip}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Rules & Direct Booking Action */}
          <div className="p-6 rounded-2xl border border-[#dddddd] bg-[#ffffff] shadow-airbnb flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[16px] font-semibold text-[#222222]">
                Ready to conquer {currentTrail?.name}?
              </div>
              <p className="text-[13px] text-[#6a6a6a]">
                High-altitude permits available for upcoming departure dates.
              </p>
            </div>

            <button
              onClick={() => currentTrail && setBookingModalTrail(currentTrail)}
              className="h-12 px-8 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] text-[#ffffff] font-medium text-[15px] transition-colors shadow-sm cursor-pointer"
            >
              Reserve this expedition
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
