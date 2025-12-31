'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Music, Heart, Sparkles, Mail, Check, Loader2, Play, Gift, Shield, CheckCircle, Star, Pencil } from 'lucide-react';

const CONFIG = {
  N8N_WEBHOOK_URL: 'https://ton-n8n.app.n8n.cloud/webhook/prayer-song',
  SYSTEME_IO_CHECKOUT: 'https://ton-compte.systeme.io/checkout/prayer-song',
  SITE_NAME: 'PrayerSong',
  PRICE: 99,
  ORIGINAL_PRICE: 199,
};

const colors = {
  primary: '#8B5CF6',
  primaryDark: '#7C3AED',
  checkout: '#B45309',
  cream: '#FFF8F0',
  creamDark: '#FEF3C7',
  text: '#1a1a2e',
};

const sampleSongs = [
  { title: 'Sent to Me from God', orderedBy: 'Pamela S.', testimonial: '"Absolutely beautiful, you captured such special moments... we both were crying."' },
  { title: 'Saving Grace', orderedBy: 'Wendy B.', testimonial: '"This is absolutely breathtaking. I can\'t believe it... I am going to have a hard time keeping this a secret until Sunday."' },
  { title: 'Stronger Now', orderedBy: 'Markeeta B.', testimonial: '"Very very wonderful song. I absolutely loved it and so did Dave!"' },
];

