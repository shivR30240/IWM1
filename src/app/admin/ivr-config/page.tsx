'use client';

import { useState } from 'react';
import { Card, CardTitle } from '@/components/ui/Card';
import { Settings, Phone, ArrowDown, MessageCircle, Mic, Save, RotateCcw } from 'lucide-react';
import { IVRConfig } from '@/types';
import { Button } from '@/components/ui/Button';

export default function IVRConfigPage() {
  const [config, setConfig] = useState<IVRConfig>({
    greetingMessage: 'Welcome to Indore Voice Connect. Please speak your complaint clearly in Hindi, English, or Malwi after the beep.',
    greetingMessageHi: 'Indore नगर निगम में आपका स्वागत है। कृपया अपनी शिकायत स्पष्ट रूप से बोलें।',
    languages: ['hi-IN', 'en-IN'],
    maxRecordingDuration: 180,
    speechTimeout: 3,
    fallbackMessage: 'We did not receive your response. Please call back to register your complaint.',
    fallbackMessageHi: 'हमें आपका उत्तर नहीं मिला। शिकायत दर्ज करने के लिए कृपया पुनः कॉल करें।',
    isActive: true,
    businessHours: {
      enabled: false,
      start: '09:00',
      end: '18:00',
      timezone: 'Asia/Kolkata',
    },
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    // In production, save to database
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaving(false);
    setSaved(true);
    
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default settings?')) {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-hind)] text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-[var(--color-primary)]" /> IVR Flow Configuration
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Status Indicator */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>IVR System Status</CardTitle>
            <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
              {config.isActive 
                ? 'IVR system is currently active and accepting calls'
                : 'IVR system is currently disabled'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.isActive}
              onChange={(e) => setConfig({ ...config, isActive: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
          </label>
        </div>
      </Card>

      {/* IVR Flow Diagram */}
      <Card>
        <CardTitle>Current IVR Flow</CardTitle>
        <div className="mt-6 flex flex-col items-center gap-4">
          {[
            { icon: Phone, label: 'Incoming Call', desc: 'Citizen dials 1800-XXX-XXXX', color: 'bg-blue-100 text-blue-700' },
            { icon: MessageCircle, label: 'Welcome Greeting', desc: `"${config.greetingMessage.substring(0, 50)}..."`, color: 'bg-green-100 text-green-700' },
            { icon: Mic, label: 'Record Complaint', desc: `Max ${config.maxRecordingDuration} seconds, ${config.speechTimeout}s timeout`, color: 'bg-purple-100 text-purple-700' },
            { icon: Settings, label: 'AI Processing', desc: 'ASR + NLU: Transcribe, classify, extract location', color: 'bg-orange-100 text-orange-700' },
            { icon: MessageCircle, label: 'Confirmation', desc: 'Ticket ID generated, SMS sent', color: 'bg-teal-100 text-teal-700' },
          ].map((step, i) => (
            <div key={i} className="w-full max-w-md">
              <div className={`flex items-center gap-4 rounded-lg p-4 ${step.color}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/50">
                  <step.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{step.label}</p>
                  <p className="text-sm opacity-80">{step.desc}</p>
                </div>
              </div>
              {i < 4 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-5 w-5 text-[var(--color-muted-foreground)]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Greeting Messages */}
      <Card>
        <CardTitle>Greeting Messages</CardTitle>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              English Greeting
            </label>
            <textarea
              value={config.greetingMessage}
              onChange={(e) => setConfig({ ...config, greetingMessage: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Welcome message in English..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Hindi Greeting (हिंदी)
            </label>
            <textarea
              value={config.greetingMessageHi}
              onChange={(e) => setConfig({ ...config, greetingMessageHi: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Welcome message in Hindi..."
            />
          </div>
        </div>
      </Card>

      {/* Recording Settings */}
      <Card>
        <CardTitle>Recording Settings</CardTitle>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">
              Maximum Recording Duration (seconds)
            </label>
            <input
              type="number"
              value={config.maxRecordingDuration}
              onChange={(e) => setConfig({ ...config, maxRecordingDuration: parseInt(e.target.value) })}
              min={30}
              max={300}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Speech Timeout (seconds)
            </label>
            <input
              type="number"
              value={config.speechTimeout}
              onChange={(e) => setConfig({ ...config, speechTimeout: parseInt(e.target.value) })}
              min={1}
              max={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </Card>

      {/* Language Options */}
      <Card>
        <CardTitle>Language Support</CardTitle>
        <div className="mt-4 space-y-2">
          {['hi-IN', 'en-IN', 'mr-IN'].map((lang) => (
            <label key={lang} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.languages.includes(lang)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setConfig({ ...config, languages: [...config.languages, lang] });
                  } else {
                    setConfig({ ...config, languages: config.languages.filter(l => l !== lang) });
                  }
                }}
                className="h-4 w-4"
              />
              <span className="text-sm">
                {lang === 'hi-IN' && 'Hindi (हिंदी)'}
                {lang === 'en-IN' && 'English'}
                {lang === 'mr-IN' && 'Marathi (मराठी)'}
              </span>
            </label>
          ))}
        </div>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardTitle>Business Hours (Optional)</CardTitle>
        <div className="mt-4 space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.businessHours.enabled}
              onChange={(e) => setConfig({
                ...config,
                businessHours: { ...config.businessHours, enabled: e.target.checked }
              })}
              className="h-4 w-4"
            />
            <span className="text-sm font-medium">Enable business hours restriction</span>
          </label>
          
          {config.businessHours.enabled && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <input
                  type="time"
                  value={config.businessHours.start}
                  onChange={(e) => setConfig({
                    ...config,
                    businessHours: { ...config.businessHours, start: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <input
                  type="time"
                  value={config.businessHours.end}
                  onChange={(e) => setConfig({
                    ...config,
                    businessHours: { ...config.businessHours, end: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Fallback Messages */}
      <Card>
        <CardTitle>Fallback Messages</CardTitle>
        <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
          Shown when no speech is detected or an error occurs
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              English Fallback
            </label>
            <textarea
              value={config.fallbackMessage}
              onChange={(e) => setConfig({ ...config, fallbackMessage: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Hindi Fallback (हिंदी)
            </label>
            <textarea
              value={config.fallbackMessageHi}
              onChange={(e) => setConfig({ ...config, fallbackMessageHi: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
