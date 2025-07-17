import { Team } from '@/lib/types';

interface ScoreboardProps {
  redScore: number;
  blueScore: number;
  currentTeam: Team;
  redTotal: number;
  blueTotal: number;
}

export default function Scoreboard({ redScore, blueScore, currentTeam, redTotal, blueTotal }: ScoreboardProps) {
  return (
    <div className="score-display flex justify-between items-center rounded-lg p-3 mb-2">
      <div className={`flex items-center space-x-3 transition-all duration-300 ${currentTeam === 'red' ? 'scale-110 drop-shadow-lg' : 'opacity-70'}`}>
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-lg"></div>
          {currentTeam === 'red' && (
            <div className="absolute inset-0 w-8 h-8 bg-red-500 rounded-full animate-ping opacity-30"></div>
          )}
        </div>
        <div className="text-center">
          <span className="font-mono font-bold text-lg team-red-indicator">{redTotal - redScore}</span>
          <span className="text-xs text-gray-400 block">/{redTotal}</span>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Operación Activa</div>
        <span className={`font-mono font-bold text-lg uppercase tracking-wider ${currentTeam === 'red' ? 'team-red-indicator' : 'team-blue-indicator'}`}>
          {currentTeam === 'red' ? 'AGENTE ROJO' : 'AGENTE AZUL'}
        </span>
      </div>
      
      <div className={`flex items-center space-x-3 transition-all duration-300 ${currentTeam === 'blue' ? 'scale-110 drop-shadow-lg' : 'opacity-70'}`}>
        <div className="text-center">
          <span className="font-mono font-bold text-lg team-blue-indicator">{blueTotal - blueScore}</span>
          <span className="text-xs text-gray-400 block">/{blueTotal}</span>
        </div>
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full shadow-lg"></div>
          {currentTeam === 'blue' && (
            <div className="absolute inset-0 w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-30"></div>
          )}
        </div>
      </div>
    </div>
  );
}