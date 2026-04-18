import React, { useState, useEffect } from 'react';
import { TrafficController } from './core/TrafficController';
import type { Road } from './core/models/types';

const lightStyles = {
  red: 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]',
  yellow: 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]',
  green: 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]',
};

const getRandomEndRoad = (startRoad: Road): Road => {
  const roads: Road[] = ['north', 'south', 'east', 'west'];
  const possibleEnds = roads.filter((r) => r !== startRoad);
  return possibleEnds[Math.floor(Math.random() * possibleEnds.length)];
};

export default function App() {
  const [controller] = useState(() => new TrafficController());

  const [trafficState, setTrafficState] = useState(() => controller.getState());
  const [autoPlay, setAutoPlay] = useState(false);

  const syncState = () => {
    setTrafficState({ ...controller.getState() });
  };

  const handleStep = () => {
    controller.processCommand([{ type: 'step' }]);
    syncState();
  };

  const handleAddVehicle = (startRoad: Road) => {
    const endRoad = getRandomEndRoad(startRoad);
    const vehicleId = `veh_${Math.floor(Math.random() * 10000)}`;
    
    controller.processCommand([{
      type: 'addVehicle',
      vehicleId,
      startRoad,
      endRoad
    }]);
    syncState();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay) {
      interval = setInterval(() => {
        handleStep();
      }, 800); 
    }
    return () => clearInterval(interval);
  }, [autoPlay]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 font-sans">
      <h1 className="text-4xl font-bold mb-4">Wizualizacja Skrzyżowania</h1>
      <p className="text-gray-400 mb-8">System Inteligentnej Sygnalizacji Adaptacyjnej</p>

      {/* Skrzyżowanie (CSS Grid: 3x3) */}
      <div className="grid grid-cols-3 grid-rows-3 gap-2 p-4 bg-gray-800 rounded-2xl shadow-2xl relative">
        
        {/* PÓŁNOC */}
        <div className="col-start-2 row-start-1 flex flex-col items-center justify-end p-4 border-b-2 border-dashed border-gray-600">
          <button onClick={() => handleAddVehicle('north')} className="mb-4 bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm transition">+ Dodaj (Północ)</button>
          <div className="text-gray-300 font-mono text-sm mb-2">Oczekuje: {trafficState.queues.north.length}</div>
          <div className={`w-8 h-8 rounded-full ${lightStyles[trafficState.lights.north]}`} />
        </div>

        {/* ZACHÓD */}
        <div className="col-start-1 row-start-2 flex items-center justify-end p-4 border-r-2 border-dashed border-gray-600">
          <div className="flex items-center gap-4">
            <button onClick={() => handleAddVehicle('west')} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm transition whitespace-nowrap">+ Dodaj (Zachód)</button>
            <div className="flex flex-col items-center">
              <div className="text-gray-300 font-mono text-sm mb-2 text-center">Z<br/>{trafficState.queues.west.length}</div>
              <div className={`w-8 h-8 rounded-full ${lightStyles[trafficState.lights.west]}`} />
            </div>
          </div>
        </div>

        {/* ŚRODEK SKRZYŻOWANIA */}
        <div className="col-start-2 row-start-2 w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center">
           <span className="text-gray-500 text-xs text-center">Strefa<br/>kolizyjna</span>
        </div>

        {/* WSCHÓD */}
        <div className="col-start-3 row-start-2 flex items-center justify-start p-4 border-l-2 border-dashed border-gray-600">
           <div className="flex flex-row-reverse items-center gap-4">
            <button onClick={() => handleAddVehicle('east')} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm transition whitespace-nowrap">+ Dodaj (Wschód)</button>
            <div className="flex flex-col items-center">
              <div className="text-gray-300 font-mono text-sm mb-2 text-center">W<br/>{trafficState.queues.east.length}</div>
              <div className={`w-8 h-8 rounded-full ${lightStyles[trafficState.lights.east]}`} />
            </div>
          </div>
        </div>

        {/* POŁUDNIE */}
        <div className="col-start-2 row-start-3 flex flex-col items-center justify-start p-4 border-t-2 border-dashed border-gray-600">
          <div className={`w-8 h-8 rounded-full ${lightStyles[trafficState.lights.south]}`} />
          <div className="text-gray-300 font-mono text-sm mt-2">Oczekuje: {trafficState.queues.south.length}</div>
          <button onClick={() => handleAddVehicle('south')} className="mt-4 bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm transition">+ Dodaj (Południe)</button>
        </div>
      </div>

      {/* PANEL STEROWANIA */}
      <div className="mt-12 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center gap-6">
        <h2 className="text-xl font-semibold">Panel Sterowania Symulacją</h2>
        <div className="flex gap-4">
          <button 
            onClick={handleStep}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 font-bold rounded-lg transition"
          >
            ⏭ Wykonaj Krok
          </button>
          
          <button 
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-6 py-3 font-bold rounded-lg transition ${autoPlay ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}
          >
            {autoPlay ? '⏹ Zatrzymaj Auto-Play' : '▶️ Uruchom Auto-Play'}
          </button>
        </div>
      </div>

    </div>
  );
}