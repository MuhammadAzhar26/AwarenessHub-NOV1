
import React from 'react';
import { ScenarioContent, ScenarioType } from '@/simulations/types';
import { MessageSquare, Battery, Wifi, Signal, PhoneCall } from 'lucide-react';

interface Props {
  content: ScenarioContent;
  highlight?: boolean;
  type?: ScenarioType;
}

export const SmsView: React.FC<Props> = ({ content, highlight, type = ScenarioType.SMS }) => {
  const isVoice = type === ScenarioType.VOICE;

  return (
    <div className="w-full max-w-[375px] mx-auto bg-slate-900 rounded-[2.5rem] border-[6px] border-slate-800 overflow-hidden shadow-2xl">
      {/* Fake Status Bar */}
      <div className="bg-slate-900 px-6 py-3 flex justify-between items-center text-white text-[11px] font-medium">
        <span>9:41</span>
        <div className="absolute left-1/2 transform -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-3xl"></div>
        <div className="flex gap-1.5 items-center">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* App Header */}
      <div className={`${isVoice ? 'bg-green-700' : 'bg-slate-800'} p-3 flex items-center gap-3 border-b border-slate-700 transition-colors`}>
        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
           {isVoice ? <PhoneCall className="w-4 h-4" /> : "?"}
        </div>
        <div className="flex flex-col">
          <span className={`text-sm font-medium text-white ${highlight ? 'text-red-400' : ''}`}>
            {content.phoneNumber}
          </span>
          <span className="text-[10px] text-slate-400">{isVoice ? "Incoming Call Transcript" : "Text Message"}</span>
        </div>
      </div>

      {/* Messages / Transcript */}
      <div className="bg-slate-950 min-h-[280px] p-4 flex flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {isVoice && (
          <div className="text-center text-xs text-slate-500 mb-2 italic flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Voice to Text Transcript Active
          </div>
        )}
        <div className={`self-start bg-slate-800 text-white p-3.5 rounded-2xl rounded-tl-none text-sm max-w-[85%] leading-relaxed ${highlight ? 'ring-2 ring-red-500' : ''}`}>
          {content.message}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-slate-900 p-3 flex items-center gap-2">
        {!isVoice ? (
          <>
            <div className="bg-slate-800 h-8 rounded-full flex-1 px-3 text-xs flex items-center text-slate-500">
              Message...
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
          </>
        ) : (
             <div className="w-full flex justify-center gap-8 pb-2">
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center animate-pulse"><PhoneCall className="w-6 h-6 text-white rotate-135" /></div>
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center"><PhoneCall className="w-6 h-6 text-white" /></div>
             </div>
        )}
      </div>
    </div>
  );
};
