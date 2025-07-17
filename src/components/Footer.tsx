import React from 'react';
export const Footer = () => {
  return <footer className="w-full backdrop-blur-xl bg-white/70 border-t border-gray-200/50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 font-light mb-4 md:mb-0">
            © {new Date().getFullYear()} PerfectPillow. All rights reserved.
          </p>
          <div className="flex space-x-8">
            {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(item => <a key={item} href="#" className="text-sm text-gray-500 hover:text-blue-500 transition-colors font-light">
                  {item}
                </a>)}
          </div>
        </div>
      </div>
    </footer>;
};