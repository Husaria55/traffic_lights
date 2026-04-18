import { useState, useEffect, useCallback } from 'react';
import { TrafficController } from './core/TrafficController';
import type { Road, LightColor } from './core/models/types';

const getRandomEndRoad = (startRoad: Road): Road => {
  const roads: Road[] = ['north', 'south', 'east', 'west'];
  const possibleEnds = roads.filter((r) => r !== startRoad);
  return possibleEnds[Math.floor(Math.random() * possibleEnds.length)];
};

const HardwareTrafficLight = ({ activeColor, horizontal = false }: { activeColor: LightColor, horizontal?: boolean }) => {
  return (
    <div className={`border-2 border-green-900 bg-black p-2 flex ${horizontal ? 'flex-row' : 'flex-col'} gap-2`}>
      <div className={`w-5 h-5 rounded-full border ${activeColor === 'red' ? 'bg-red-500 border-red-300 shadow-[0_0_10px_#ef4444]' : 'bg-red-950 border-red-900 opacity-40'}`} />
      <div className={`w-5 h-5 rounded-full border ${activeColor === 'yellow' ? 'bg-yellow-400 border-yellow-200 shadow-[0_0_10px_#facc15]' : 'bg-yellow-950 border-yellow-900 opacity-40'}`} />
      <div className={`w-5 h-5 rounded-full border ${activeColor === 'green' ? 'bg-green-500 border-green-300 shadow-[0_0_10px_#22c55e]' : 'bg-green-950 border-green-900 opacity-40'}`} />
    </div>
  );
};

