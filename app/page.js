'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Music, Heart, Sparkles, Check, Loader2, Gift, CheckCircle, Pencil } from 'lucide-react';

const CONFIG = {
  N8N_WEBHOOK_URL: 'https://atlantisnetwork.app.n8n.cloud/webhook/quiz-submit',
  SYSTEME_IO_CHECKOUT: 'https://christian-song.com/checkout',
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

// Composant Spinner personnalisé
const Spinner = ({ size = 24, color = colors.checkout }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{
        animation: 'spin 1s linear infinite',
      }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="4"
        strokeDasharray="31.4 31.4"
        strokeLinecap="round"
      />
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </svg>
  );
};

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

    const payload = {
      ...formData,
      timestamp: new Date().toISOString(),
      source: 'react-quiz'
    };

    try {
      const response = await fetch(CONFIG.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Webhook failed');

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

  if (isComplete) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: colors.cream
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1.5rem',
          padding: '2rem',
          maxWidth: '28rem',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}>
          <div style={{
            width: '5rem',
            height: '5rem',
            borderRadius: '50%',
            background: colors.checkout,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <Check size={40} color="white" />
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: colors.text
          }}>Thank You! 🙏</h2>
          <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
            Redirecting you to secure checkout...
          </p>
          <Spinner size={24} color={colors.checkout} />
        </div>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div style={{
        minHeight: '100vh',
        padding: '1rem 1rem 3rem 1rem',
        background: colors.cream
      }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', paddingTop: '1.5rem' }}>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: colors.text
            }}>
              Almost There! Complete Your Order
            </h1>
            <p style={{ color: '#6B7280' }}>
              You're just one click away from creating a beautiful, personalized song for{' '}
              <span style={{ color: colors.checkout, fontWeight: '600' }}>{formData.name}</span>.
            </p>
            <div style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              background: colors.checkout,
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Expected song delivery date: {getDeliveryDate()}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.25rem',
            border: '1px solid #E5E7EB',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Music size={20} color={colors.checkout} />
              <span style={{ fontWeight: 'bold' }}>Your Custom Song Order</span>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}>
                <span style={{ color: '#6B7280' }}>Song for:</span>
                <span style={{ color: colors.checkout, fontWeight: '500' }}>{formData.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#6B7280' }}>Delivery:</span>
                <span style={{ fontWeight: '500' }}>{getDeliveryDate()}</span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>Custom Song</div>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '0.25rem',
                    color: '#92400E',
                    background: colors.creamDark
                  }}>50% OFF</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    color: '#9CA3AF',
                    textDecoration: 'line-through',
                    fontSize: '0.875rem',
                    marginRight: '0.5rem'
                  }}>${CONFIG.ORIGINAL_PRICE}</span>
                  <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>${CONFIG.PRICE} USD</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '0.5rem',
                borderRadius: '0.75rem',
                border: `2px solid ${colors.checkout}`,
                color: colors.checkout,
                background: 'white',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Pencil size={16} /> Review or Edit Survey
            </button>
          </div>

          {/* Email + Submit */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.25rem',
            border: '1px solid #E5E7EB',
            marginBottom: '1rem'
          }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Your Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="you@email.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E5E7EB',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '1rem'
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '0.75rem',
                background: colors.checkout,
                color: 'white',
                border: 'none',
                fontWeight: 'bold',
                cursor: canProceed() && !isSubmitting ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: (!canProceed() || isSubmitting) ? 0.5 : 1
              }}
            >
              {isSubmitting ? (
                <>
                  <Spinner size={20} color="white" />
                  Processing...
                </>
              ) : (
                <>
                  <Gift size={20} />
                  Create My Song
                </>
              )}
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.75rem',
              fontSize: '0.875rem',
              color: colors.checkout
            }}>
              <CheckCircle size={16} />
              <span>30-Day Money Back Guarantee</span>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={prevStep}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              border: '2px solid #E5E7EB',
              color: '#6B7280',
              background: 'white',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <ChevronLeft size={20} /> Back to Previous Step
          </button>
        </div>
      </div>
    );
  }

  // Steps 1-5
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: `linear-gradient(135deg, ${colors.cream}, #FFF5E6)`
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '32rem',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          textAlign: 'center',
          borderBottom: '1px solid #E5E7EB',
          background: `linear-gradient(135deg, ${colors.primary}11, ${colors.primary}05)`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <Music size={24} color={colors.primary} />
            <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{CONFIG.SITE_NAME}</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1rem'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Step {step} of {totalSteps}</span>
            <div style={{
              flex: 1,
              height: '0.5rem',
              background: '#E5E7EB',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                background: colors.primary,
                width: `${(step / totalSteps) * 100}%`,
                transition: 'width 0.5s',
                borderRadius: '9999px'
              }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: colors.text
                }}>Let's start with the basics</h2>
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                  Tell us about the special person in your life
                </p>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>Who's this song for? *</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem'
                }}>
                  {['Husband', 'Wife', 'Father', 'Mother', 'Children', 'Sibling', 'Friend', 'Myself', 'Other'].map(option => (
                    <button
                      key={option}
                      onClick={() => updateField('recipient', option)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        border: formData.recipient === option ? `2px solid ${colors.primary}` : '2px solid #E5E7EB',
                        background: formData.recipient === option ? '#F3E8FF' : 'white',
                        color: formData.recipient === option ? colors.primaryDark : 'inherit',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>What's their name? *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g., Sarah, Michael, Mom"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: colors.text
                }}>Choose a Genre 🎵</h2>
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                  What musical style speaks to their soul?
                </p>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>Preferred Genre *</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.5rem'
                }}>
                  {['Pop', 'Country', 'Rock', 'R&B', 'Jazz', 'Worship', 'Gospel', 'Hip-Hop'].map(option => (
                    <button
                      key={option}
                      onClick={() => updateField('genre', option)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        border: formData.genre === option ? `2px solid ${colors.primary}` : '2px solid #E5E7EB',
                        background: formData.genre === option ? '#F3E8FF' : 'white',
                        color: formData.genre === option ? colors.primaryDark : 'inherit',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>Preferred Voice *</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem'
                }}>
                  {['Male Voice', 'Female Voice', 'No Preference'].map(option => (
                    <button
                      key={option}
                      onClick={() => updateField('vocals', option)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        border: formData.vocals === option ? `2px solid ${colors.primary}` : '2px solid #E5E7EB',
                        background: formData.vocals === option ? '#F3E8FF' : 'white',
                        color: formData.vocals === option ? colors.primaryDark : 'inherit',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <Heart style={{ margin: '0 auto 0.5rem' }} size={32} color={colors.primary} />
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: colors.text
                }}>What makes them special?</h2>
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                  Describe their character and qualities
                </p>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>Their beautiful qualities *</label>
                <textarea
                  value={formData.qualities}
                  onChange={(e) => updateField('qualities', e.target.value)}
                  placeholder="Are they patient, wise, funny, protective, encouraging? What makes them the incredible person they are?"
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <Sparkles style={{ margin: '0 auto 0.5rem' }} size={32} color={colors.primary} />
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: colors.text
                }}>Share your favorite memories</h2>
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                  What moments together do you treasure most?
                </p>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>Special moments together *</label>
                <textarea
                  value={formData.memories}
                  onChange={(e) => updateField('memories', e.target.value)}
                  placeholder="Share how you met, special years, inside jokes, or moments that made your relationship unique..."
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: colors.text
                }}>A message from your heart 💝</h2>
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                  What do you want them to know, feel, or remember?
                </p>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>Special message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Include any Bible verses, prayers, or words that are meaningful to your relationship..."
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginTop: '2rem'
          }}>
            {step > 1 && (
              <button
                onClick={prevStep}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  background: 'white',
                  color: colors.primary,
                  border: `2px solid ${colors.primary}`,
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <ChevronLeft size={20} /> Back
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '0.75rem',
                background: colors.primary,
                color: 'white',
                border: 'none',
                fontWeight: '500',
                cursor: canProceed() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: canProceed() ? 1 : 0.5
              }}
            >
              Next <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
