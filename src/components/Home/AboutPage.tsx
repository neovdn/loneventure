import React from 'react';
import { ArrowLeft, Zap, Shield, Users, Dice6, Brain, Heart } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Storytelling',
      description: 'Our IBM Granite AI creates dynamic, personalized adventures that adapt to your choices and character development.'
    },
    {
      icon: Users,
      title: 'Rich Character Creation',
      description: 'Build detailed D&D characters with authentic races, classes, backgrounds, and ability scores using official rules.'
    },
    {
      icon: Dice6,
      title: 'Interactive Dice System',
      description: 'Roll authentic D&D dice (d4, d6, d8, d10, d12, d20) that integrate seamlessly with your adventure narrative.'
    },
    {
      icon: Shield,
      title: 'Persistent Campaigns',
      description: 'Your adventures are automatically saved, allowing you to continue your epic journey across multiple sessions.'
    },
    {
      icon: Zap,
      title: 'Instant Adventure',
      description: 'No scheduling, no waiting for other players. Start your adventure whenever inspiration strikes.'
    },
    {
      icon: Heart,
      title: 'Solo-Optimized',
      description: 'Designed specifically for solo play, with AI that understands pacing and engagement for single players.'
    }
  ];

  return (
    <div className="min-h-screen fantasy-gradient">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 glow-text">
              About Loneventure
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Loneventure revolutionizes solo tabletop gaming by combining the rich storytelling 
              tradition of Dungeons & Dragons with cutting-edge AI technology, creating personalized 
              adventures that adapt to your unique playstyle.
            </p>
          </div>

          {/* Mission */}
          <div className="card-hero mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 glow-text text-center">Our Mission</h2>
            <p className="text-slate-300 text-lg leading-relaxed text-center">
              We believe that epic adventures shouldn't be limited by schedules, group availability, 
              or geographic constraints. Loneventure empowers every aspiring hero to embark on 
              legendary quests, develop compelling characters, and experience the magic of D&D 
              on their own terms.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12 glow-text">
              What Makes Loneventure Special
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="card group">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How It Works */}
          <div className="card-hero mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 glow-text text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Create Your Character</h3>
                <p className="text-slate-300">Build your hero with authentic D&D races, classes, and backgrounds.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Begin Your Adventure</h3>
                <p className="text-slate-300">Our AI Dungeon Master creates a personalized opening scene.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Shape Your Story</h3>
                <p className="text-slate-300">Make choices, roll dice, and watch your unique tale unfold.</p>
              </div>
            </div>
          </div>

          {/* Technology */}
          <div className="card mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 glow-text">Powered by Advanced AI</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Loneventure leverages IBM's Granite AI model, specifically designed for complex reasoning 
              and creative storytelling. This ensures that every adventure is unique, contextually aware, 
              and responsive to your character's development and choices.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Combined with Firebase's real-time database and authentication, we provide a seamless, 
              secure, and reliable platform for your solo adventures.
            </p>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="card-hero">
              <h2 className="text-2xl font-bold text-white mb-4 glow-text">Ready to Start Your Legend?</h2>
              <p className="text-slate-300 mb-8">
                Join the growing community of solo adventurers and discover what epic tales await you.
              </p>
              <button
                onClick={onBack}
                className="btn-hero"
              >
                Begin Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;