/**
 * @file ReelsView.tsx
 * TikTok / Instagram Reels style video swiper component matching target design.
 */

import React, { useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Loader2,
  MessageCircle,
  Play,
  Share2,
  Volume2,
  VolumeX,
  Download,
} from 'lucide-react';
import { useEvents, type Video } from 'media-react';
import { useReelSwiper } from 'media-ui-react';

export interface ReelsViewProps {
  videos: Video[];
  hasMore?: boolean;
  isAppending?: boolean;
  onLoadMore?: () => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  videos,
  hasMore,
  isAppending,
  onLoadMore,
}) => {
  const { emit, trackDownload } = useEvents();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const swiper = useReelSwiper<Video>({
    items: videos,
    autoPlay: true,
    onIndexChange: (_idx, item) => {
      emit('view', { mediaId: item.id, mediaType: 'video', item });
    },
    ariaLabel: 'Reel Video Feed',
  });

  const activeVideo = swiper.activeItem;

  // Infinite Scroll Trigger for Reels: load more when reaching close to end
  useEffect(() => {
    if (videos.length > 0 && swiper.currentIndex >= videos.length - 2) {
      if (hasMore && !isAppending && onLoadMore) {
        onLoadMore();
      }
    }
  }, [swiper.currentIndex, videos.length, hasMore, isAppending, onLoadMore]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = swiper.isMuted;
      if (swiper.isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [swiper.currentIndex, swiper.isPlaying, swiper.isMuted]);

  if (!activeVideo) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <p>No video reels available.</p>
      </div>
    );
  }



  return (
    <div className="w-full flex-1 flex items-center justify-center p-2 overflow-hidden">
      {/* Container simulating phone screen viewport - Full Screen height without scroll */}
      <div
        {...swiper.getContainerProps({
          className:
            'reel-container relative w-full max-w-[360px] sm:max-w-[400px] h-[75vh] max-h-[720px] min-h-[500px] bg-black rounded-[32px] overflow-x-hidden shadow-2xl border border-white/15 focus:outline-none focus:ring-2 focus:ring-indigo-500 m-auto no-scrollbar'
        })}
      >
        {videos.map((video, index) => {
          const isVideoActive = index === swiper.currentIndex;
          const videoFileLink = video.video_files?.[0]?.link;

          return (
            <div
              key={video.id}
              {...swiper.getItemProps(index, {
                className: 'reel-item relative w-full h-full flex-shrink-0 flex items-center justify-center bg-black'
              })}
            >
              {/* Poster Fallback Background */}
              {video.image && (
                <img 
                  src={video.image} 
                  alt={video.user?.name || 'Reel background'} 
                  className="absolute inset-0 w-full h-full object-cover z-0" 
                />
              )}

              {/* Active Video Player */}
              {isVideoActive ? (
                <video
                  ref={videoRef}
                  src={videoFileLink}
                  loop
                  muted={swiper.isMuted}
                  playsInline
                  className="relative w-full h-full object-cover cursor-pointer z-10"
                  onClick={swiper.togglePlay}
                />
              ) : (
                <div className="absolute inset-0 bg-black/50 z-10"></div>
              )}

              {/* Play/Pause Overlay Indicator when paused */}
              {isVideoActive && !swiper.isPlaying && (
                <button
                  {...swiper.getPlayPauseProps({
                    className:
                      'absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-lg pointer-events-auto z-20 cursor-pointer',
                  })}
                >
                  <Play className="w-8 h-8 ml-1 text-white" />
                </button>
              )}
            </div>
          );
        })}

        {/* Top Control Bar */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-20">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 bg-black/50 backdrop-blur-md border border-white/15 rounded-full text-[11px] font-extrabold tracking-wider uppercase shadow-md">
              REEL #{swiper.currentIndex + 1} / {videos.length}
            </span>
            {isAppending && (
              <span className="px-2.5 py-1 bg-indigo-600/80 backdrop-blur-md rounded-full text-[10px] font-semibold flex items-center gap-1.5 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                Loading...
              </span>
            )}
          </div>

          <button
            {...swiper.getMuteProps({
              className: 'reel-action-btn',
            })}
          >
            {swiper.isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>
        </div>

        {/* Right Floating Engagement Bar - Transparent Icons */}
        <div className="absolute right-3.5 bottom-24 flex flex-col items-center gap-3 text-white z-20">
          <button style={{ background: 'transparent', border: 'none', boxShadow: 'none' }} className="flex flex-col items-center group cursor-pointer p-0">
            <div className="flex items-center justify-center p-2 rounded-full transition-transform hover:scale-110">
              <Heart className="w-7 h-7 text-white drop-shadow-md" />
            </div>
            <span className="text-[11px] font-semibold text-white drop-shadow-md">12.4k</span>
          </button>

          <button style={{ background: 'transparent', border: 'none', boxShadow: 'none' }} className="flex flex-col items-center group cursor-pointer p-0">
            <div className="flex items-center justify-center p-2 rounded-full transition-transform hover:scale-110">
              <MessageCircle className="w-7 h-7 text-white drop-shadow-md" />
            </div>
            <span className="text-[11px] font-semibold text-white drop-shadow-md">842</span>
          </button>

          <button style={{ background: 'transparent', border: 'none', boxShadow: 'none' }} className="flex flex-col items-center group cursor-pointer p-0">
            <div className="flex items-center justify-center p-2 rounded-full transition-transform hover:scale-110">
              <Share2 className="w-7 h-7 text-white drop-shadow-md" />
            </div>
            <span className="text-[11px] font-semibold text-white drop-shadow-md">Share</span>
          </button>

          <button 
            style={{ background: 'transparent', border: 'none', boxShadow: 'none' }} 
            className="flex flex-col items-center group cursor-pointer p-0"
            onClick={() => activeVideo && trackDownload('video', activeVideo.id)}
          >
            <div className="flex items-center justify-center p-2 rounded-full transition-transform hover:scale-110">
              <Download className="w-7 h-7 text-white drop-shadow-md" />
            </div>
            <span className="text-[11px] font-semibold text-white drop-shadow-md">Save</span>
          </button>
        </div>

        {/* Bottom Metadata & Navigation Controls */}
        <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white z-20">
          <div className="pr-14 mb-1">
            <p className="font-bold text-base text-white leading-snug">{activeVideo.user?.name || 'Cup of Couple'}</p>
            <p className="text-xs text-white/80 mt-1 line-clamp-2">{(activeVideo as any).alt || 'Pexels Reel Video'}</p>
          </div>

          {/* Thin Horizontal Line Divider */}
          <div className="w-full border-t border-white/20 my-3" />

          {/* Reel Up/Down Controls Row */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/70 font-medium">Swipe or use Up/Down keys</span>
            <div className="flex items-center space-x-2">
              <button
                {...swiper.getPreviousProps({
                  className:
                    'w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/60 flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer',
                })}
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                {...swiper.getNextProps({
                  className:
                    'w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer',
                })}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
