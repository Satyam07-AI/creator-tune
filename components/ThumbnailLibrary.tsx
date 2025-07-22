
import React, { useState, useMemo, useCallback } from 'react';
import { ArrowDownTrayIcon, LockClosedIcon, TagIcon, SparklesIcon, XIcon, EyeIcon, SearchIcon, ChevronUpDownIcon, PlusIcon } from './icons';

// --- TYPE DEFINITIONS ---
type Niche = 'Gaming' | 'Tech' | 'Beauty' | 'Vlog' | 'Finance' | 'Tutorial' | 'Motivation';
type ThumbnailType = 'All' | 'Free' | 'Premium';
type SortBy = 'newest' | 'popular';

interface Thumbnail {
  id: number;
  imageUrl: string;
  title: string;
  niche: Niche;
  type: 'Free' | 'Premium';
  caption: string;
  popularity: number; // For sorting
  dateAdded: string; // For sorting
}

// --- MOCK DATA ---
const initialThumbnails: Thumbnail[] = [
  { id: 1, imageUrl: 'https://placehold.co/1280x720/7c3aed/white?text=EPIC+WIN!', title: 'Epic Gaming Win', niche: 'Gaming', type: 'Free', caption: 'High-energy, great for highlights.', popularity: 85, dateAdded: '2023-10-25' },
  { id: 2, imageUrl: 'https://placehold.co/1280x720/1d4ed8/white?text=New+iPhone+Review', title: 'New iPhone 15 Pro Review', niche: 'Tech', type: 'Premium', caption: 'Clean, professional unboxing style.', popularity: 95, dateAdded: '2023-10-26' },
  { id: 3, imageUrl: 'https://placehold.co/1280x720/db2777/white?text=Makeup+Tutorial', title: 'Smokey Eye Makeup Tutorial', niche: 'Beauty', type: 'Free', caption: 'Bright and clear for beauty content.', popularity: 70, dateAdded: '2023-10-24' },
  { id: 4, imageUrl: 'https://placehold.co/1280x720/f59e0b/black?text=My+Daily+Vlog', title: 'A Day in My Life: NYC', niche: 'Vlog', type: 'Free', caption: 'Perfect for lifestyle and vlogging.', popularity: 65, dateAdded: '2023-10-20' },
  { id: 5, imageUrl: 'https://placehold.co/1280x720/166534/white?text=Stock+Market+101', title: 'Beginner\'s Guide to the Stock Market', niche: 'Finance', type: 'Premium', caption: 'Trustworthy design for finance topics.', popularity: 92, dateAdded: '2023-10-22' },
  { id: 6, imageUrl: 'https://placehold.co/1280x720/0891b2/white?text=How+To+Code', title: 'Learn React in 30 Minutes', niche: 'Tutorial', type: 'Free', caption: 'Clear layout for educational content.', popularity: 88, dateAdded: '2023-10-21' },
  { id: 7, imageUrl: 'https://placehold.co/1280x720/be185d/white?text=Unlock+Your+Potential', title: '5 Mindsets for Success', niche: 'Motivation', type: 'Premium', caption: 'Inspirational and bold design.', popularity: 98, dateAdded: '2023-10-27' },
  { id: 8, imageUrl: 'https://placehold.co/1280x720/7c3aed/white?text=BOSS+FIGHT', title: 'Insane Final Boss Fight', niche: 'Gaming', type: 'Premium', caption: 'Dynamic and action-packed.', popularity: 91, dateAdded: '2023-10-19' },
  { id: 9, imageUrl: 'https://placehold.co/1280x720/1d4ed8/white?text=PC+Build+Guide', title: 'The Ultimate $1000 PC Build', niche: 'Tech', type: 'Free', caption: 'Great for step-by-step guides.', popularity: 82, dateAdded: '2023-10-18' },
  { id: 10, imageUrl: 'https://placehold.co/1280x720/db2777/white?text=Skincare+Routine', title: 'My Morning Skincare Routine', niche: 'Beauty', type: 'Premium', caption: 'Elegant and soft for beauty.', popularity: 78, dateAdded: '2023-10-17' },
  { id: 11, imageUrl: 'https://placehold.co/1280x720/166534/white?text=INVESTING+TIPS', title: 'Top 5 Investing Mistakes to Avoid', niche: 'Finance', type: 'Free', caption: 'Bold text to grab attention.', popularity: 89, dateAdded: '2023-10-16' },
  { id: 12, imageUrl: 'https://placehold.co/1280x720/be185d/white?text=THE+SECRET+TO+PRODUCTIVITY', title: 'The Secret to Productivity', niche: 'Motivation', type: 'Free', caption: 'Minimalist and impactful.', popularity: 93, dateAdded: '2023-10-23' },
  { id: 13, imageUrl: 'https://placehold.co/1280x720/f59e0b/black?text=Travel+Diary%3A+Japan', title: 'My Trip to Japan', niche: 'Vlog', type: 'Premium', caption: 'Cinematic look for travel stories.', popularity: 85, dateAdded: '2023-10-15' },
  { id: 14, imageUrl: 'https://placehold.co/1280x720/0891b2/white?text=Learn+Photoshop', title: 'Photoshop for Complete Beginners', niche: 'Tutorial', type: 'Premium', caption: 'Professional tutorial design.', popularity: 90, dateAdded: '2023-10-14' },
  { id: 15, imageUrl: 'https://placehold.co/1280x720/7c3aed/white?text=Fortnite+Chapter+5', title: 'Fortnite Chapter 5 First Look', niche: 'Gaming', type: 'Free', caption: 'Trendy design for new updates.', popularity: 80, dateAdded: '2023-10-13' },
];

