import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles } from 'lucide-react';
import { ambientSynth } from '../../modules/audio/AudioSynthesizer';
import { audioCacheService } from '../../modules/audio/AudioCacheService';

interface BackgroundMusicPlayerProps {
  currentTrack: {
    id: string;
    label: string;
    url: string;
    trimStart?: number;
    trimDuration?: number;
  };
  onSelectTrack?: (track: any) => void;
  tracks?: any[];
}

export const BackgroundMusicPlayer: React.FC<BackgroundMusicPlayerProps> = ({
  currentTrack,
  onSelectTrack,
  tracks = []
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [useSynthFallback, setUseSynthFallback] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [activePlayableUrl, setActivePlayableUrl] = useState<string>(currentTrack.url);

  // Unblock autoplay on any first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      if (audioRef.current && currentTrack.id !== 'none' && isPlaying) {
        audioRef.current.play().catch(() => {
          // Fallback to Web Audio synth
          setUseSynthFallback(true);
          ambientSynth.start();
        });
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [currentTrack, isPlaying]);

  // Handle track changes with IndexedDB Cache resolution
  useEffect(() => {
    if (currentTrack.id === 'none') {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      ambientSynth.stop();
      setIsPlaying(false);
      setUseSynthFallback(false);
      return;
    }

    setIsPlaying(true);
    setUseSynthFallback(false);
    ambientSynth.stop();

    let isMounted = true;

    audioCacheService.getOrFetchAudioUrl(currentTrack.url).then((resolvedUrl) => {
      if (!isMounted) return;
      setActivePlayableUrl(resolvedUrl);

      if (audioRef.current) {
        audioRef.current.src = resolvedUrl;
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('[BackgroundMusicPlayer] HTML5 audio blocked or failed, switching to synth:', err);
            setUseSynthFallback(true);
            if (isPlaying) {
              ambientSynth.start();
            }
          });
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentTrack.id, currentTrack.url]);

  const togglePlayPause = () => {
    if (currentTrack.id === 'none') return;

    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      ambientSynth.stop();
    } else {
      setIsPlaying(true);
      if (useSynthFallback) {
        ambientSynth.start();
      } else if (audioRef.current) {
        audioRef.current.play().catch(() => {
          setUseSynthFallback(true);
          ambientSynth.start();
        });
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
    if (nextMuted) {
      ambientSynth.stop();
    } else if (isPlaying && useSynthFallback) {
      ambientSynth.start();
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const start = currentTrack.trimStart || 0;
    const dur = currentTrack.trimDuration;
    if (dur && dur > 0) {
      const end = start + dur;
      if (audioRef.current.currentTime >= end || audioRef.current.currentTime < start) {
        audioRef.current.currentTime = start;
      }
    }
  };

  if (currentTrack.id === 'none') return null;

  return (
    <audio
      ref={audioRef}
      src={currentTrack.url}
      loop
      preload="auto"
      crossOrigin="anonymous"
      onLoadedData={() => {
        if (audioRef.current && currentTrack.trimStart) {
          audioRef.current.currentTime = currentTrack.trimStart;
        }
      }}
      onTimeUpdate={handleTimeUpdate}
      onError={() => {
        console.warn('[BackgroundMusicPlayer] Audio network error, switching to synth fallback');
        setUseSynthFallback(true);
        if (isPlaying) ambientSynth.start();
      }}
      className="hidden"
    />
  );
};
