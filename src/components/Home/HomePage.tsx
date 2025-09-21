import React from 'react';
import { Sword, Shield, Wand2, Users, Scroll, Sparkles, Play, ArrowRight, BookOpen } from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string) => void;
  onStartAdventure: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onStartAdventure }) => {
  const features = [
    {
      icon: Users,
      title: 'Create Your Hero',
      description: 'Build unique D&D characters with full customization - races, classes, backgrounds, and abilities.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Wand2,
      title: 'AI Dungeon Master',
      description: 'Experience dynamic storytelling with our IBM Granite-powered AI that adapts to your choices.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Scroll,
      title: 'Epic Solo Campaigns',
      description: 'Embark on personalized adventures that evolve based on your character and decisions.',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const stats = [
    { label: 'Character Races', value: '9+', icon: Users },
    { label: 'Character Classes', value: '12+', icon: Shield },
    { label: 'Unique Backgrounds', value: '12+', icon: Scroll },
    { label: 'Dice Types', value: '6', icon: Sparkles }
  ];

  return (
    <div className="bg-slate-950 text-white">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/hero-bg.png')`
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-slate-900/70 to-slate-950"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-wide">
            Welcome to
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
              Loneventure
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Embark on epic solo D&D adventures powered by AI. Create your character,
            roll the dice, and let our intelligent Dungeon Master guide you through
            personalized quests in a world of endless possibilities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartAdventure}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 transition-all duration-300 flex items-center gap-2 text-lg font-semibold shadow-lg"
            >
              <Play className="w-6 h-6" />
              Start Your Adventure
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="px-6 py-3 rounded-lg border border-slate-500 hover:bg-slate-800/60 transition-all duration-300 flex items-center gap-2 text-lg font-semibold"
            >
              <BookOpen className="w-5 h-5" />
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Your Adventure Awaits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-xl bg-slate-900/70 border border-slate-700 hover:border-purple-500/50 transition-all duration-300 text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="group">
                <Icon className="w-10 h-10 mx-auto text-purple-400 mb-3 group-hover:text-cyan-400 transition-colors" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Sword className="w-12 h-12 text-amber-400 mx-auto mb-6" />
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Begin Your Quest?
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-8">
          Join thousands of adventurers who have discovered the magic of solo D&D campaigns.
          Create your character, roll for initiative, and let the adventure unfold.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('characters')}
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition text-lg font-semibold flex items-center gap-2"
          >
            <Users className="w-5 h-5" /> View Characters
          </button>
          <button
            onClick={() => onNavigate('campaigns')}
            className="px-6 py-3 rounded-lg border border-slate-600 hover:bg-slate-800 transition text-lg font-semibold flex items-center gap-2"
          >
            <Scroll className="w-5 h-5" /> Active Campaigns
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
