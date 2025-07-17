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
    <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-2 mb-2">
      <div className={`flex items-center space-x-2 ${currentTeam === 'red' ? 'scale-110' : ''}`}>
        <div className="w-6 h-6 bg-red-500 rounded"></div>
        <span className="font-bold text-sm">{redTotal - redScore}/{redTotal}</span>
      </div>
      
      <div className="text-xs text-gray-500">
        Turno: <span className={`font-bold ${currentTeam === 'red' ? 'text-red-500' : 'text-blue-500'}`}>
          {currentTeam === 'red' ? 'ROJO' : 'AZUL'}
        </span>
      </div>
      
      <div className={`flex items-center space-x-2 ${currentTeam === 'blue' ? 'scale-110' : ''}`}>
        <span className="font-bold text-sm">{blueTotal - blueScore}/{blueTotal}</span>
        <div className="w-6 h-6 bg-blue-500 rounded"></div>
      </div>
    </div>
  );
}