const niches: Niche[] = ['Gaming', 'Tech', 'Beauty', 'Vlog', 'Finance', 'Tutorial', 'Motivation'];
const thumbnailTypes: Thumbnail['type'][] = ['Free', 'Premium'];

// --- MODAL COMPONENTS ---

const PremiumModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in-up" style={{animationDuration: '0.3s'}}>
        <div className="relative bg-gray-800 border border-purple-500 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <XIcon className="w-6 h-6" />
            </button>
            <div className="text-center">
                <LockClosedIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white">Upgrade to Download</h3>
                <p className="text-gray-400 mt-2">This is a premium feature. Please log in or upgrade your plan to unlock high-resolution downloads.</p>
                <div className="mt-6 space-y-4">
                    <button onClick={() => alert("Redirecting to Login...")} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 ease-in-out">Login / Sign Up</button>
                </div>
            </div>
        </div>
    </div>
);

const PreviewModal = ({ thumb, onClose }: { thumb: Thumbnail; onClose: () => void; }) => (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in-up p-4" style={{animationDuration: '0.3s'}}>
        <div onClick={(e) => e.stopPropagation()} className="bg-gray-900 rounded-xl max-w-4xl w-full shadow-2xl border border-gray-700">
            <div className="p-4 bg-gray-800 rounded-t-xl">
                 <img loading="lazy" src={thumb.imageUrl} alt={thumb.title} className="w-full h-auto aspect-video object-cover rounded-lg" onContextMenu={(e) => e.preventDefault()}/>
            </div>
            <div className="p-4">
                <h3 className="text-xl font-bold text-white">{thumb.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold">CT</div>
                    <div>
                        <p className="font-semibold text-white">Your Channel Name</p>
                        <p className="text-sm text-gray-400">1.2M subscribers</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const DownloadModal = ({ thumb, isLoggedIn, onClose, onUpgradeClick }: { thumb: Thumbnail, isLoggedIn: boolean, onClose: () => void, onUpgradeClick: () => void }) => {
    const handleDownload = (url: string) => {
        const link = document.createElement('a');
        link.href = url.replace('1280x720', '1920x1080'); // Mock higher res
        link.download = `${thumb.title.replace(/\s+/g, '-')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resolutions = [
        { label: 'HD (1280x720)', size: '≈ 200 KB', locked: false, isPremium: false },
        { label: 'Full HD (1920x1080)', size: '≈ 500 KB', locked: !isLoggedIn, isPremium: false },
        { label: '4K (3840x2160)', size: '≈ 1.5 MB', locked: !isLoggedIn || thumb.type !== 'Premium', isPremium: true },
    ];
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in-up p-4" style={{animationDuration: '0.3s'}}>
            <div className="relative bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <XIcon className="w-6 h-6" />
                </button>
                <img loading="lazy" src={thumb.imageUrl} alt={thumb.title} className="w-full h-auto aspect-video object-cover rounded-lg mb-4" onContextMenu={(e) => e.preventDefault()} />
                <h3 className="text-2xl font-bold text-white mb-4">Download Options</h3>
                <div className="space-y-3">
                    {resolutions.map(res => (
                        <button
                            key={res.label}
                            onClick={res.locked ? onUpgradeClick : () => handleDownload(thumb.imageUrl)}
                            disabled={res.locked && thumb.type === 'Free' && res.isPremium} // special case
                            className="w-full flex justify-between items-center p-4 rounded-lg bg-gray-900/50 hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="text-left">
                                <p className="font-semibold text-white">{res.label}</p>
                                <p className="text-sm text-gray-400">{res.size}</p>
                            </div>
                            {res.locked ? <LockClosedIcon className="w-6 h-6 text-gray-500" /> : <ArrowDownTrayIcon className="w-6 h-6 text-purple-400" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
};

// --- THUMBNAIL CARD ---
const ThumbnailCard = ({ thumb, onPreview, onDownload }: { thumb: Thumbnail, onPreview: (t: Thumbnail) => void, onDownload: (t: Thumbnail) => void }) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-white/10 shadow-lg transition-transform duration-300 hover:-translate-y-2">
            <img loading="lazy" src={thumb.imageUrl} alt={thumb.title} className="w-full h-auto aspect-video object-cover" onContextMenu={(e) => e.preventDefault()}/>
            
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <TagIcon className="w-3 h-3 text-white/70" /> {thumb.niche}
            </div>

            {thumb.type === 'Premium' && <div className="absolute top-3 left-3 bg-purple-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><LockClosedIcon className="w-3 h-3" /> PREMIUM</div>}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
            
            <div className="absolute bottom-0 left-0 p-4 w-full flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-bold text-white text-shadow-lg">{thumb.title}</h3>
                <p className="text-sm text-white/80 text-shadow-lg max-w-xs mb-3">{thumb.caption}</p>
                <div className="flex gap-2">
                    <button onClick={() => onPreview(thumb)} className="flex-1 flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md rounded-lg py-2 text-white font-semibold hover:bg-white/30 transition-colors">
                        <EyeIcon className="w-5 h-5"/> Preview
                    </button>
                    <button onClick={() => onDownload(thumb)} className="flex-1 flex items-center justify-center gap-2 bg-purple-600 backdrop-blur-md rounded-lg py-2 text-white font-semibold hover:bg-purple-700 transition-colors">
                        <ArrowDownTrayIcon className="w-5 h-5"/> Download
                    </button>
                </div>
            </div>
        </div>
    );
}

const AddThumbnailModal = ({ isOpen, onClose, onAddThumbnail }: {
    isOpen: boolean;
    onClose: () => void;
    onAddThumbnail: (newThumbnail: Omit<Thumbnail, 'id' | 'popularity' | 'dateAdded'>) => void;
}) => {
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [niche, setNiche] = useState<Niche>('Gaming');
    const [type, setType] = useState<Thumbnail['type']>('Free');
    const [caption, setCaption] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !imageUrl || !caption) {
            alert("Please fill out all fields.");
            return;
        }
        onAddThumbnail({ title, imageUrl, niche, type, caption });
        onClose();
        // Reset form
        setTitle(''); setImageUrl(''); setNiche('Gaming'); setType('Free'); setCaption('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in-up p-4" style={{animationDuration: '0.3s'}}>
            <div className="relative bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl max-w-lg w-full mx-4">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <XIcon className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-bold text-white mb-6">Add New Thumbnail</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-white/90 mb-1">Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Epic Gaming Moments" className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"/>
                    </div>
                     <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-white/90 mb-1">Image URL</label>
                        <input type="text" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://placehold.co/1280x720/..." className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"/>
                    </div>
                     <div>
                        <label htmlFor="caption" className="block text-sm font-medium text-white/90 mb-1">Caption</label>
                        <input type="text" id="caption" value={caption} onChange={e => setCaption(e.target.value)} placeholder="A short, catchy caption" className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"/>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="niche" className="block text-sm font-medium text-white/90 mb-1">Niche</label>
                            <select id="niche" value={niche} onChange={e => setNiche(e.target.value as Niche)} className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                                {niches.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="type" className="block text-sm font-medium text-white/90 mb-1">Type</label>
                            <select id="type" value={type} onChange={e => setType(e.target.value as Thumbnail['type'])} className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                                {thumbnailTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition">Cancel</button>
                        <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition">Save Thumbnail</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
const ThumbnailLibrary = ({ t }: { t: (key: string) => string }) => {
    // --- STATE MANAGEMENT ---
    const [thumbnails, setThumbnails] = useState<Thumbnail[]>(initialThumbnails);
    const [typeFilter, setTypeFilter] = useState<ThumbnailType>('All');
    const [nicheFilter, setNicheFilter] = useState<Niche | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortBy>('popular');
    
    // For access control simulation
    const [isLoggedIn] = useState(false);
    
    // Modal states
    const [selectedThumbnail, setSelectedThumbnail] = useState<Thumbnail | null>(null);
    const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
    const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
    const [isPremiumModalOpen, setPremiumModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);

    // --- FILTERING & SORTING LOGIC ---
    const filteredThumbnails = useMemo(() => {
        let items = thumbnails
            .filter(thumb => typeFilter === 'All' || thumb.type === typeFilter)
            .filter(thumb => nicheFilter === 'All' || thumb.niche === nicheFilter)
            .filter(thumb => 
                searchTerm === '' || 
                thumb.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                thumb.niche.toLowerCase().includes(searchTerm.toLowerCase()) ||
                thumb.caption.toLowerCase().includes(searchTerm.toLowerCase())
            );

        if (sortBy === 'newest') {
            items = items.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        } else { // 'popular'
            items = items.sort((a, b) => b.popularity - a.popularity);
        }

        return items;
    }, [typeFilter, nicheFilter, searchTerm, sortBy, thumbnails]);
    
    // --- MODAL HANDLERS ---
    const handlePreviewClick = useCallback((thumb: Thumbnail) => {
        setSelectedThumbnail(thumb);
        setPreviewModalOpen(true);
    }, []);

    const handleDownloadClick = useCallback((thumb: Thumbnail) => {
        setSelectedThumbnail(thumb);
        setDownloadModalOpen(true);
    }, []);
    
    const handleUpgradeClick = useCallback(() => {
        setDownloadModalOpen(false);
        setPremiumModalOpen(true);
    }, []);

    const handleAddThumbnail = (newThumbnailData: Omit<Thumbnail, 'id' | 'popularity' | 'dateAdded'>) => {
        const newThumbnail: Thumbnail = {
            ...newThumbnailData,
            id: Date.now(), // Simple unique ID
            popularity: 75, // Default popularity
            dateAdded: new Date().toISOString().split('T')[0], // Today's date
        };
        setThumbnails(prev => [newThumbnail, ...prev]);
    };

    const FilterButton = ({ label, active, onClick }: {label: string, active: boolean, onClick: () => void}) => (
        <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${active ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}>
            {label}
        </button>
    );

    return (
        <div className="w-full max-w-7xl mx-auto my-8 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-center text-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">
                Thumbnail Library
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto text-center">
                Download professionally designed, high-quality thumbnails to make your videos stand out.
            </p>

            {/* --- CONTROLS --- */}
            <div className="my-10 p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full md:flex-1">
                        <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"/>
                        <input 
                            type="text"
                            placeholder="Search by keyword, niche..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-full py-2.5 pl-11 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-48">
                             <ChevronUpDownIcon className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"/>
                             <select 
                                 value={sortBy} 
                                 onChange={(e) => setSortBy(e.target.value as SortBy)}
                                 className="w-full appearance-none bg-white/10 border border-white/20 rounded-full py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                             >
                                 <option value="popular">Sort by: Popular</option>
                                 <option value="newest">Sort by: Newest</option>
                             </select>
                        </div>
                        <button onClick={() => setAddModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-purple-600 text-white font-bold rounded-full px-4 py-2.5 transition-all duration-300 ease-in-out hover:bg-purple-700">
                             <PlusIcon className="w-5 h-5"/> Add
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-3 border-t border-white/10 pt-4 mt-4">
                    <FilterButton label="All" active={nicheFilter === 'All'} onClick={() => setNicheFilter('All')} />
                    {niches.map(niche => (
                        <FilterButton key={niche} label={niche} active={nicheFilter === niche} onClick={() => setNicheFilter(niche)} />
                    ))}
                     <div className="w-px h-6 bg-white/10 mx-2"></div>
                    <FilterButton label="Free" active={typeFilter === 'Free'} onClick={() => setTypeFilter('Free')} />
                    <FilterButton label="Premium" active={typeFilter === 'Premium'} onClick={() => setTypeFilter('Premium')} />
                </div>
            </div>

            {/* --- THUMBNAIL GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredThumbnails.map(thumb => (
                    <ThumbnailCard key={thumb.id} thumb={thumb} onPreview={handlePreviewClick} onDownload={handleDownloadClick} />
                ))}
            </div>
            
            {filteredThumbnails.length === 0 && (
                <div className="text-center py-16 text-gray-400 col-span-full">
                    <p className="text-xl font-semibold">No thumbnails found</p>
                    <p>Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            )}
            
            {/* --- MODALS --- */}
            {isPreviewModalOpen && selectedThumbnail && <PreviewModal thumb={selectedThumbnail} onClose={() => setPreviewModalOpen(false)} />}
            {isDownloadModalOpen && selectedThumbnail && <DownloadModal thumb={selectedThumbnail} isLoggedIn={isLoggedIn} onClose={() => setDownloadModalOpen(false)} onUpgradeClick={handleUpgradeClick} />}
            {isPremiumModalOpen && <PremiumModal onClose={() => setPremiumModalOpen(false)} />}
            <AddThumbnailModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAddThumbnail={handleAddThumbnail} />
        </div>
    );
};

export default ThumbnailLibrary;