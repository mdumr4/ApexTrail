import React, { useState } from 'react';
import { MountainTrail, SkillLevel, FitnessLevel, Booking } from '../types';
import { useTrek } from '../context/TrekContext';
import {
  X,
  CheckCircle2,
  Calendar,
  Users,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Ticket,
  Printer,
  Mountain,
} from 'lucide-react';

interface Props {
  trail: MountainTrail;
  onClose: () => void;
}

export const BookingModal: React.FC<Props> = ({ trail, onClose }) => {
  const { addBooking, userProfile, setPrefilledAiTrail, setActiveTab } = useTrek();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedDateId, setSelectedDateId] = useState<string>(
    trail.availableDates[0]?.id || ''
  );
  const [partySize, setPartySize] = useState<number>(1);

  // Trekker info form
  const [formData, setFormData] = useState({
    fullName: userProfile.fullName || 'Alex Vance',
    email: userProfile.email || 'alex.vance@expedition.co',
    phone: '+1 (555) 432-8765',
    country: 'United States',
    skillLevel: userProfile.skillLevel,
    fitnessLevel: userProfile.fitnessLevel,
    emergencyContactName: 'Taylor Vance',
    emergencyContactPhone: '+1 (555) 432-8799',
    notes: 'Excited for high-altitude summit attempt. Preparing for cold conditions.',
  });

  // Add-ons selection
  const [addons, setAddons] = useState([
    {
      id: 'gear-inreach',
      name: 'Garmin inReach Satellite SOS Communicator',
      desc: '2-way satellite messaging & global rescue beacon',
      price: 130,
      selected: true,
    },
    {
      id: 'gear-downbag',
      name: '-20°C 800-Fill Expedition Down Sleeping Bag',
      desc: 'Cleaned, sanitized, comfort-rated sub-zero sleeping bag',
      price: 140,
      selected: false,
    },
    {
      id: 'gear-poles',
      name: 'Leki Carbon Telescopic Trekking Poles',
      desc: 'Pair of lightweight shock-absorbing alpine poles',
      price: 45,
      selected: true,
    },
    {
      id: 'service-porter',
      name: 'Dedicated Personal Alpine Porter (15kg allowance)',
      desc: 'Sherpa / local porter who carries your main duffel bag between camps',
      price: 350,
      selected: false,
    },
    {
      id: 'ins-alpine',
      name: 'Alpine High-Altitude Search & Evac Insurance',
      desc: 'Covers helicopter mountain extraction up to 6,000m',
      price: 120,
      selected: true,
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Apple Pay' | 'Wire / Expedition Transfer'>('Credit Card');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedDate = trail.availableDates.find((d) => d.id === selectedDateId) || trail.availableDates[0];
  const maxAvailableSlots = selectedDate ? selectedDate.slotsTotal - selectedDate.slotsBooked : 1;

  // Pricing calculations
  const baseRate = trail.priceUsd * (selectedDate?.priceModifier || 1);
  const baseTotal = baseRate * partySize;
  const addonsTotal = addons
    .filter((a) => a.selected)
    .reduce((sum, a) => sum + a.price * partySize, 0);
  const permitAndParkFee = 85 * partySize;
  const grandTotal = Math.round(baseTotal + addonsTotal + permitAndParkFee);

  const toggleAddon = (id: string) => {
    setAddons((prev) =>
      prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a))
    );
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newBooking = addBooking({
        trailId: trail.id,
        trailName: trail.name,
        departureDateId: selectedDate.id,
        startDate: selectedDate.startDate,
        endDate: selectedDate.endDate,
        leadTrekker: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          skillLevel: formData.skillLevel,
          fitnessLevel: formData.fitnessLevel,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
        },
        partySize,
        selectedAddons: addons
          .filter((a) => a.selected)
          .map((a) => ({ id: a.id, name: a.name, price: a.price })),
        basePrice: baseTotal,
        addonsTotal,
        permitFee: permitAndParkFee,
        totalPrice: grandTotal,
        status: 'Confirmed',
        paymentMethod,
        notes: formData.notes,
      });

      setConfirmedBooking(newBooking);
      setIsProcessing(false);
      setStep(5);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#000000]/50 backdrop-blur-[2px] overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#ffffff] rounded-2xl shadow-airbnb-elevated border border-[#ebebeb] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-5 border-b border-[#ebebeb] flex items-center justify-between shrink-0 bg-[#ffffff]">
          <div>
            <h3 className="text-[18px] font-semibold text-[#222222]">
              Request to book
            </h3>
            <p className="text-[13px] text-[#6a6a6a]">{trail.name}</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#f7f7f7] text-[#222222] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step < 5 && (
          <div className="px-6 py-2.5 bg-[#f7f7f7] border-b border-[#ebebeb] flex items-center justify-between text-[13px] text-[#6a6a6a]">
            <span className={step === 1 ? 'font-semibold text-[#222222]' : ''}>1. Dates</span>
            <ChevronRight className="w-4 h-4 text-[#dddddd]" />
            <span className={step === 2 ? 'font-semibold text-[#222222]' : ''}>2. Trekker Info</span>
            <ChevronRight className="w-4 h-4 text-[#dddddd]" />
            <span className={step === 3 ? 'font-semibold text-[#222222]' : ''}>3. Gear</span>
            <ChevronRight className="w-4 h-4 text-[#dddddd]" />
            <span className={step === 4 ? 'font-semibold text-[#222222]' : ''}>4. Payment</span>
          </div>
        )}

        {/* Wizard Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: Dates & Party Size */}
          {step === 1 && (
            <div className="space-y-5">
              <h4 className="text-[16px] font-semibold text-[#222222]">
                Your expedition window
              </h4>
              <div className="space-y-3">
                {trail.availableDates.map((d) => {
                  const remaining = d.slotsTotal - d.slotsBooked;
                  const isSelected = selectedDateId === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDateId(d.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#222222] bg-[#f7f7f7]'
                          : 'border-[#dddddd] hover:border-[#222222]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-[15px] text-[#222222]">
                          {d.startDate} &ndash; {d.endDate}
                        </div>
                        <div className="text-[13px] text-[#6a6a6a]">
                          Lead: {d.leadGuide} &bull; {remaining} spots left
                        </div>
                      </div>
                      <div className="font-semibold text-[15px] text-[#222222]">
                        ${Math.round(trail.priceUsd * d.priceModifier).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="block text-[14px] font-semibold text-[#222222] mb-2">
                  Number of Trekkers
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      disabled={num > maxAvailableSlots}
                      onClick={() => setPartySize(num)}
                      className={`py-2.5 rounded-lg border text-[14px] font-medium transition-all ${
                        partySize === num
                          ? 'border-[#222222] bg-[#222222] text-[#ffffff]'
                          : num > maxAvailableSlots
                          ? 'opacity-40 cursor-not-allowed border-[#dddddd] text-[#929292]'
                          : 'border-[#dddddd] hover:border-[#222222] text-[#222222]'
                      }`}
                    >
                      {num} {num === 1 ? 'trekker' : 'trekkers'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Trekker Details */}
          {step === 2 && (
            <div className="space-y-4 text-[14px]">
              <h4 className="text-[16px] font-semibold text-[#222222]">
                Lead trekker details
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#6a6a6a] mb-1">
                    Full legal name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full h-12 px-3 rounded-lg border border-[#dddddd] text-[#222222] focus:border-[#222222] focus:outline-none"
                    placeholder="Passport full name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-[#6a6a6a] mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-12 px-3 rounded-lg border border-[#dddddd] text-[#222222] focus:border-[#222222] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#6a6a6a] mb-1">
                      Phone number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-12 px-3 rounded-lg border border-[#dddddd] text-[#222222] focus:border-[#222222] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-[#6a6a6a] mb-1">
                      Skill level
                    </label>
                    <select
                      value={formData.skillLevel}
                      onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value as any })}
                      className="w-full h-12 px-3 rounded-lg border border-[#dddddd] text-[#222222] bg-white focus:border-[#222222] focus:outline-none cursor-pointer"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Mountaineer">Mountaineer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#6a6a6a] mb-1">
                      Physical fitness
                    </label>
                    <select
                      value={formData.fitnessLevel}
                      onChange={(e) => setFormData({ ...formData, fitnessLevel: e.target.value as any })}
                      className="w-full h-12 px-3 rounded-lg border border-[#dddddd] text-[#222222] bg-white focus:border-[#222222] focus:outline-none cursor-pointer"
                    >
                      <option value="Casual Walker">Casual Walker</option>
                      <option value="Active / Moderate">Active / Moderate</option>
                      <option value="Marathon / High Endurance">Marathon / High Endurance</option>
                      <option value="Peak Athlete">Peak Athlete</option>
                    </select>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="pt-2 border-t border-[#ebebeb]">
                  <div className="text-[13px] font-semibold text-[#222222] mb-2">
                    Emergency Contact (Required for High Alpine Trails)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      placeholder="Contact Name"
                      className="w-full h-12 px-3 rounded-lg border border-[#dddddd] text-[#222222] focus:border-[#222222] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      placeholder="Contact Phone"
                      className="w-full h-12 px-3 rounded-lg border border-[#dddddd] text-[#222222] focus:border-[#222222] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Gear Add-ons */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-[16px] font-semibold text-[#222222]">
                Optional equipment rentals
              </h4>
              <div className="space-y-3">
                {addons.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => toggleAddon(a.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      a.selected
                        ? 'border-[#222222] bg-[#f7f7f7]'
                        : 'border-[#dddddd] hover:border-[#222222]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={a.selected}
                        onChange={() => toggleAddon(a.id)}
                        className="mt-1 accent-[#ff385c]"
                      />
                      <div>
                        <div className="text-[15px] font-semibold text-[#222222]">{a.name}</div>
                        <div className="text-[13px] text-[#6a6a6a]">{a.desc}</div>
                      </div>
                    </div>
                    <div className="text-[14px] font-semibold text-[#222222] shrink-0">
                      +${a.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Review & Payment */}
          {step === 4 && (
            <div className="space-y-5">
              <h4 className="text-[16px] font-semibold text-[#222222]">
                Confirm and pay
              </h4>

              {/* Price Details Card */}
              <div className="p-5 rounded-xl border border-[#dddddd] bg-[#f7f7f7] space-y-3 text-[14px]">
                <div className="flex justify-between text-[#3f3f3f]">
                  <span>Expedition ({partySize} trekker{partySize > 1 ? 's' : ''})</span>
                  <span>${baseTotal.toLocaleString()}</span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex justify-between text-[#3f3f3f]">
                    <span>Equipment rentals</span>
                    <span>+${addonsTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#3f3f3f]">
                  <span>Permits &amp; park conservation fee</span>
                  <span>${permitAndParkFee.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-[#dddddd] flex justify-between font-bold text-[16px] text-[#222222]">
                  <span>Total (USD)</span>
                  <span className="text-[#ff385c]">${grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment selector */}
              <div>
                <label className="block text-[13px] font-semibold text-[#222222] mb-2">
                  Payment method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Credit Card', 'Apple Pay', 'Wire / Expedition Transfer'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-3 px-2 rounded-lg border text-[13px] font-semibold transition-all ${
                        paymentMethod === m
                          ? 'border-[#222222] bg-[#222222] text-[#ffffff]'
                          : 'border-[#dddddd] text-[#222222] hover:border-[#222222]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[12px] text-[#6a6a6a]">
                By selecting the button below, you agree to the Mountain Expedition Terms, Guest Safety Guidelines, and Cancellation Policy.
              </div>
            </div>
          )}

          {/* STEP 5: Success Voucher */}
          {step === 5 && confirmedBooking && (
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#f7f7f7] text-[#ff385c] flex items-center justify-center mx-auto border border-[#dddddd]">
                <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
              </div>

              <div>
                <h3 className="text-[22px] font-semibold text-[#222222]">
                  Reservation confirmed!
                </h3>
                <p className="text-[14px] text-[#6a6a6a] mt-1">
                  Your expedition pass number is <strong>{confirmedBooking.bookingNumber}</strong>
                </p>
              </div>

              {/* Pass Card */}
              <div className="p-5 rounded-2xl border border-[#dddddd] bg-[#ffffff] shadow-airbnb text-left space-y-3 text-[14px]">
                <div className="flex justify-between border-b border-[#ebebeb] pb-2">
                  <span className="text-[#6a6a6a]">Trail</span>
                  <span className="font-semibold text-[#222222]">{confirmedBooking.trailName}</span>
                </div>
                <div className="flex justify-between border-b border-[#ebebeb] pb-2">
                  <span className="text-[#6a6a6a]">Dates</span>
                  <span className="font-semibold text-[#222222]">{confirmedBooking.startDate} &ndash; {confirmedBooking.endDate}</span>
                </div>
                <div className="flex justify-between border-b border-[#ebebeb] pb-2">
                  <span className="text-[#6a6a6a]">Lead Trekker</span>
                  <span className="font-semibold text-[#222222]">{confirmedBooking.leadTrekker.fullName}</span>
                </div>
                <div className="flex justify-between font-bold text-[16px] pt-1">
                  <span>Total Paid</span>
                  <span className="text-[#ff385c]">${confirmedBooking.totalPrice.toLocaleString()} USD</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    setPrefilledAiTrail(trail);
                    setActiveTab('ai-guide');
                  }}
                  className="h-12 px-6 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] text-[#ffffff] font-medium text-[15px] transition-colors"
                >
                  Tailor AI Packing List
                </button>
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('my-bookings');
                  }}
                  className="h-12 px-6 rounded-[8px] border border-[#222222] hover:bg-[#f7f7f7] text-[#222222] font-medium text-[15px] transition-colors"
                >
                  View in My Trips
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        {step < 5 && (
          <div className="p-4 px-6 border-t border-[#ebebeb] flex items-center justify-between bg-[#ffffff] shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="text-[14px] font-semibold text-[#222222] underline cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s + 1) as any)}
                  className="h-11 px-6 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] text-[#ffffff] font-medium text-[15px] transition-colors cursor-pointer"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className="h-12 px-8 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] text-[#ffffff] font-medium text-[16px] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? 'Confirming...' : `Confirm & Pay ($${grandTotal.toLocaleString()})`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
