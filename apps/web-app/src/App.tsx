import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Grid } from 'react-window';
import { useSearch, useEvents } from 'media-react';
import { useGrid, useLightbox, useReelSwiper } from 'media-ui-react';
import './App.css';

const PRESET_TAGS = [
  'Nature', 'Cyberpunk', 'Architecture', 'Space', 
  'Abstract', 'Ocean', 'Wildlife', 'Minimalist', 'Tokyo', 'Cozy'
];

const App = () => {
  const [query, setQuery] = useState('nature');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(30);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');

  const { search, loading, error, photosResult, videosResult } = useSearch();
  const { trackView } = useEvents();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);
  const [likedPhotos, setLikedPhotos] = useState<Record<number, boolean>>({});

  // Initial fetch and fetch on query/page/perPage changes
  useEffect(() => {
    search(query, page, perPage);
  }, [query, page, perPage, search]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get('query') as string)?.trim();
    if (q && q !== query) {
      setQuery(q);
      setPage(1);
    }
  };

  const handleTagClick = (tag: string) => {
    if (tag.toLowerCase() !== query.toLowerCase()) {
      setQuery(tag.toLowerCase());
      setPage(1);
    }
  };

  const handlePhotoClick = (index: number, id: number) => {
    trackView('image', id);
    setLightboxInitialIndex(index);
    setLightboxOpen(true);
  };

  const toggleLike = (photoId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotos(prev => ({ ...prev, [photoId]: !prev[photoId] }));
  };

  const photos = photosResult?.photos || [];
  const videos = videosResult?.videos || [];
  const hasNextPage = activeTab === 'photos' ? !!photosResult?.next_page : !!videosResult?.next_page;

  const handleLoadMore = useCallback(() => {
    if (!loading && hasNextPage) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasNextPage]);

  return (
    <div className="app-container">
      {/* Header & Controls */}
      <header className="header">
        <div className="header-top">
          <div className="brand">
            <div className="brand-icon">✨</div>
            <div>
              <span className="brand-title">AetherMedia</span>
              <span className="brand-subtitle">Virtualized Media Explorer</span>
            </div>
          </div>

          {/* Search Form */}
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              name="query" 
              className="search-input" 
              placeholder="Search high-res photos & videos..." 
              defaultValue={query}
              key={query} 
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Header Controls */}
          <div className="header-controls">
            <div className="tabs-toggle">
              <button 
                className={`tab-btn ${activeTab === 'photos' ? 'active' : ''}`}
                onClick={() => setActiveTab('photos')}
              >
                📸 Photos ({photos.length})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
                onClick={() => setActiveTab('videos')}
              >
                🎬 Reels ({videos.length})
              </button>
            </div>

            <div className="page-size-selector">
              <span>Batch:</span>
              <select 
                className="page-size-select"
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={15}>15 / page</option>
                <option value={30}>30 / page</option>
                <option value={50}>50 / page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Tag Pills */}
        <div className="header-bottom">
          <div className="tag-pills">
            {PRESET_TAGS.map(tag => (
              <button
                key={tag}
                className={`tag-pill ${query.toLowerCase() === tag.toLowerCase() ? 'active' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Performance & Virtualization Metrics Bar */}
      <div className="stats-bar">
        <div className="stats-group">
          <div className="stat-item">
            <span>Query:</span>
            <span className="stat-badge">"{query}"</span>
          </div>
          <div className="stat-item">
            <span>Loaded:</span>
            <span className="stat-badge green">{activeTab === 'photos' ? photos.length : videos.length} items</span>
          </div>
          <div className="stat-item">
            <span>Page:</span>
            <span className="stat-badge">{page}</span>
          </div>
        </div>
        <div className="stats-group">
          <div className="stat-item">
            <span>Virtualization Status:</span>
            <span className="stat-badge green">⚡ React Window Virtualized</span>
          </div>
          <div className="stat-item">
            <span>Reel Preloader:</span>
            <span className="stat-badge green">🚀 Next 2 Reels Preloaded</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Content */}
      <main className="main-content">
        {error && <div className="error" style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '12px' }}>{error.message}</div>}

        {activeTab === 'photos' ? (
          <VirtualizedPhotoGrid
            photos={photos}
            loading={loading}
            hasNextPage={hasNextPage}
            onLoadMore={handleLoadMore}
            onPhotoClick={handlePhotoClick}
            likedPhotos={likedPhotos}
            onToggleLike={toggleLike}
          />
        ) : (
          <VideoReelSection
            videos={videos}
            loading={loading}
            hasNextPage={hasNextPage}
            onLoadMore={handleLoadMore}
          />
        )}
      </main>

      {/* Lightbox Modal */}
      {photos.length > 0 && (
        <PhotoLightbox
          photos={photos}
          isOpen={lightboxOpen}
          initialIndex={lightboxInitialIndex}
          onClose={() => setLightboxOpen(false)}
          likedPhotos={likedPhotos}
          onToggleLike={toggleLike}
        />
      )}
    </div>
  );
};

// --- Cell Renderer & Props for Virtualized Photo Grid ---

interface PhotoCellCustomProps {
  photos: any[];
  columnCount: number;
  onPhotoClick: (index: number, id: number) => void;
  likedPhotos: Record<number, boolean>;
  onToggleLike: (id: number, e: React.MouseEvent) => void;
  getItemProps: (index: number, columnsCount?: number) => any;
}

function PhotoCell({
  columnIndex,
  rowIndex,
  style,
  photos,
  columnCount,
  onPhotoClick,
  likedPhotos,
  onToggleLike,
  getItemProps,
}: {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
} & PhotoCellCustomProps): React.ReactElement | null {
  const index = rowIndex * columnCount + columnIndex;
  if (index >= photos.length) return null;

  const photo = photos[index];
  const isLiked = likedPhotos[photo.id];

  return (
    <div style={style} className="photo-card-wrapper" key={photo.id}>
      <div 
        className="photo-card"
        {...getItemProps(index, columnCount)}
        onClick={() => onPhotoClick(index, photo.id)}
        style={{ backgroundColor: photo.avg_color || '#1e293b' }}
      >
        <img 
          src={photo.src.medium} 
          alt={photo.alt || photo.photographer} 
          className="photo-img" 
          loading="lazy" 
        />
        
        <div className="card-overlay">
          <div className="card-top-actions">
            <button 
              className="icon-btn" 
              onClick={(e) => onToggleLike(photo.id, e)}
              aria-label="Like photo"
              style={{ color: isLiked ? '#ec4899' : 'white' }}
            >
              {isLiked ? '❤️' : '🤍'}
            </button>
          </div>
          
          <div className="card-bottom-info">
            <div className="photographer-name">📷 {photo.photographer}</div>
            {photo.alt && <div className="photo-alt">{photo.alt}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Virtualized Photo Grid Component using react-window ---

interface VirtualizedPhotoGridProps {
  photos: any[];
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  onPhotoClick: (index: number, id: number) => void;
  likedPhotos: Record<number, boolean>;
  onToggleLike: (id: number, e: React.MouseEvent) => void;
}

const VirtualizedPhotoGrid: React.FC<VirtualizedPhotoGridProps> = ({
  photos,
  loading,
  hasNextPage,
  onLoadMore,
  onPhotoClick,
  likedPhotos,
  onToggleLike,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 700 });

  const { getContainerProps, getItemProps, handleItemsRendered } = useGrid({
    loading,
    hasNextPage,
    onLoadMore,
    thresholdRows: 2,
  });

  // Calculate container dimensions dynamically
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Compute responsive columns count
  const columnCount = dimensions.width > 1200 ? 4 : dimensions.width > 800 ? 3 : dimensions.width > 500 ? 2 : 1;
  const columnWidth = Math.floor(dimensions.width / columnCount);
  const rowHeight = 280;
  const rowCount = Math.ceil(photos.length / columnCount);

  if (photos.length === 0 && loading) {
    return (
      <div className="skeleton-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-card skeleton-box" />
        ))}
      </div>
    );
  }

  if (photos.length === 0 && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
        <h3>No photos found</h3>
        <p>Try searching for another keyword like "nature", "tokyo", or "cyberpunk".</p>
      </div>
    );
  }

  return (
    <div className="grid-virtual-container" ref={containerRef} {...getContainerProps()}>
      <Grid<PhotoCellCustomProps>
        columnCount={columnCount}
        columnWidth={columnWidth}
        rowCount={rowCount}
        rowHeight={rowHeight}
        cellComponent={PhotoCell}
        cellProps={{
          photos,
          columnCount,
          onPhotoClick,
          likedPhotos,
          onToggleLike,
          getItemProps,
        }}
        onCellsRendered={({ rowStopIndex }) => {
          handleItemsRendered({ visibleRowStopIndex: rowStopIndex, rowCount });
        }}
        style={{ width: '100%', height: '100%' }}
      />

      {/* Floating Infinite Loading Spinner */}
      {loading && (
        <div className="infinite-loading-pill">
          <div className="spinner" />
          <span>Fetching next batch...</span>
        </div>
      )}
    </div>
  );
};

// --- Enhanced Video Reel Player Component with Instagram-style Preloading ---

interface VideoReelSectionProps {
  videos: any[];
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

const VideoReelSection: React.FC<VideoReelSectionProps> = ({
  videos,
  loading,
  hasNextPage,
  onLoadMore,
}) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const containerEl = (getContainerProps() as any).ref?.current as HTMLElement | undefined;
    const sentinel = loadMoreRef.current;
    if (!sentinel || !containerEl) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loading && hasNextPage) {
            onLoadMore();
          }
        });
      },
      { root: containerEl, rootMargin: '200px', threshold: 0.1 }
    );

    io.observe(sentinel);
    return () => io.disconnect();
  }, [getContainerProps, loading, hasNextPage, onLoadMore]);
  const { activeIndex, getContainerProps, getItemProps } = useReelSwiper({
    totalItems: videos.length,
    loading,
    hasNextPage,
    onLoadMore,
  });

  const { trackView } = useEvents();
  const [muted, setMuted] = useState(true);
  const [commentsVideo, setCommentsVideo] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    if (videos[activeIndex]) {
      trackView('video', videos[activeIndex].id);
    }
  }, [activeIndex, videos, trackView]);

  // Scroll navigation helpers
  const handleNavigateReel = (direction: 'up' | 'down') => {
    const container = (getContainerProps() as any).ref?.current;
    if (container) {
      const scrollAmount = container.clientHeight;
      container.scrollBy({
        top: direction === 'down' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (videos.length === 0 && loading) {
      return (
        <div className="reel-wrapper">
          <div className="reel-container skeleton-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner" style={{ width: '40px', height: '40px' }} />
          </div>
        </div>
      );
    }

    return (
      <div className="reel-wrapper">
        {/* Background Video Preloader (Preloads next 2 reels in background like Instagram) */}
        <div style={{ display: 'none' }} aria-hidden="true">
          {[1, 2].map((offset) => {
            const nextVid = videos[activeIndex + offset];
            if (!nextVid) return null;
            const nextFile = nextVid.video_files?.find((f: any) => f.quality === 'hd') || nextVid.video_files?.[0];
            return nextFile ? (
              <video
                key={`preload-${nextVid.id}-${offset}`}
                src={nextFile.link}
                preload="auto"
                muted
                playsInline
              />
            ) : null;
          })}
        </div>

        {/* Reel Container */}
        <div className="reel-container" {...getContainerProps()}>
          {videos.map((video: any, idx: number) => {
            const isActive = activeIndex === idx;

            return (
              <SingleReelItem
                key={`${video.id}-${idx}`}
                video={video}
                idx={idx}
                isActive={isActive}
                muted={muted}
                onToggleMute={() => setMuted(!muted)}
                onOpenComments={() => setCommentsVideo(video)}
                onToast={showToast}
                getItemProps={getItemProps}
              />
            );
          })}

          {loading && (
            <div className="infinite-loading-pill">
              <div className="spinner" />
              <span>Loading more reels...</span>
            </div>
          )}

          {/* Interactive Slide-Up Comments Drawer */}
          {commentsVideo && (
            <ReelCommentsDrawer 
              onClose={() => setCommentsVideo(null)} 
            />
          )}
        </div>

        {/* Vertical Navigation Controls on Desktop */}
        <div className="reel-nav-controls">
          <button 
            className="reel-nav-btn" 
            onClick={() => handleNavigateReel('up')}
            disabled={activeIndex === 0}
            title="Previous Reel (Up Arrow)"
          >
            ▲
          </button>
          <button 
            className="reel-nav-btn" 
            onClick={() => handleNavigateReel('down')}
            disabled={activeIndex >= videos.length - 1}
            title="Next Reel (Down Arrow)"
          >
            ▼
          </button>
        </div>

        {/* Floating Toast Notification Alert */}
        {toastMessage && (
          <div className="toast-alert">
            ✨ {toastMessage}
          </div>
        )}
      </div>
    );
  };

  const SingleReelItem = ({
    video,
    idx,
    isActive,
    muted,
    onToggleMute,
    onOpenComments,
    onToast,
    getItemProps,
  }: any) => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playIndicator, setPlayIndicator] = useState<'play' | 'pause' | null>(null);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(() => Math.floor((video.id % 400) + 1240));
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const file = video.video_files.find((f: any) => f.quality === 'hd') || video.video_files[0];
  const handle = `@${video.user.name.replace(/\s+/g, '').toLowerCase()}`;

  // Synchronize Play/Pause when item active status changes
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  // Click on video to toggle Play / Pause
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setPlayIndicator('play');
      } else {
        videoRef.current.pause();
        setPlayIndicator('pause');
      }
      setTimeout(() => setPlayIndicator(null), 600);
    }
  };

  // Double click on video to trigger heart animation & like
  const handleVideoDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = { id: Date.now(), x, y };
    setFloatingHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 800);

    if (!liked) {
      setLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  const handleToggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikesCount(prev => prev + 1);
      onToast('Added to Liked Videos!');
    }
  };

  const handleToggleSave = () => {
    setSaved(!saved);
    onToast(saved ? 'Removed from saved' : 'Saved to Bookmarks!');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(file?.link || window.location.href);
      onToast('Video link copied to clipboard!');
    }
  };

  const handleToggleFollow = () => {
    setFollowing(!following);
    onToast(following ? `Unfollowed ${handle}` : `Now following ${handle}`);
  };

  return (
    <div 
      className="reel-item" 
      {...getItemProps(idx)}
      onClick={handleVideoClick}
      onDoubleClick={handleVideoDoubleClick}
    >
      <video
        ref={videoRef}
        src={file?.link}
        poster={video.image}
        autoPlay={isActive}
        loop
        muted={muted}
        playsInline
        preload={isActive ? "auto" : "metadata"}
        className="reel-video"
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Floating Play/Pause Indicator Animation */}
      {playIndicator && (
        <div className="play-pause-indicator">
          {playIndicator === 'play' ? '▶' : '❚❚'}
        </div>
      )}

      {/* Double Tap Floating Hearts */}
      {floatingHearts.map(h => (
        <div 
          key={h.id} 
          className="floating-heart" 
          style={{ left: `${h.x}px`, top: `${h.y}px` }}
        >
          💖
        </div>
      ))}

      {/* Glowing Video Progress Bar */}
      <div className="reel-progress-container">
        <div className="reel-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Overlay & Content */}
      <div className="reel-overlay">
        {/* Author & Video Metadata */}
        <div className="reel-info">
          <div className="reel-author">
            <div className="reel-avatar">
              {video.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="reel-author-details">
              <span className="reel-author-name">{handle}</span>
            </div>
            <button 
              className={`reel-follow-btn ${following ? 'following' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFollow();
              }}
            >
              {following ? '✓ Following' : '+ Follow'}
            </button>
          </div>

          <div className="reel-desc">
            🎬 {video.width}×{video.height} HD • High-res cinematography feed
          </div>

          <div className="reel-tags">
            <span className="reel-tag-badge">#hd</span>
            <span className="reel-tag-badge">#cinema</span>
            <span className="reel-tag-badge">#aether</span>
          </div>

          {/* Rotating Music Vinyl Disc */}
          <div className="reel-music-row">
            <div className="music-disc">🎵</div>
            <span>Original Audio - {video.user.name}</span>
          </div>
        </div>

        {/* Right Side Action Column */}
        <div className="reel-actions">
          {/* Mute Button */}
          <div className="action-item">
            <button 
              className="reel-action-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onToggleMute();
              }} 
              title={muted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
            <span className="action-count">{muted ? 'Muted' : 'Live'}</span>
          </div>

          {/* Like Button */}
          <div className="action-item">
            <button 
              className={`reel-action-btn ${liked ? 'active-pink' : ''}`} 
              onClick={(e) => {
                e.stopPropagation();
                handleToggleLike();
              }} 
              title="Like video"
            >
              {liked ? '❤️' : '🤍'}
            </button>
            <span className="action-count">{(likesCount / 1000).toFixed(1)}k</span>
          </div>

          {/* Comments Button */}
          <div className="action-item">
            <button 
              className="reel-action-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onOpenComments();
              }} 
              title="View comments"
            >
              💬
            </button>
            <span className="action-count">{Math.floor((video.id % 120) + 42)}</span>
          </div>

          {/* Bookmark / Save Button */}
          <div className="action-item">
            <button 
              className={`reel-action-btn ${saved ? 'active-cyan' : ''}`} 
              onClick={(e) => {
                e.stopPropagation();
                handleToggleSave();
              }} 
              title="Bookmark video"
            >
              {saved ? '🔖' : '🏷️'}
            </button>
            <span className="action-count">{saved ? 'Saved' : 'Save'}</span>
          </div>

          {/* Share Button */}
          <div className="action-item">
            <button 
              className="reel-action-btn" 
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }} 
              title="Share video"
            >
              ↗️
            </button>
            <span className="action-count">Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Interactive Comments Drawer Component ---

