import { AlertCircle } from "lucide-react";

export function SkillsAnalysisCard() {
  // Generate grid items for the waffle chart
  const totalCells = 40; // 10x4 grid roughly
  const greenCells = 24;
  const orangeCells = 8;

  return (
    <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-lime-500"></div>
            <span className="text-xs font-bold text-gray-500">Mastered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
            <span className="text-xs font-bold text-gray-500">Missing</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-1">
          <AlertCircle className="h-3 w-3 text-red-500" />
          <span className="text-[10px] font-bold text-gray-600">
            Missing critical keywords!
          </span>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-1.5">
        {Array.from({ length: totalCells }).map((_, i) => {
          let bgColor = "bg-gray-100";
          if (i < greenCells) bgColor = "bg-lime-500";
          else if (i < greenCells + orangeCells) bgColor = "bg-orange-500";

          return (
            <div key={i} className={`aspect-square rounded-sm ${bgColor}`} />
          );
        })}
      </div>
    </div>
  );
}
