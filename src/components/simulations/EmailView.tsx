
import React, { useState } from 'react';
import { ScenarioContent, RiskPoint } from '@/simulations/types';
import { Mail, AlertCircle, Paperclip, FileText, FileArchive, Info } from 'lucide-react';

interface Props {
  content: ScenarioContent;
  highlight?: boolean;
  riskPoints?: RiskPoint[];
}

const Beacon = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="absolute -right-2 -top-2 w-6 h-6 z-10 group focus:outline-none"
  >
    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
    <span className="relative inline-flex rounded-full h-6 w-6 bg-red-600 items-center justify-center border-2 border-white shadow-sm">
      <Info className="w-3 h-3 text-white" />
    </span>
  </button>
);

const Tooltip = ({ text, onClose }: { text: string; onClose: () => void }) => (
  <div className="absolute z-20 bottom-full mb-2 right-0 w-64 bg-slate-900 text-white text-xs p-3 rounded shadow-xl animate-in fade-in slide-in-from-bottom-2">
    <div className="relative">
      {text}
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="block mt-2 text-indigo-300 hover:text-indigo-100 underline text-[10px]">
        Dismiss
      </button>
      <div className="absolute -bottom-1 right-2 w-2 h-2 bg-slate-900 transform rotate-45 translate-y-1/2"></div>
    </div>
  </div>
);

export const EmailView: React.FC<Props> = ({ content, highlight, riskPoints = [] }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const getRiskPoint = (loc: string) => riskPoints.find(r => r.location === loc);

  const renderRiskPoint = (location: string) => {
    if (!highlight) return null;
    const point = getRiskPoint(location);
    if (!point) return null;

    return (
      <div className="absolute top-0 right-0 h-full w-full pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          <Beacon onClick={() => setActiveTooltip(activeTooltip === location ? null : location)} />
          {activeTooltip === location && (
            <Tooltip text={point.text} onClose={() => setActiveTooltip(null)} />
          )}
        </div>
      </div>
    );
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'ZIP': return <FileArchive className="w-8 h-8 text-yellow-600" />;
      case 'EXE': return <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center text-xs font-bold text-white">EXE</div>;
      default: return <FileText className="w-8 h-8 text-blue-600" />;
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md border border-slate-200 overflow-visible font-sans relative">
      <div className="bg-slate-100 p-2.5 md:p-3 border-b border-slate-200 flex items-center gap-2">
        <Mail className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
        <span className="text-xs md:text-sm font-medium text-slate-600">Mail Client</span>
      </div>
      
      <div className="p-3 md:p-4 space-y-3">
        {/* SENDER ROW */}
        <div className="border-b border-slate-100 pb-2 relative group">
          <div className="flex items-baseline gap-2 mb-1 relative pr-6">
            <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase w-10 md:w-12 text-right flex-shrink-0">From:</span>
            <span className={`text-xs md:text-sm text-slate-900 break-all ${highlight && getRiskPoint('SENDER') ? 'bg-red-50 px-1 rounded' : ''}`}>
              {content.sender} &lt;{content.senderEmail}&gt;
            </span>
            {renderRiskPoint('SENDER')}
          </div>

          {/* SUBJECT ROW */}
          <div className="flex items-baseline gap-2 relative pr-6">
            <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase w-10 md:w-12 text-right flex-shrink-0">Subj:</span>
            <span className="text-xs md:text-sm font-medium text-slate-900 break-words">{content.subject}</span>
            {renderRiskPoint('SUBJECT')}
          </div>
        </div>

        {/* BODY */}
        <div className="py-4 relative">
          <div 
            className="prose prose-sm max-w-none text-slate-800"
            dangerouslySetInnerHTML={{ __html: content.body || '' }} 
          />
          {/* Floating Body Risk Point - Positioned near links usually */}
          {highlight && getRiskPoint('BODY') && (
             <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-2">
                <Beacon onClick={() => setActiveTooltip(activeTooltip === 'BODY' ? null : 'BODY')} />
                {activeTooltip === 'BODY' && (
                  <Tooltip text={getRiskPoint('BODY')!.text} onClose={() => setActiveTooltip(null)} />
                )}
             </div>
          )}
        </div>

        {/* ATTACHMENT */}
        {content.attachment && (
          <div className="relative mt-2">
             <div className={`bg-slate-50 p-3 rounded border ${highlight && getRiskPoint('ATTACHMENT') ? 'border-red-300 bg-red-50' : 'border-slate-200'} flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors`}>
                {getFileIcon(content.attachment.type)}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-700">{content.attachment.name}</span>
                  <span className="text-xs text-slate-500">{content.attachment.size}</span>
                </div>
             </div>
             {renderRiskPoint('ATTACHMENT')}
          </div>
        )}

        {highlight && (
          <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded p-2 flex items-start gap-2 text-xs text-indigo-700">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              {riskPoints.length > 0 
                ? "Click the pulsing red beacons above to see exactly what creates suspicion." 
                : "Review the details carefully."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
