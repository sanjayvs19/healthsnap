import React, { useState, useEffect, useRef } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { SPEAK_PRESETS } from '../../types/data';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  Volume2,
  BrainCircuit,
  Save,
  RefreshCw,
  Info,
  Radio,
  Clock,
  BatteryCharging
} from 'lucide-react';

export default function SpeakView() {
  const { addVoiceLog, setActiveView, showToast } = useWellness();

  const [selectedPreset, setSelectedPreset] = useState(SPEAK_PRESETS[0]);
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState('Tap microphone to speak');
  const [transcription, setTranscription] = useState(SPEAK_PRESETS[0].transcription);
  const [understanding, setUnderstanding] = useState(SPEAK_PRESETS[0].understanding);
  const [guidance, setGuidance] = useState(SPEAK_PRESETS[0].guidance);
  const [hasProcessed, setHasProcessed] = useState(true);
  const [savedToJournal, setSavedToJournal] = useState(false);

  // Web Speech API reference if available
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setStatusText('Listening to your voice...');
        };

        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          processVoiceInput(speechResult);
        };

        recognition.onerror = () => {
          // Fallback gracefully to simulated processing
          simulateVoiceCapture(selectedPreset);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.log("Speech recognition not supported in this browser:", e);
      }
    }
  }, [selectedPreset]);

  const processVoiceInput = (text) => {
    setIsListening(false);
    setStatusText('Analyzing speech signals with AI...');
    setTranscription(text);
    setSavedToJournal(false);

    // Simple heuristic parser for dynamic voice inputs
    const lower = text.toLowerCase();
    const isPoorSleep = lower.includes('sleep') || lower.includes('tired') || lower.includes('insomnia');
    const isWorkout = lower.includes('run') || lower.includes('jog') || lower.includes('workout') || lower.includes('gym');
    const isHeadache = lower.includes('headache') || lower.includes('pain') || lower.includes('stress');

    setTimeout(() => {
      let tags = {
        sleep: isPoorSleep ? 'Poor / Disrupted' : 'Normal',
        energy: isPoorSleep ? 'Low' : isWorkout ? 'High' : 'Moderate',
        mood: isHeadache ? 'Stressed' : isPoorSleep ? 'Tired' : 'Good'
      };

      let suggest = "Your recent input suggests maintaining regular sleep schedules, keeping hydrated, and taking brief mindful breaks.";
      if (isWorkout) {
        suggest = "Great aerobic workout! Remember to replenish fluids and gently stretch any tight muscle groups.";
      } else if (isHeadache) {
        suggest = "Screen fatigue and dehydration frequently coincide with mild headaches. Try drinking a glass of water and resting your eyes for 10 minutes.";
      }

      setUnderstanding(tags);
      setGuidance(suggest);
      setStatusText('AI Understanding complete');
      setHasProcessed(true);
    }, 1200);
  };

  const simulateVoiceCapture = (preset) => {
    setIsListening(true);
    setStatusText('Listening to microphone...');
    setHasProcessed(false);
    setSavedToJournal(false);
    setSelectedPreset(preset);

    setTimeout(() => {
      setStatusText('Transcribing speech audio...');
    }, 800);

    setTimeout(() => {
      setStatusText('Extracting wellness markers...');
      setTranscription(preset.transcription);
    }, 1600);

    setTimeout(() => {
      setIsListening(false);
      setUnderstanding(preset.understanding);
      setGuidance(preset.guidance);
      setStatusText('Analysis complete');
      setHasProcessed(true);
    }, 2400);
  };

  const handleMicClick = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      setStatusText('Tap microphone to speak');
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        simulateVoiceCapture(selectedPreset);
      }
    } else {
      simulateVoiceCapture(selectedPreset);
    }
  };

  const handleSaveToHistory = () => {
    addVoiceLog(transcription, understanding);
    setSavedToJournal(true);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <DisclaimerBanner compact={true} />

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--secondary)',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}>
          <Mic size={16} />
          <span>Natural Voice Wellness Logger</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>
          Speak to HealthSnap
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
          Tell us how you're feeling or describe your day.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '28px',
        alignItems: 'start'
      }}>
        {/* Left Column: Voice Interface & Microphone */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px 24px',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Audio Wave Visualizer Bars */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            height: '48px',
            marginBottom: '24px'
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((bar) => (
              <div
                key={bar}
                style={{
                  width: '5px',
                  borderRadius: '999px',
                  background: isListening
                    ? 'linear-gradient(180deg, var(--secondary) 0%, var(--primary) 100%)'
                    : 'var(--border-subtle)',
                  height: isListening ? `${12 + (bar % 4) * 8}px` : '8px',
                  animation: isListening ? `audioWave 0.8s ease-in-out infinite alternate ${bar * 0.1}s` : 'none',
                  transition: 'height 0.2s ease'
                }}
              />
            ))}
          </div>

          {/* Large Center Microphone Button */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            {isListening && (
              <div style={{
                position: 'absolute',
                inset: '-16px',
                borderRadius: '50%',
                background: 'rgba(6, 182, 212, 0.25)',
                animation: 'pulseGlow 1.5s infinite'
              }} />
            )}

            <button
              onClick={handleMicClick}
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                background: isListening
                  ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
                  : 'linear-gradient(135deg, var(--primary) 0%, #0d9488 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isListening
                  ? '0 0 35px rgba(6, 182, 212, 0.6)'
                  : '0 8px 24px rgba(16, 185, 129, 0.4)',
                transform: isListening ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                zIndex: 2
              }}
              title={isListening ? 'Click to stop listening' : 'Click to start speaking'}
            >
              {isListening ? (
                <Radio size={46} className="animate-pulse" />
              ) : (
                <Mic size={46} />
              )}
            </button>
          </div>

          {/* Status Text Indicator */}
          <div style={{
            fontSize: '0.92rem',
            fontWeight: 700,
            color: isListening ? 'var(--secondary)' : 'var(--text-main)',
            marginBottom: '6px'
          }}>
            {statusText}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, maxWidth: '280px' }}>
            {isListening
              ? 'HealthSnap is processing your voice stream...'
              : 'Tap above or pick a sample scenario below to test AI transcription.'}
          </p>

          {/* Preset Prompts Selector */}
          <div style={{ width: '100%', marginTop: '28px', textAlign: 'left' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Quick Demo Voice Prompts:
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {SPEAK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => simulateVoiceCapture(preset)}
                  disabled={isListening}
                  style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    background: selectedPreset.id === preset.id ? 'rgba(6, 182, 212, 0.1)' : 'var(--bg-subtle)',
                    border: selectedPreset.id === preset.id ? '1px solid var(--secondary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>
                    {preset.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "{preset.transcription}"
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Understanding & Guidance */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          boxShadow: 'var(--shadow-md)'
        }}>
          {/* Transcribed Speech Card */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Transcribed Audio
              </span>
              <span className="badge-tag badge-blue">Natural Language</span>
            </div>

            <div style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontSize: '0.95rem',
              color: 'var(--text-main)',
              lineHeight: 1.5,
              fontStyle: 'italic'
            }}>
              "{transcription}"
            </div>
          </div>

          {/* AI Understanding Section */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <BrainCircuit size={20} color="var(--accent-purple)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                AI Understanding
              </h3>
            </div>

            <div style={{
              background: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Detected Wellness Information:
              </span>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '10px',
                marginTop: '10px'
              }}>
                {Object.entries(understanding).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <span style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      textTransform: 'capitalize',
                      display: 'block',
                      fontWeight: 600
                    }}>
                      {key}
                    </span>
                    <strong style={{
                      fontSize: '0.92rem',
                      color: val === 'Poor' || val === 'Low' || val === 'Tired' ? '#f59e0b' : 'var(--primary)'
                    }}>
                      {val}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suggested Guidance Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="var(--secondary)" />
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--secondary)' }}>
                Suggested Guidance
              </h4>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
              "{guidance}"
            </p>
          </div>

          {/* Non-Diagnostic Medical Statement */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '22px'
          }}>
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Ethical Notice:</strong> HealthSnap does not make clinical diagnoses. Consult a medical professional for persisting symptoms.
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSaveToHistory}
              disabled={savedToJournal}
              className="btn-primary"
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '0.92rem',
                opacity: savedToJournal ? 0.7 : 1
              }}
            >
              {savedToJournal ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Logged to Wellness History</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Log to Wellness History</span>
                </>
              )}
            </button>

            <button
              onClick={() => setActiveView('journal')}
              className="btn-secondary"
              style={{ padding: '12px 18px', fontSize: '0.92rem' }}
            >
              View Journal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
