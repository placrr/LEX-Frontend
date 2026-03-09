import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Top Section */}
        <div className="flex justify-between items-start mb-16">
          <div className="flex items-center">
            <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#2563eb"/>
              <path d="M2 17L12 22L22 17" stroke="#2563eb" strokeWidth="2"/>
            </svg>
            <span className="text-2xl font-bold text-gray-900">LEX</span>
          </div>
          <div className="text-gray-600 text-sm">
            Your next interview deserves better preparation.
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-4 gap-8 mb-12">
          {/* Column 1 - Company */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Services</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Contact</a></li>
            </ul>
          </div>

          {/* Column 2 - Navigation */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Key Benefits</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Our Services</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Why LEX</a></li>
              
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600 text-sm">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                LEX@gmail.com
              </li>
              <li className="flex items-center text-gray-600 text-sm">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                +351 123 456 789
              </li>
              <li className="flex items-center text-gray-600 text-sm">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Bhubaneswar, India
              </li>
            </ul>
          </div>

          {/* Column 4 - Language & Social */}
          <div className="flex flex-col items-end">
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 mb-6">
              <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="text-sm text-gray-700">English</span>
              <svg className="w-4 h-4 ml-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <div className="flex space-x-4">
              {/* Social Icons */}
              <a href="#" className="text-gray-600 hover:text-gray-900">
                {/* LinkedIn */}
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                {/* Instagram */}
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                {/* Facebook */}
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                {/* YouTube */}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">© 2025 LEX. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms & Conditions</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