export default function App() {
  const [controller] = useState(() => new TrafficController());
  const [trafficState, setTrafficState] = useState(() => controller.getState());
  const [autoPlay, setAutoPlay] = useState(false);
  const [tickCount, setTickCount] = useState(0); 
  const syncState = useCallback(() => {
    setTrafficState({ ...controller.getState() });
  }, [controller]);

  const handleStep = useCallback(() => {
    controller.processCommand([{ type: 'step' }]);
    setTickCount(prev => prev + 1);
    syncState();
  }, [controller, syncState]);

  const handleAddVehicle = (startRoad: Road) => {
    const endRoad = getRandomEndRoad(startRoad);
    const vehicleId = `V_${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
    
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
      }, 600);
    }
    return () => clearInterval(interval);
  }, [autoPlay, handleStep]);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col items-center py-8 px-4 selection:bg-green-500 selection:text-black">
      
      {/* NAGŁÓWEK SYSTEMU */}
      <div className="w-full max-w-4xl mb-8 border-b-2 border-green-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-widest">TRAFFIC_CTRL // v1.0.0</h1>
          <p className="text-green-700 text-sm mt-1">{"[ INTERSECTION MANAGEMENT SUBSYSTEM ]"}</p>
        </div>
        <div className="text-right text-sm">
          <div className="text-green-700">STATUS: <span className="text-green-400">ONLINE</span></div>
          <div className="text-green-700">CYCLES: <span className="text-green-400">{tickCount.toString().padStart(6, '0')}</span></div>
        </div>
      </div>

      {/* GŁÓWNY WIDOK SKRZYŻOWANIA */}
      <div className="w-full max-w-4xl grid grid-cols-3 grid-rows-3 gap-1 p-2 bg-[#050505] border-2 border-green-900 relative shadow-[0_0_30px_rgba(0,255,0,0.05)]">
        
        {/* PÓŁNOC */}
        <div className="col-start-2 row-start-1 flex flex-col items-center justify-end p-4 border-b border-dashed border-green-900">
          <button 
            onClick={() => handleAddVehicle('north')} 
            className="mb-4 border border-green-700 text-green-600 hover:bg-green-500 hover:text-black px-2 py-1 text-xs transition-none active:translate-y-px"
          >
            {">"} ADD_VEH(N)
          </button>
          <div className="text-green-600 text-xs mb-2">Q_LEN: {trafficState.queues.north.length.toString().padStart(2, '0')}</div>
          <HardwareTrafficLight activeColor={trafficState.lights.north} />
        </div>

        {/* ZACHÓD */}
        <div className="col-start-1 row-start-2 flex items-center justify-end p-4 border-r border-dashed border-green-900">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleAddVehicle('west')} 
              className="border border-green-700 text-green-600 hover:bg-green-500 hover:text-black px-2 py-1 text-xs transition-none whitespace-nowrap active:translate-y-px"
            >
              {">"} ADD_VEH(W)
            </button>
            <div className="flex flex-col items-center">
              <div className="text-green-600 text-xs mb-2">Q_LEN:<br/>{trafficState.queues.west.length.toString().padStart(2, '0')}</div>
              <HardwareTrafficLight activeColor={trafficState.lights.west} horizontal />
            </div>
          </div>
        </div>

        {/* ŚRODEK SKRZYŻOWANIA (Strefa X) */}
        <div className="col-start-2 row-start-2 flex items-center justify-center border border-green-900 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#0a2e0a_10px,#0a2e0a_12px)]">
           <span className="bg-black px-2 py-1 text-green-800 text-xs border border-green-900">{"[ ZONE_X ]"}</span>
        </div>

        {/* WSCHÓD */}
        <div className="col-start-3 row-start-2 flex items-center justify-start p-4 border-l border-dashed border-green-900">
           <div className="flex flex-row-reverse items-center gap-4">
            <button 
              onClick={() => handleAddVehicle('east')} 
              className="border border-green-700 text-green-600 hover:bg-green-500 hover:text-black px-2 py-1 text-xs transition-none whitespace-nowrap active:translate-y-px"
            >
              ADD_VEH(E) {"<"}
            </button>
            <div className="flex flex-col items-center">
              <div className="text-green-600 text-xs mb-2">Q_LEN:<br/>{trafficState.queues.east.length.toString().padStart(2, '0')}</div>
              <HardwareTrafficLight activeColor={trafficState.lights.east} horizontal />
            </div>
          </div>
        </div>

        {/* POŁUDNIE */}
        <div className="col-start-2 row-start-3 flex flex-col items-center justify-start p-4 border-t border-dashed border-green-900">
          <HardwareTrafficLight activeColor={trafficState.lights.south} />
          <div className="text-green-600 text-xs mt-2">Q_LEN: {trafficState.queues.south.length.toString().padStart(2, '0')}</div>
          <button 
            onClick={() => handleAddVehicle('south')} 
            className="mt-4 border border-green-700 text-green-600 hover:bg-green-500 hover:text-black px-2 py-1 text-xs transition-none active:translate-y-px"
          >
            {">"} ADD_VEH(S)
          </button>
        </div>
      </div>

      {/* PANEL KONTROLNY */}
      <div className="w-full max-w-4xl mt-8 border border-green-800 bg-[#020502] p-6 flex flex-col gap-4">
        <div className="text-green-700 text-sm border-b border-green-900 pb-2">{"// COMMAND TERMINAL"}</div>
        
        <div className="flex gap-4">
          <button 
            onClick={handleStep}
            className="flex-1 border-2 border-green-600 text-green-500 py-3 font-bold hover:bg-green-600 hover:text-black active:bg-green-800 transition-none uppercase tracking-widest"
          >
            [ EXECUTE_TICK ]
          </button>
          
          <button 
            onClick={() => setAutoPlay(!autoPlay)}
            className={`flex-1 border-2 py-3 font-bold transition-none uppercase tracking-widest ${
              autoPlay 
                ? 'border-red-600 text-red-500 hover:bg-red-600 hover:text-black' 
                : 'border-green-600 text-green-500 hover:bg-green-600 hover:text-black'
            }`}
          >
            {autoPlay ? '[ HALT_AUTOPLAY ]' : '[ START_AUTOPLAY ]'}
          </button>
        </div>

        <div className="text-xs text-green-800 mt-2">
          SYSTEM_LOG: Wprowadź zdarzenia wejściowe (dodaj pojazdy) a następnie użyj sekwencera czasowego (EXECUTE_TICK).
        </div>
      </div>

    </div>
  );
}