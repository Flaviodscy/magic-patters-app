export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      animation: {
        'scan': 'scan 2s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(100%)' }
        }
      },
      boxShadow: {
        'glow-blue': '0 0 8px rgba(59, 130, 246, 0.6)',
        'glow-purple': '0 0 8px rgba(168, 85, 247, 0.6)',
        'glow-pink': '0 0 8px rgba(236, 72, 153, 0.6)',
      },
      dropShadow: {
        'glow': '0 0 4px rgba(255, 255, 255, 0.7)'
      }
    }
  }
}