const ReelCommentsDrawer = ({ onClose }: { onClose: () => void }) => {
  const [comments, setComments] = useState([
    { id: 1, user: 'Elena V.', text: 'Stunning cinematography! Love the lighting ✨', time: '2m ago' },
    { id: 2, user: 'Marcus_Dev', text: 'Super smooth playback. What camera was used here?', time: '14m ago' },
    { id: 3, user: 'AuraDesign', text: 'This looks straight out of a movie trailer 🍿', time: '1h ago' },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [
      { id: Date.now(), user: 'You', text: newComment.trim(), time: 'Just now' },
      ...prev,
    ]);
    setNewComment('');
  };

  return (
    <div className="comments-drawer-backdrop" onClick={onClose}>
      <div className="comments-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="comments-header">
          <span className="comments-title">Comments ({comments.length + 42})</span>
          <button className="comments-close" onClick={onClose}>✕</button>
        </div>

        <div className="comments-list">
          {comments.map(c => (
            <div key={c.id} className="comment-item">
              <div className="comment-avatar">{c.user.charAt(0)}</div>
              <div className="comment-content">
                <span className="comment-user">{c.user}</span>
                <span className="comment-text">{c.text}</span>
                <span className="comment-time">{c.time}</span>
              </div>
            </div>
          ))}
        </div>

        <form className="comments-input-row" onSubmit={handleAddComment}>
          <input 
            type="text" 
            className="comment-input" 
            placeholder="Add a comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="comment-send-btn">Post</button>
        </form>
      </div>
    </div>
  );
};

