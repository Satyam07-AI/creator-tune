
import React from 'react';
import { SparklesIcon, ArrowTrendingUpIcon, UploadIcon, MapIcon, LightBulbIcon, CheckCircleIcon, UserGroupIcon } from './icons';

const Step = ({ number, title, description, children, imageSide = 'left' }: { number: string; title:string; description: React.ReactNode; children: React.ReactNode; imageSide?: 'left' | 'right' }) => {
  const isImageLeft = imageSide === 'left';
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center relative">
      <div className={`absolute top-1/2 -translate-y-1/2 text-[18rem] font-bold text-white/5 opacity-50 select-none -z-10 ${isImageLeft ? 'md:-left-12' : 'md:-right-12'}`}>{number}</div>
      
      <div className={isImageLeft ? '' : 'md:order-2'}>
        {children}
      </div>
      
      <div className={isImageLeft ? 'md:text-right' : 'md:order-1 md:text-left'}>
        <h3 className="text-sm font-bold uppercase tracking-widest text-pink-300">Step {number}</h3>
        <h2 className="text-4xl font-bold mt-2 mb-4">{title}</h2>
        <p className="text-lg text-white/80">
          {description}
        </p>
      </div>
    </div>
  );
};


const HowItWorks = ({ t }: { t: (key: string) => string }) => {
  return (
    <div className="w-full max-w-6xl mx-auto my-16 sm:my-24 px-4 text-white animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-4xl sm:text-5xl font-bold text-shadow-lg">How Creator Tune Works</h2>
            <p className="mt-4 text-lg text-white/80 max-w-3xl mx-auto">
                A simple, 4-step guide to unlocking your channel's full potential with our AI tools.
            </p>
        </div>
      <div className="space-y-24">
        
        <Step
          number="1"
          title="Discover Your AI Toolkit"
          description="Navigate to our dedicated Features page to find a comprehensive suite of AI tools. From optimizing thumbnails to generating scripts, everything you need is at your fingertips."
          imageSide="left"
        >
          <div className="bg-black/20 backdrop-blur-lg p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 transform hover:scale-105 transition-transform duration-300">
             <div className="bg-white/10 p-4 rounded-xl flex items-center">
                <MapIcon className="w-6 h-6 mr-3 text-pink-300 flex-shrink-0" />
                <h3 className="text-lg font-bold text-white">Explore All Features</h3>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/20 p-3 rounded-lg flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-white/60"/> <span className="text-sm">Thumbnail Optimizer</span></div>
                <div className="bg-black/20 p-3 rounded-lg flex items-center gap-2"><LightBulbIcon className="w-5 h-5 text-white/60"/> <span className="text-sm">Content Ideas</span></div>
                <div className="bg-black/20 p-3 rounded-lg flex items-center gap-2"><UserGroupIcon className="w-5 h-5 text-white/60"/> <span className="text-sm">Audience Analysis</span></div>
                <div className="bg-black/20 p-3 rounded-lg flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-white/60"/> <span className="text-sm">And more...</span></div>
             </div>
          </div>
        </Step>

        <Step
          number="2"
          title="Select a Tool & Provide Input"
          description="Choose the tool you need, like the 'Title & Thumbnail Optimizer'. Each tool has a simple, intuitive form where you'll input your content—a title, an image, or channel data."
          imageSide="right"
        >
          <div className="bg-black/20 backdrop-blur-lg p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-lg font-bold text-white text-center">Title & Thumbnail Optimizer</h3>
            <input 
              disabled
              type="text"
              placeholder="Your Awesome Video Title"
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50"
            />
            <div className="flex justify-center rounded-lg border border-dashed border-white/40 px-6 py-10 bg-white/5">
                <div className="text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-white/50" />
                    <p className="mt-2 text-sm text-white/80">Upload your thumbnail</p>
                </div>
            </div>
          </div>
        </Step>
        
        <Step
          number="3"
          title="Get Instant AI-Powered Insights"
          description="With a single click, our AI analyzes your input and generates a detailed report. You'll receive actionable advice, scores, and creative ideas to make data-driven decisions."
          imageSide="left"
        >
            <div className="bg-black/20 backdrop-blur-lg p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 transform hover:scale-105 transition-transform duration-300">
                <div className="text-center bg-white/10 p-4 rounded-xl">
                    <p className="text-sm font-semibold text-white/70">Overall CTR Rating</p>
                    <p className="text-5xl font-bold text-pink-300">8.5<span className="text-3xl text-white/50">/10</span></p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2"><LightBulbIcon className="w-5 h-5 text-pink-300"/> Suggestions</h3>
                    <ul className="space-y-2 text-sm text-white/80 list-disc list-inside">
                        <li>Add a human face to increase connection.</li>
                        <li>Boost color saturation by 15%.</li>
                        <li>Use a bolder, more readable font.</li>
                    </ul>
                </div>
            </div>
        </Step>

        <Step
          number="4"
          title="Apply, Grow, and Repeat"
          description={
            <>
              The path to success is a continuous cycle. <strong className="text-purple-300">Analyze</strong> your ideas with our AI tools, <strong className="text-pink-300">Apply</strong> the actionable insights to your content, and watch your channel <strong className="text-green-300">Grow</strong>. Repeat this process to consistently level-up your strategy and stay ahead of the competition.
            </>
          }
          imageSide="right"
        >
            <div className="bg-black/20 backdrop-blur-lg p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center gap-4 text-center">
                    <div className="flex flex-col items-center">
                        <div className="rounded-full bg-purple-500/20 p-3 mb-2"><SparklesIcon className="w-8 h-8 text-purple-300"/></div>
                        <p className="font-bold">Analyze</p>
                    </div>
                     <p className="text-2xl text-white/50 font-thin">→</p>
                    <div className="flex flex-col items-center">
                        <div className="rounded-full bg-pink-500/20 p-3 mb-2"><CheckCircleIcon className="w-8 h-8 text-pink-300"/></div>
                        <p className="font-bold">Apply</p>
                    </div>
                     <p className="text-2xl text-white/50 font-thin">→</p>
                    <div className="flex flex-col items-center">
                        <div className="rounded-full bg-green-500/20 p-3 mb-2"><ArrowTrendingUpIcon className="w-8 h-8 text-green-300"/></div>
                        <p className="font-bold">Grow</p>
                    </div>
                </div>
            </div>
        </Step>
        
      </div>
    </div>
  );
};

export default HowItWorks;