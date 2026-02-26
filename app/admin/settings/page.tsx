'use client';

import { 
  Shield, 
  BellRing, 
  Database, 
  Save,
  AlertTriangle,
  LucideIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingField {
  label: string;
  value: string | boolean;
  type: string;
  disabled?: boolean;
}

interface SettingSection {
  title: string;
  icon: LucideIcon;
  description: string;
  fields: SettingField[];
}

export default function SystemSettings() {
  const sections: SettingSection[] = [
    {
      title: 'Admin Profile',
      icon: Shield,
      description: 'Manage your administrative identity and access.',
      fields: [
        { label: 'Admin Email', value: 'ahmadakram7018@gmail.com', disabled: true, type: 'email' },
        { label: 'Display Name', value: 'Ahmad Akram', type: 'text' },
      ]
    },
    {
      title: 'System Notifications',
      icon: BellRing,
      description: 'Configure automated system alerts.',
      fields: [
        { label: 'High Error Rate Alert', value: true, type: 'toggle' },
        { label: 'Daily Analytics Report', value: true, type: 'toggle' },
        { label: 'New User Notifications', value: false, type: 'toggle' },
      ]
    },
    {
      title: 'Infrastructure',
      icon: Database,
      description: 'System connectivity and storage settings.',
      fields: [
        { label: 'API Base URL', value: 'https://ahmad-champ-planexa-backend.hf.space', disabled: true, type: 'text' },
        { label: 'Environment', value: 'Production', disabled: true, type: 'text' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold">System Settings</h2>
        <p className="text-slate-400">Manage application configurations and administrative preferences.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#0f172a] rounded-3xl border border-white/5 overflow-hidden"
          >
            <div className="p-8 border-b border-white/5 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white/5 text-blue-400">
                <section.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{section.title}</h3>
                <p className="text-slate-400 text-sm">{section.description}</p>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              {section.fields.map((field) => (
                <div key={field.label} className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <label className="text-sm font-semibold text-slate-300">{field.label}</label>
                  <div className="md:col-span-2">
                    {field.type === 'toggle' ? (
                      <button className={`w-12 h-6 rounded-full p-1 transition-colors ${field.value ? 'bg-blue-600' : 'bg-slate-700'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${field.value ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    ) : (
                      <input 
                        type={field.type} 
                        value={field.value as string} 
                        disabled={!!field.disabled}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 flex items-center gap-6">
           <div className="p-3 rounded-2xl bg-red-500/20 text-red-500">
             <AlertTriangle className="w-8 h-8" />
           </div>
           <div className="flex-1">
             <h4 className="text-lg font-bold text-red-400">Danger Zone</h4>
             <p className="text-sm text-red-400/60">Flushing the system logs or cache cannot be undone.</p>
           </div>
           <button className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-sm">
             Purge Cache
           </button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-blue-600/20 transition-all">
          <Save className="w-5 h-5" />
          Save All Changes
        </button>
      </div>
    </div>
  );
}
