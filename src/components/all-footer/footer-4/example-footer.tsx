import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0a0a0a] text-gray-400 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl">WES Associates</h3>
            <p className="leading-relaxed text-sm">
              Professional study abroad consultancy for students from Bangladesh, with support for consultation, admission, scholarship, documentation, and visa
              guidance.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Destinations</h4>
            <ul className="space-y-2 text-sm">
              {['UK', 'USA', 'Canada', 'Australia'].map(item => (
                <li key={item} className="hover:text-red-500 transition-colors cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Services</h4>
            <ul className="space-y-2 text-sm">
              {['Consultation', 'Admission', 'Scholarship', 'Visa guidance'].map(item => (
                <li key={item} className="hover:text-red-500 transition-colors cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Contact</h4>
            <div className="text-sm space-y-2">
              <p>info@wesassociates.com</p>
              <p>+880 1303-537667</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 WES Associates. All rights reserved.</p>
          <p>Designed for responsive study abroad consultation.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
