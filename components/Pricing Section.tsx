import React, { useState } from 'react';

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{
      background: '#ffffff'
    }}>
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-4" style={{ 
            color: '#1a1a2e',
            letterSpacing: '-0.02em'
          }}>
            Choose your right plan!
          </h1>
          <p className="text-base" style={{ 
            color: '#6b7280',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Select from best plans, ensuring a perfect match. Need more or less?
            <br />
            Customize your subscription for a seamless fit!
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full p-1" style={{
            backgroundColor: '#f3f4f6'
          }}>
            <button
              onClick={() => setBillingPeriod('monthly')}
              className="px-12 py-3 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: billingPeriod === 'monthly' ? '#7c3aed' : 'transparent',
                color: billingPeriod === 'monthly' ? '#ffffff' : '#6b7280',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('quarterly')}
              className="px-12 py-3 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: billingPeriod === 'quarterly' ? '#7c3aed' : 'transparent',
                color: billingPeriod === 'quarterly' ? '#ffffff' : '#6b7280',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Quarterly (save 10%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-3 gap-6">
          {/* Pro Card */}
          <div className="rounded-3xl p-8" style={{
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <div className="inline-block px-5 py-2 rounded-full mb-6" style={{
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Pro
            </div>
            
            <p className="text-sm mb-8" style={{
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              Ideal for those who've already got their website up and running and are seeking assistance to enhance and update it further.
            </p>

            <div className="mb-8">
              <span className="text-5xl font-bold" style={{ color: '#1a1a2e' }}>
                $2500
              </span>
              <span className="text-lg ml-1" style={{ color: '#6b7280' }}>
                /month
              </span>
            </div>

            <div className="space-y-4 mb-8">
              {[
                '3-5 day turnaround',
                'Native Development',
                'Task delivered one-by-one',
                'Dedicated dashboard',
                'Updates via Dashboard & Slack'
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="none">
                    <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#1a1a2e' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full py-4 rounded-xl text-base font-semibold transition-all duration-200" style={{
              backgroundColor: '#f3f4f6',
              color: '#1a1a2e',
              border: 'none',
              cursor: 'pointer'
            }}>
              Get started
            </button>
          </div>

          {/* Pro Plus Card */}
          <div className="rounded-3xl p-8" style={{
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <div className="inline-block px-5 py-2 rounded-full mb-6" style={{
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Pro Plus
            </div>
            
            <p className="text-sm mb-8" style={{
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              Ideal if you want to build or scale your website fast, with the strategy calls included.
            </p>

            <div className="mb-8">
              <span className="text-5xl font-bold" style={{ color: '#1a1a2e' }}>
                $3800
              </span>
              <span className="text-lg ml-1" style={{ color: '#6b7280' }}>
                /month
              </span>
            </div>

            <div className="space-y-4 mb-8">
              {[
                '1-3 day turnaround',
                'Monthly strategy call',
                'Commercial license',
                'Native Development',
                'Tasks delivered one-by-one',
                'Dedicated dashboard',
                'Updates via Dashboard & Slack'
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="none">
                    <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#1a1a2e' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full py-4 rounded-xl text-base font-semibold transition-all duration-200" style={{
              backgroundColor: '#f3f4f6',
              color: '#1a1a2e',
              border: 'none',
              cursor: 'pointer'
            }}>
              Get started
            </button>
          </div>

          {/* Custom Card */}
          <div className="rounded-3xl p-8" style={{
            backgroundColor: '#dcd7e8',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <div className="inline-block px-5 py-2 rounded-full mb-6" style={{
              backgroundColor: '#ffffff',
              color: '#1a1a2e',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Custom
            </div>
            
            <p className="text-sm mb-8" style={{
              color: '#1a1a2e',
              lineHeight: '1.6'
            }}>
              If these plans don't fit, let's create one that suits. Customize your subscription for a perfect fit, bigger or smaller!
            </p>

            <h2 className="text-4xl font-bold mb-8" style={{ 
              color: '#1a1a2e',
              letterSpacing: '-0.02em'
            }}>
              Let's Talks!
            </h2>

            <div className="space-y-4 mb-8">
              {[
                'Everything in design & development',
                'Strategy workshop',
                'Priority support',
                'Multiple tasks at once',
                'Ongoing autonomous A/B testing',
                'Advanced custom development'
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="none">
                    <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#1a1a2e' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full py-4 rounded-xl text-base font-semibold transition-all duration-200" style={{
              backgroundColor: '#2d2d44',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer'
            }}>
              Book a Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}