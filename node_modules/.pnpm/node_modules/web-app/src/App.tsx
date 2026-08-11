import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Grid } from 'react-window';
import { useSearch, useEvents, type Photo } from 'media-react';
import { useGrid, useLightbox } from 'media-ui-react';
import { ReelsView } from './ReelsView';
import './App.css';

const PRESET_TAGS = [
  'Nature', 'Cyberpunk', 'Architecture', 'Space',
  'Abstract', 'Ocean', 'Wildlife', 'Minimalist', 'Tokyo', 'Cozy'
];

const App = () => {
  const [query, setQuery] = useState('nature');
  const [page, setPage] = useState(1);
  const [perPage] = useState(30);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');

  const { search, loading, error, photosResult, videosResult } = useSearch();
  const { trackView, trackDownload } = useEvents();

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
    <div className={`app-container ${activeTab === 'videos' ? 'reels-active-container' : ''}`}>
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
                📸 Photos
              </button>
              <button
                className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
                onClick={() => setActiveTab('videos')}
              >
                🎬 Reels
              </button>
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
      <main className={`main-content ${activeTab === 'videos' ? 'reels-active' : ''}`}>
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
          <ReelsView
            videos={videos}
            hasMore={hasNextPage}
            isAppending={loading}
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
  photos: Photo[];
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
  photos: Photo[];
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





// --- Interactive Lightbox Modal Component ---

const PhotoLightbox = ({ photos, isOpen, initialIndex, onClose, likedPhotos, onToggleLike }: {
  photos: Photo[];
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
  likedPhotos: Record<number, boolean>;
  onToggleLike: (id: number, e: React.MouseEvent) => void;
}) => {
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

  const { trackDownload } = useEvents();

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
              onClick={() => trackDownload('image', currentPhoto.id)}
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
