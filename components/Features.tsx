import React from 'react';

export default function Features() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className=" font-[Quicksand] text-5xl font-bold mb-4 text-purple-900 leading-tight">
            The AI-Powered System™<br />
            for Smarter Job Preparation.
          </h1>
          <p className="text-gray-700 text-base max-w-xl">
            Turn AI-driven insights into personalized preparation, smarter applications, and interview confidence to land your dream job.
          </p>
        </div>

        {/* Three Cards Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Card 1 - Resume ATS Checker */}
          <div className="rounded-3xl p-8 bg-gradient-to-br from-pink-500 via-purple-500 to-pink-400 text-white shadow-lg">
            <h2 className="text-2xl font-semibold mb-3">Resume (ATS) Checker</h2>
            <p className="text-sm mb-6 text-white/90">
              Optimize your resume to pass Applicant Tracking Systems and get noticed by recruiters.
            </p>

            {/* Analytics Panel */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3a7 7 0 100 14 7 7 0 000-14zm0 2a5 5 0 110 10 5 5 0 010-10z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium">AI Resume Insights</div>
                  <div className="text-xs text-white/80">Here's how your resume did this week:</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold">↑ 85%</span>
                  <span className="text-sm">ATS<br />Compatibility</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold">↑ 70%</span>
                  <span className="text-sm">Recruiter<br />Visibility</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold">+ 3x</span>
                  <span className="text-sm">Shortlisting<br />Rate</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-white/60">
                <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 3h14v14H3z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2 - AI Interview Prep */}
          <div className="rounded-3xl p-8 bg-white shadow-lg border border-purple-100">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">AI Interview Prep</h2>
            <p className="text-sm mb-6 text-gray-700">
              Practice and enhance your interview skills with AI-driven mock interviews and real-time feedback.
            </p>

            {/* Node Diagram */}
            <div className="relative h-64 mb-6">
              {/* Center Node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3a7 7 0 100 14 7 7 0 000-14z"/>
                  </svg>
                </div>
              </div>

              {/* Surrounding Nodes */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-pink-50 px-4 py-2 rounded-full text-xs font-medium text-gray-800 border border-pink-200">
                Interview Confidence
              </div>
              <div className="absolute top-1/4 right-0 bg-purple-50 px-4 py-2 rounded-full text-xs font-medium text-gray-800 border border-purple-200">
                Question Patterns
              </div>
              <div className="absolute bottom-1/4 right-0 bg-pink-50 px-4 py-2 rounded-full text-xs font-medium text-gray-800 border border-pink-200">
                Feedback Insights
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-purple-50 px-4 py-2 rounded-full text-xs font-medium text-gray-800 border border-purple-200">
                Communication Skills
              </div>
              <div className="absolute top-1/4 left-0 bg-pink-50 px-4 py-2 rounded-full text-xs font-medium text-gray-800 border border-pink-200">
                Hiring Signals
              </div>
            </div>

            {/* Chat Prompt */}
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3a7 7 0 100 14 7 7 0 000-14z"/>
                  </svg>
                </div>
                <span className="text-xs font-semibold text-gray-900">AI Assistant</span>
              </div>
              <p className="text-sm text-gray-800">
                How do you want recruiters to describe your interview performance 6 months from now?
              </p>
            </div>
          </div>

          {/* Card 3 - Job Informer */}
          <div className="rounded-3xl p-8 bg-white shadow-lg border border-purple-100">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Job Informer</h2>
            <p className="text-sm mb-6 text-gray-700">
              Receive personalized job recommendations and stay updated with the latest openings in your field.
            </p>

            {/* Chat UI */}
            <div className="space-y-4">
              <div className="bg-pink-50 rounded-2xl p-4 border border-pink-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 3a7 7 0 100 14 7 7 0 000-14z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-900">AI Assistant</span>
                </div>
                <p className="text-sm text-gray-800">
                  @AI Assistant Notify me about new jobs matching my resume and skills.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                <p className="text-sm font-medium text-gray-900">Remote Frontend Developer – React</p>
              </div>

              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <p className="text-sm text-gray-800">Software Engineer – Entry Level</p>
              </div>

              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <p className="text-sm text-gray-700">Interview Compliance & Bias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}