// --- Interactive Lightbox Modal Component ---

const PhotoLightbox = ({ photos, isOpen, initialIndex, onClose, likedPhotos, onToggleLike }: any) => {
  const {
    currentIndex,
    getBackdropProps,
    getContainerProps,
    getNextButtonProps,
    getPrevButtonProps,
    getCloseButtonProps
  } = useLightbox({
    isOpen,
    onClose,
    totalItems: photos.length,
    initialIndex
  });

  if (!isOpen || !photos[currentIndex]) return null;

  const currentPhoto = photos[currentIndex];
  const isLiked = likedPhotos[currentPhoto.id];

  return (
    <div className="lightbox-backdrop" {...getBackdropProps()}>
      <div className="lightbox-container" {...getContainerProps()}>
        {/* Main Image Display */}
        <div className="lightbox-main">
          <button className="lightbox-close-btn" {...getCloseButtonProps()}>✕</button>
          <button className="lightbox-nav-btn prev" {...getPrevButtonProps()}>‹</button>
          
          <img 
            src={currentPhoto.src.large2x || currentPhoto.src.large} 
            alt={currentPhoto.alt || currentPhoto.photographer} 
            className="lightbox-image" 
          />

          <button className="lightbox-nav-btn next" {...getNextButtonProps()}>›</button>
        </div>

        {/* Sidebar Info & Controls */}
        <div className="lightbox-sidebar">
          <div className="lightbox-info-group">
            <h3 className="lightbox-title">
              {currentPhoto.alt || 'High-Resolution Photograph'}
            </h3>

            <div className="lightbox-meta-row">
              <div className="photographer-avatar">
                {currentPhoto.photographer.charAt(0)}
              </div>
              <div className="meta-details">
                <span className="photographer-title">{currentPhoto.photographer}</span>
                <a 
                  href={currentPhoto.photographer_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="photographer-link"
                >
                  View Pexels Profile ↗
                </a>
              </div>
            </div>

            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div><strong>Resolution:</strong> {currentPhoto.width} × {currentPhoto.height} px</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <strong>Color Accent:</strong>
                <span 
                  style={{ 
                    display: 'inline-block', 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    backgroundColor: currentPhoto.avg_color || '#3b82f6',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }} 
                />
                <code>{currentPhoto.avg_color}</code>
              </div>
            </div>
          </div>

          <div className="lightbox-actions">
            <button 
              className="download-btn" 
              onClick={(e) => onToggleLike(currentPhoto.id, e)}
              style={{ background: isLiked ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : undefined }}
            >
              {isLiked ? '❤️ Liked Photo' : '🤍 Add to Favorites'}
            </button>

            <a 
              href={currentPhoto.src.original} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="download-btn"
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
            >
              ⬇ Download Original ({currentPhoto.width}px)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
