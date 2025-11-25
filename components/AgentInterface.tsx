import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, Phone, PhoneOff, AlertCircle } from 'lucide-react';
import { AgentType, AgentConfig } from '../types';
import { AGENTS } from '../constants';
import { base64ToUint8Array, decodeAudioData, createPcmBlob } from '../utils/audioUtils';
import { Visualizer } from './Visualizer';

const API_KEY = process.env.API_KEY || '';

interface AgentInterfaceProps {
  selectedAgentId: AgentType;
  onAgentChange: (id: AgentType) => void;
}

export const AgentInterface: React.FC<AgentInterfaceProps> = ({ selectedAgentId, onAgentChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Refs for Audio Contexts and cleanup
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  // Clean up function to stop everything
  const disconnect = useCallback(() => {
    // Stop all audio sources
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) { /* ignore */ }
    });
    sourcesRef.current.clear();

    // Close microphone stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Disconnect script processor
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      inputSourceRef.current = null;
    }

    // Close contexts
    if (inputAudioContextRef.current?.state !== 'closed') {
      inputAudioContextRef.current?.close();
    }
    if (outputAudioContextRef.current?.state !== 'closed') {
      outputAudioContextRef.current?.close();
    }
    
    // Attempt to close session if possible (though no direct close() on promise)
    sessionPromiseRef.current = null;
    
    setIsConnected(false);
    setIsSpeaking(false);
    nextStartTimeRef.current = 0;
  }, []);

  // Handle agent switch: if connected, disconnect first
  const handleAgentChange = (id: AgentType) => {
    if (isConnected) {
      disconnect();
    }
    onAgentChange(id);
  };

  const connect = async () => {
    setError(null);
    if (!API_KEY) {
      setError("API Key is missing in environment variables.");
      return;
    }

    try {
      const agent = AGENTS[selectedAgentId];
      const ai = new GoogleGenAI({ apiKey: API_KEY });

      // Initialize Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Get Microphone Access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect to Live API
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: agent.systemInstruction,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: agent.voiceName } }
          }
        },
        callbacks: {
          onopen: () => {
            console.log("Connection established");
            setIsConnected(true);
            
            // Setup Audio Streaming Pipeline
            if (!inputAudioContextRef.current || !streamRef.current) return;
            
            const source = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
            inputSourceRef.current = source;
            
            const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              
              // Send to API
              sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
              }).catch(err => console.error("Session send error", err));
            };

            source.connect(processor);
            processor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output from Model
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (base64Audio && outputAudioContextRef.current) {
              setIsSpeaking(true);
              const ctx = outputAudioContextRef.current;
              
              try {
                // Determine start time to prevent gaps
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                const audioBuffer = await decodeAudioData(
                  base64ToUint8Array(base64Audio),
                  ctx,
                  24000,
                  1
                );
                
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                
                const gainNode = ctx.createGain();
                // Simple volume boost if needed
                gainNode.gain.value = 1.0; 
                
                source.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                source.onended = () => {
                    sourcesRef.current.delete(source);
                    if (sourcesRef.current.size === 0) {
                        setIsSpeaking(false);
                    }
                };
                
                source.start(nextStartTimeRef.current);
                sourcesRef.current.add(source);
                
                // Update next start time
                nextStartTimeRef.current += audioBuffer.duration;
              } catch (err) {
                console.error("Audio decoding error:", err);
              }
            }

            // Handle interruptions (User speaks over AI)
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(src => {
                  try { src.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onclose: () => {
            console.log("Connection closed");
            setIsConnected(false);
            disconnect();
          },
          onerror: (err) => {
            console.error("Connection error", err);
            setError("Connection to AI Agent failed. Please try again.");
            disconnect();
          }
        }
      });
      
      sessionPromiseRef.current = sessionPromise;

    } catch (err) {
      console.error("Initialization error:", err);
      setError("Failed to initialize microphone or connection.");
      disconnect();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  const activeAgent = AGENTS[selectedAgentId];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-6 w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">UPCA AI Voice Assistant</h3>
        <p className="text-slate-400 text-sm mb-4">Select an agent persona to test capabilities.</p>
        
        {/* Agent Selector */}
        <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
          {(Object.values(AGENTS) as AgentConfig[]).map((agent) => (
            <button
              key={agent.id}
              onClick={() => handleAgentChange(agent.id)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                selectedAgentId === agent.id 
                  ? 'bg-brand-accent text-brand-dark shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {agent.id === AgentType.FRONT_DESK ? 'Front Desk' : 'Emergency'}
            </button>
          ))}
        </div>

        {/* Agent Details */}
        <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-left transition-all duration-300">
            <h4 className="text-brand-accent font-medium mb-1">{activeAgent.name}</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">{activeAgent.role}</p>
            <p className="text-sm text-slate-300">{activeAgent.description}</p>
        </div>
      </div>

      {/* Visualizer & Controls */}
      <div className="space-y-6">
        <Visualizer isActive={isConnected} isSpeaking={isSpeaking} />

        {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/30 text-red-400 text-sm rounded-lg border border-red-900">
                <AlertCircle size={16} />
                <span>{error}</span>
            </div>
        )}

        <button
          onClick={isConnected ? disconnect : connect}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-lg ${
            isConnected
              ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-2 border-red-500'
              : 'bg-brand-accent text-brand-dark hover:bg-yellow-400 hover:scale-[1.02] shadow-yellow-900/20'
          }`}
        >
          {isConnected ? (
            <>
              <PhoneOff size={24} />
              <span>End Call</span>
            </>
          ) : (
            <>
              <Phone size={24} />
              <span>Call {activeAgent.name.split(' ')[0]}</span>
            </>
          )}
        </button>
        
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <Mic size={12} />
            <span>Microphone access required</span>
        </div>
      </div>
    </div>
  );
};
