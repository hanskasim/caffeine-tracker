import React, { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Clock, MapPin, Zap } from 'lucide-react';

const CaffeineTrackerMockup = () => {
  const [activeView, setActiveView] = useState('today');
  
  // Mock data for visualization
  const todayDrinks = [
    { id: 1, type: 'coffee', name: 'Iced Latte', time: '8:30 AM', caffeine: 150, cost: 5.50, location: 'Starbucks', emoji: '☕' },
    { id: 2, type: 'tea', name: 'Matcha', time: '2:15 PM', caffeine: 70, cost: 6.00, location: 'Nook Cafe', emoji: '🍵' },
    { id: 3, type: 'coffee', name: 'Espresso', time: '6:00 PM', caffeine: 120, cost: 3.50, location: 'Blue Bottle', emoji: '☕' }
  ];
  
  const totalCaffeine = todayDrinks.reduce((sum, d) => sum + d.caffeine, 0);
  const totalSpent = todayDrinks.reduce((sum, d) => sum + d.cost, 0);
  const caffeinePercentage = Math.min((totalCaffeine / 400) * 100, 100);
  
  // Simple character that grows with drinks
  const getCharacterSize = (drinkCount) => {
    if (drinkCount === 0) return 60;
    if (drinkCount <= 2) return 80;
    if (drinkCount <= 5) return 100;
    return 120;
  };
  
  const characterSize = getCharacterSize(todayDrinks.length);
  const isOvercaffeinated = totalCaffeine > 400;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 font-sans">
      <div className="max-w-md mx-auto">
        
        {/* Add Button - Primary Action at Top */}
        <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 mb-6 mt-2">
          <Plus className="w-6 h-6" />
          <span className="text-lg">Log a Drink</span>
        </button>

        {/* Header with cute mascot */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div 
              className={`transition-all duration-500 ease-out ${isOvercaffeinated ? 'animate-bounce' : ''}`}
              style={{ fontSize: `${characterSize}px` }}
            >
              {isOvercaffeinated ? '😵' : todayDrinks.length >= 3 ? '😊' : todayDrinks.length >= 1 ? '🙂' : '😴'}
            </div>
            {todayDrinks.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                {todayDrinks.length}
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold mt-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent" 
              style={{ fontFamily: 'Georgia, serif' }}>
            Caffeine Buddy
          </h1>
          <p className="text-amber-700 text-sm mt-1">Track your buzz & budget</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Caffeine</span>
            </div>
            <div className="text-3xl font-bold text-amber-900">{totalCaffeine}</div>
            <div className="text-xs text-amber-600">mg / 400mg daily</div>
            <div className="mt-3 bg-amber-100 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  isOvercaffeinated ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'
                }`}
                style={{ width: `${caffeinePercentage}%` }}
              />
            </div>
            {isOvercaffeinated && (
              <div className="text-xs text-red-600 font-semibold mt-2">⚠️ Over limit!</div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-xs font-semibold text-green-800 uppercase tracking-wide">Spent Today</span>
            </div>
            <div className="text-3xl font-bold text-green-900">${totalSpent.toFixed(2)}</div>
            <div className="text-xs text-green-600">$45.50 this week</div>
            <div className="mt-3 text-sm text-green-700">
              ↗️ <span className="font-semibold">+$12</span> vs last week
            </div>
          </div>
        </div>

        {/* Today's Drinks Timeline */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-amber-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-amber-900">Today's Drinks</h2>
            <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">
              Tuesday, Feb 3
            </span>
          </div>

          <div className="space-y-3">
            {todayDrinks.map((drink, index) => (
              <div 
                key={drink.id} 
                className="flex items-start gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:shadow-md transition-all"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl flex-shrink-0">{drink.emoji}</div>
                <div className="flex-grow">
                  <div className="font-semibold text-amber-900">{drink.name}</div>
                  <div className="flex items-center gap-3 text-xs text-amber-700 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {drink.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {drink.location}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-amber-900">${drink.cost}</div>
                  <div className="text-xs text-amber-600">{drink.caffeine}mg</div>
                </div>
              </div>
            ))}
          </div>

          {todayDrinks.length === 0 && (
            <div className="text-center py-8 text-amber-500">
              <div className="text-4xl mb-2">☕</div>
              <div className="text-sm">No drinks logged yet today</div>
            </div>
          )}
        </div>

        {/* Warning for late caffeine */}
        {todayDrinks.some(d => {
          const hour = parseInt(d.time.split(':')[0]);
          const isPM = d.time.includes('PM');
          const actualHour = isPM && hour !== 12 ? hour + 12 : hour;
          return actualHour >= 18; // 6 PM or later
        }) && (
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 rounded-2xl p-4 mb-6 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🌙</div>
              <div>
                <div className="font-bold text-purple-900 mb-1">Late caffeine alert!</div>
                <div className="text-sm text-purple-700">
                  You had caffeine at 6:00 PM. This might affect your sleep tonight.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Hint */}
        <div className="flex justify-center gap-6 mt-8 text-sm text-amber-600">
          <button className="font-semibold border-b-2 border-amber-500 pb-1">Today</button>
          <button className="hover:text-amber-800 transition-colors">Week</button>
          <button className="hover:text-amber-800 transition-colors">Stats</button>
        </div>

      </div>
    </div>
  );
};

export default CaffeineTrackerMockup;