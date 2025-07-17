import React from 'react';
import { UserIcon, MoonIcon, BellIcon, LockIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
export const SettingsPage = () => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  return <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-medium text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-500 text-lg font-light">
          Manage your preferences and account settings
        </p>
      </div>
      <div className="space-y-4">
        {[{
        icon: UserIcon,
        label: 'Profile',
        description: 'Manage your personal information',
        onClick: () => {}
      }, {
        icon: MoonIcon,
        label: 'Appearance',
        description: 'Toggle between light and dark mode',
        onClick: toggleTheme,
        extra: <div className={`w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-500' : 'bg-gray-200'} relative`}>
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
      }, {
        icon: BellIcon,
        label: 'Notifications',
        description: 'Configure your notification preferences',
        onClick: () => {}
      }, {
        icon: LockIcon,
        label: 'Privacy',
        description: 'Control your privacy settings',
        onClick: () => {}
      }].map(({
        icon: Icon,
        label,
        description,
        onClick,
        extra
      }) => <button key={label} onClick={onClick} className="w-full flex items-center p-4 backdrop-blur-xl bg-white/70 rounded-2xl shadow-lg shadow-gray-200/50 transition-all hover:bg-white/80">
            <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Icon className="h-5 w-5 text-gray-600" />
            </div>
            <div className="ml-4 flex-1 text-left">
              <h3 className="text-gray-900 font-medium">{label}</h3>
              <p className="text-gray-500 text-sm">{description}</p>
            </div>
            {extra}
          </button>)}
      </div>
    </div>;
};