export default function PrayerSongQuiz() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    name: '',
    genre: '',
    vocals: '',
    qualities: '',
    memories: '',
    message: '',
    email: '',
  });

  const totalSteps = 6;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.recipient && formData.name;
      case 2: return formData.genre && formData.vocals;
      case 3: return formData.qualities.length > 10;
      case 4: return formData.memories.length > 10;
      case 5: return formData.message.length > 10;
      case 6: return formData.email && formData.email.includes('@');
      default: return false;
    }
  };

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    setIsSubmitting(true);
    const payload = { ...formData, timestamp: new Date().toISOString(), source: 'react-quiz' };
    try {
      await fetch(CONFIG.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setIsComplete(true);
      setTimeout(() => {
        window.location.href = `${CONFIG.SYSTEME_IO_CHECKOUT}?email=${encodeURIComponent(formData.email)}`;
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Écran de succès
  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: colors.cream }}>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: colors.checkout }}>
            <Check size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Thank You! 🙏</h2>
          <p className="text-gray-600 mb-4">Redirecting you to secure checkout...</p>
          <Loader2 className="animate-spin mx-auto" style={{ color: colors.checkout }} />
        </div>
      </div>
    );
  }

  // Step 6 - Checkout Page (nouveau design)
  if (step === 6) {
    return (
      <div className="min-h-screen p-4 pb-12" style={{ background: colors.cream }}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 pt-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text }}>Almost There! Complete Your Order</h1>
            <p className="text-gray-600">You're just one click away from creating a beautiful, personalized song for <span style={{ color: colors.checkout }} className="font-semibold">{formData.name}</span>.</p>
            <div className="inline-block mt-4 px-4 py-2 rounded-full text-white text-sm font-medium" style={{ background: colors.checkout }}>
              Expected song delivery date: {getDeliveryDate()}
            </div>
          </div>

          {/* Order Summary + Email */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Music size={20} style={{ color: colors.checkout }} />
                <span className="font-bold">Your Custom Song Order</span>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-gray-600">Song for:</span><span style={{ color: colors.checkout }} className="font-medium">{formData.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Delivery:</span><span className="font-medium">{getDeliveryDate()}</span></div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Custom Song</div>
                    <span className="text-xs px-2 py-0.5 rounded text-orange-700" style={{ background: colors.creamDark }}>50% OFF</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 line-through text-sm mr-2">${CONFIG.ORIGINAL_PRICE}</span>
                    <span className="font-bold text-lg">${CONFIG.PRICE} USD</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setStep(1)} className="w-full mt-4 py-2 rounded-xl border-2 text-sm font-medium flex items-center justify-center gap-2" style={{ borderColor: colors.checkout, color: colors.checkout }}>
                <Pencil size={16} /> Review or Edit Survey
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <label className="block text-sm font-medium mb-2">Your Email Address</label>
              <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="you@email.com" className="w-full p-3 border-2 rounded-xl focus:outline-none mb-4" style={{ borderColor: '#E5E7EB' }} />
              <button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: colors.checkout }}>
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Gift size={20} />}
                {isSubmitting ? 'Processing...' : 'Create My Song'}
              </button>
              <div className="flex items-center justify-center gap-2 mt-3 text-sm" style={{ color: colors.checkout }}>
                <CheckCircle size={16} /><span>30-Day Money Back Guarantee</span>
              </div>
            </div>
          </div>

          {/* Limited Time Discount */}
          <div className="rounded-2xl p-5 mb-4 border-2" style={{ background: colors.creamDark, borderColor: '#FCD34D' }}>
            <div className="flex items-center gap-2 mb-2">
              <Gift size={20} style={{ color: colors.checkout }} />
              <span className="font-bold" style={{ color: colors.checkout }}>Limited Time Friendship Discount</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">Our songs typically cost <span className="line-through">${CONFIG.ORIGINAL_PRICE}</span>, but we believe every friendship deserves to be celebrated for just <strong>${CONFIG.PRICE} USD for a limited time only</strong>.</p>
            <p className="text-sm text-gray-700"><strong>Why only ${CONFIG.PRICE} USD?</strong> Thanks to generous donations and tips from our amazing customers, we're able to temporarily offer this special price for PrayerSongs made for friends.</p>
          </div>

          {/* Sample Songs */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Music size={20} style={{ color: colors.checkout }} />
              <span className="font-bold">Hear Other PrayerSongs We Made</span>
            </div>
            <div className="space-y-4">
              {sampleSongs.map((song, i) => (
                <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: colors.checkout }}>
                      <Play size={16} className="text-white ml-0.5" fill="white" />
                    </button>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{song.title}</div>
                      <div className="text-xs text-gray-500">Ordered by {song.orderedBy}</div>
                    </div>
                    <span className="text-xs text-gray-400">0:00</span>
                  </div>
                  <p className="text-xs italic text-gray-600 mt-2 ml-13">{song.testimonial} — {song.orderedBy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={20} style={{ color: colors.checkout }} />
              <span className="font-bold">100% Money Back Guarantee</span>
            </div>
            <div className="space-y-3">
              {[{ title: 'Not satisfied? Get a full refund', desc: 'No questions asked, no hassle' }, { title: '30-day guarantee', desc: 'Plenty of time to listen and decide' }, { title: 'Risk-free purchase', desc: 'Your satisfaction is our priority' }].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: colors.checkout }} />
                  <div><div className="font-medium text-sm">{item.title}</div><div className="text-xs text-gray-500">{item.desc}</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Second CTA */}
          <button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 mb-2" style={{ background: colors.checkout }}>
            <Gift size={20} /> Create My Song
          </button>
          <p className="text-center text-sm text-gray-500 mb-6">Ready to create something special for {formData.name}?</p>

          {/* What You'll Get */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Gift size={20} style={{ color: colors.checkout }} />
              <span className="font-bold">What You'll Get</span>
            </div>
            <div className="space-y-3">
              {[{ title: 'Radio-Quality Song', desc: 'Radio-quality PrayerSong, ready to share' }, { title: 'Personalized Lyrics', desc: `Custom written just for ${formData.name}` }, { title: '7-Day Delivery', desc: 'Perfect for last-minute gifts' }].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: colors.checkout }} />
                  <div><div className="font-medium text-sm">{item.title}</div><div className="text-xs text-gray-500">{item.desc}</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Star size={20} style={{ color: colors.checkout }} />
              <span className="font-bold">Why Choose PrayerSong?</span>
            </div>
            <div className="space-y-2">
              {['Over 1,000 satisfied customers', '100% satisfaction guarantee', 'Secure payment processing', 'Delivered in just 7 days'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle size={16} style={{ color: '#22C55E' }} />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <button onClick={prevStep} className="w-full mt-6 py-3 rounded-xl font-medium border-2 flex items-center justify-center gap-2" style={{ borderColor: '#E5E7EB', color: '#6B7280' }}>
            <ChevronLeft size={20} /> Back to Previous Step
          </button>
        </div>
      </div>
    );
  }

  // Steps 1-5 (design original)
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${colors.cream}, #FFF5E6)` }}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center border-b" style={{ background: `linear-gradient(135deg, ${colors.primary}11, ${colors.primary}05)` }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Music size={24} style={{ color: colors.primary }} />
            <span className="font-bold text-lg">{CONFIG.SITE_NAME}</span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full transition-all duration-500 rounded-full" style={{ width: `${(step / totalSteps) * 100}%`, background: colors.primary }} />
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Let's start with the basics</h2>
                <p className="text-gray-500">Tell us about the special person in your life</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Who's this song for? *</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Husband', 'Wife', 'Father', 'Mother', 'Children', 'Sibling', 'Friend', 'Myself', 'Other'].map(option => (
                    <button key={option} onClick={() => updateField('recipient', option)} className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${formData.recipient === option ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300'}`}>{option}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">What's their name? *</label>
                <input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g., Sarah, Michael, Mom" className="w-full p-4 border-2 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Choose a Genre 🎵</h2>
                <p className="text-gray-500">What musical style speaks to their soul?</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Genre *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Pop', 'Country', 'Rock', 'R&B', 'Jazz', 'Worship', 'Gospel', 'Hip-Hop'].map(option => (
                    <button key={option} onClick={() => updateField('genre', option)} className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${formData.genre === option ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300'}`}>{option}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Voice *</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Male Voice', 'Female Voice', 'No Preference'].map(option => (
                    <button key={option} onClick={() => updateField('vocals', option)} className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${formData.vocals === option ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300'}`}>{option}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <Heart className="mx-auto mb-2" size={32} style={{ color: colors.primary }} />
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>What makes them special?</h2>
                <p className="text-gray-500">Describe their character and qualities</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Their beautiful qualities *</label>
                <textarea value={formData.qualities} onChange={(e) => updateField('qualities', e.target.value)} placeholder="Are they patient, wise, funny, protective, encouraging? What makes them the incredible person they are?" rows={5} className="w-full p-4 border-2 rounded-xl focus:outline-none focus:border-purple-500 resize-none" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <Sparkles className="mx-auto mb-2" size={32} style={{ color: colors.primary }} />
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Share your favorite memories</h2>
                <p className="text-gray-500">What moments together do you treasure most?</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Special moments together *</label>
                <textarea value={formData.memories} onChange={(e) => updateField('memories', e.target.value)} placeholder="Share how you met, special years, inside jokes, or moments that made your relationship unique..." rows={5} className="w-full p-4 border-2 rounded-xl focus:outline-none focus:border-purple-500 resize-none" />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>A message from your heart 💝</h2>
                <p className="text-gray-500">What do you want them to know, feel, or remember?</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Special message *</label>
                <textarea value={formData.message} onChange={(e) => updateField('message', e.target.value)} placeholder="Include any Bible verses, prayers, or words that are meaningful to your relationship..." rows={5} className="w-full p-4 border-2 rounded-xl focus:outline-none focus:border-purple-500 resize-none" />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={prevStep} className="flex-1 py-4 rounded-xl font-medium border-2 flex items-center justify-center gap-2" style={{ borderColor: colors.primary, color: colors.primary }}>
                <ChevronLeft size={20} /> Back
              </button>
            )}
            <button onClick={nextStep} disabled={!canProceed()} className="flex-1 py-4 rounded-xl font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: colors.primary }}>
              Next <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

