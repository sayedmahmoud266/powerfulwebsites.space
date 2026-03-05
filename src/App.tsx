import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { SearchBar } from "./components/SearchBar";
import { WebsiteCard, Website } from "./components/WebsiteCard";
import { WebsiteModal } from "./components/WebsiteModal";
import { TagFilter } from "./components/TagFilter";
import {
  Zap,
  Github as GitHub,
  SlidersHorizontal,
  X,
  Search,
  Menu,
} from "lucide-react";
import websitesData from "./data/websites.json";

function App() {
  const [websites] = useState<Website[]>(websitesData);
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>(websites);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Measure grid container width → compute columns → pageSize = cols * 3
  const computePageSize = useCallback(() => {
    const el = gridContainerRef.current;
    if (!el) return;
    // p-5 = 20px padding on each side → subtract 40px to get actual grid width
    const gridWidth = el.clientWidth - 40;
    const cardMin = 280;
    const gap = 16; // gap-4 = 1rem = 16px
    const cols = Math.max(1, Math.floor((gridWidth + gap) / (cardMin + gap)));
    setPageSize(cols * 3);
  }, []);

  useEffect(() => {
    computePageSize();
    const observer = new ResizeObserver(computePageSize);
    if (gridContainerRef.current) observer.observe(gridContainerRef.current);
    return () => observer.disconnect();
  }, [computePageSize]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    websites.forEach((website) => {
      website.tags_list.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [websites]);

  // Filter websites based on search query and selected tags
  useEffect(() => {
    let filtered = websites;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (website) =>
          website.name.toLowerCase().includes(query) ||
          website.url.toLowerCase().includes(query) ||
          website.description.toLowerCase().includes(query) ||
          website.tags_list.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Apply tag filter (AND logic)
    if (selectedTags.length > 0) {
      filtered = filtered.filter((website) =>
        selectedTags.every((selectedTag) =>
          website.tags_list.some((tag) => tag === selectedTag),
        ),
      );
    }

    setFilteredWebsites(filtered);
    setCurrentPage(1);
  }, [websites, searchQuery, selectedTags]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
    setIsMobileSidebarOpen(false);
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  const handleExpandWebsite = (website: Website) => {
    setSelectedWebsite(website);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedWebsite(null), 300);
  };

  const handleModalTagClick = (tag: string) => {
    handleTagClick(tag);
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* ── MOBILE SEARCH OVERLAY ── */}
      {isMobileSearchOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex flex-col">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
            <SearchBar
              onSearch={(q) => {
                handleSearch(q);
                setIsMobileSearchOpen(false);
              }}
              className="flex-1"
              autoFocus
            />
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="shrink-0 z-50 bg-black border-b border-zinc-800">
        {/* ── MOBILE HEADER (below md) ── */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 relative">
          {/* Left: menu button */}
          <div className="relative">
            <button
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              className="flex items-center justify-center text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 p-2 rounded transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            {/* Dropdown menu */}
            {isMobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute left-0 top-full mt-2 z-20 bg-zinc-950 border border-zinc-800 rounded shadow-xl p-3 flex flex-col gap-2 min-w-max">
                  <a
                    href="https://buymeacoffee.com/sayedmahmoud266"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <img
                      src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black"
                      alt="Buy Me A Coffee"
                      className="h-7"
                    />
                  </a>
                  <a
                    href="https://github.com/sayedmahmoud266/powerfulwebsites.space"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <img
                      src="https://img.shields.io/github/stars/sayedmahmoud266/powerfulwebsites.space?style=for-the-badge&logo=github&logoColor=white&color=555555"
                      alt="GitHub stars"
                      className="h-7"
                    />
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Center: logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-white shrink-0" />
            <h1 className="text-base font-bold text-white font-bungee whitespace-nowrap">
              POWERFULWEBSITES.SPACE
            </h1>
          </div>

          {/* Right: search button */}
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="flex items-center justify-center text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 p-2 rounded transition-colors cursor-pointer"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* ── DESKTOP HEADER (md+) ── */}
        <div className="hidden md:flex items-center justify-between gap-4 px-6 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-3 min-w-0 shrink-0">
            <Zap className="w-5 h-5 text-white shrink-0" />
            <h1 className="text-xl lg:text-2xl font-bold text-white font-bungee truncate">
              POWERFULWEBSITES.SPACE
            </h1>
          </div>
          {/* Search */}
          <div className="flex-1 max-w-xl">
            <SearchBar onSearch={handleSearch} className="w-full" />
          </div>
          {/* Badges */}
          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="https://buymeacoffee.com/sayedmahmoud266"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black"
                alt="Buy Me A Coffee"
                className="h-7"
              />
            </a>
            <a
              href="https://github.com/sayedmahmoud266/powerfulwebsites.space"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src="https://img.shields.io/github/stars/sayedmahmoud266/powerfulwebsites.space?style=for-the-badge&logo=github&logoColor=white&color=555555"
                alt="GitHub stars"
                className="h-7"
              />
            </a>
          </div>
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar — hidden below md */}
        <aside className="hidden md:block w-56 shrink-0 overflow-y-auto border-r border-zinc-800 bg-zinc-950 scrollbar-hover">
          <TagFilter
            selectedTags={selectedTags}
            availableTags={allTags}
            onTagToggle={handleTagToggle}
            onClearAll={handleClearAllTags}
          />
        </aside>

        {/* Mobile sidebar drawer */}
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer */}
            <div className="md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Categories
                </span>
                <div className="flex items-center gap-3">
                  {selectedTags.length > 0 && (
                    <button
                      onClick={() => {
                        handleClearAllTags();
                      }}
                      className="text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close categories"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hover">
                <TagFilter
                  selectedTags={selectedTags}
                  availableTags={allTags}
                  onTagToggle={handleTagToggle}
                  onClearAll={handleClearAllTags}
                  hideHeader
                />
              </div>
            </div>
          </>
        )}

        {/* Main scrollable area */}
        <div className="flex-1 overflow-y-auto">
          {/* Sub-header strip */}
          <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-zinc-800/60 px-4 py-2.5 flex items-center justify-between gap-3">
            {/* Mobile filter button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-2.5 py-1.5 rounded transition-colors duration-150 cursor-pointer shrink-0"
              aria-label="Open categories"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>
                Categories
                {selectedTags.length > 0 ? ` (${selectedTags.length})` : ""}
              </span>
            </button>
            <p className="hidden md:block text-xs text-zinc-500 truncate">
              Discover powerful but lesser-known websites that can transform
              your workflow.
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-500 shrink-0 ml-auto">
              <span>
                {filteredWebsites.length} of {websites.length} sites
              </span>
              {filteredWebsites.length > pageSize && (
                <span className="text-zinc-600">
                  page {currentPage}/
                  {Math.ceil(filteredWebsites.length / pageSize)}
                </span>
              )}
              {(searchQuery || selectedTags.length > 0) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTags([]);
                  }}
                  className="text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Cards */}
          <main className="p-5" ref={gridContainerRef}>
            {filteredWebsites.length > 0 ? (
              <>
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 350px))",
                  }}
                  role="grid"
                  aria-label="Website cards"
                >
                  {filteredWebsites
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((website, index) => (
                      <WebsiteCard
                        key={`${website.name}-${index}`}
                        website={website}
                        onExpand={handleExpandWebsite}
                        onTagClick={handleTagClick}
                      />
                    ))}
                </div>

                {/* Pagination */}
                {filteredWebsites.length > pageSize && (
                  <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
                    <button
                      onClick={() => {
                        setCurrentPage(1);
                        gridContainerRef.current
                          ?.closest(".overflow-y-auto")
                          ?.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={currentPage === 1}
                      className="px-2.5 py-1.5 text-xs border border-zinc-700 rounded text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label="First page"
                    >
                      «
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage((p) => p - 1);
                        gridContainerRef.current
                          ?.closest(".overflow-y-auto")
                          ?.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={currentPage === 1}
                      className="px-2.5 py-1.5 text-xs border border-zinc-700 rounded text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label="Previous page"
                    >
                      ‹
                    </button>

                    {/* Page number buttons */}
                    {(() => {
                      const totalPages = Math.ceil(
                        filteredWebsites.length / pageSize,
                      );
                      const delta = 2;
                      const pages: (number | "...")[] = [];
                      for (let i = 1; i <= totalPages; i++) {
                        if (
                          i === 1 ||
                          i === totalPages ||
                          (i >= currentPage - delta && i <= currentPage + delta)
                        ) {
                          pages.push(i);
                        } else if (pages[pages.length - 1] !== "...") {
                          pages.push("...");
                        }
                      }
                      return pages.map((p, i) =>
                        p === "..." ? (
                          <span
                            key={`ellipsis-${i}`}
                            className="px-1.5 text-xs text-zinc-600"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => {
                              setCurrentPage(p as number);
                              gridContainerRef.current
                                ?.closest(".overflow-y-auto")
                                ?.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`min-w-[30px] px-2.5 py-1.5 text-xs border rounded transition-colors cursor-pointer ${
                              p === currentPage
                                ? "bg-white text-black border-white font-medium"
                                : "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                            }`}
                            aria-current={
                              p === currentPage ? "page" : undefined
                            }
                          >
                            {p}
                          </button>
                        ),
                      );
                    })()}

                    <button
                      onClick={() => {
                        setCurrentPage((p) => p + 1);
                        gridContainerRef.current
                          ?.closest(".overflow-y-auto")
                          ?.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={
                        currentPage ===
                        Math.ceil(filteredWebsites.length / pageSize)
                      }
                      className="px-2.5 py-1.5 text-xs border border-zinc-700 rounded text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label="Next page"
                    >
                      ›
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage(
                          Math.ceil(filteredWebsites.length / pageSize),
                        );
                        gridContainerRef.current
                          ?.closest(".overflow-y-auto")
                          ?.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={
                        currentPage ===
                        Math.ceil(filteredWebsites.length / pageSize)
                      }
                      className="px-2.5 py-1.5 text-xs border border-zinc-700 rounded text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label="Last page"
                    >
                      »
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Zap className="w-14 h-14 text-zinc-700" />
                <h3 className="text-xl font-bold text-zinc-500">
                  No websites found
                </h3>
                <p className="text-zinc-600 text-sm max-w-sm text-center">
                  {searchQuery || selectedTags.length > 0
                    ? "Try adjusting your search or removing tag filters."
                    : "No websites are currently available."}
                </p>
                {(searchQuery || selectedTags.length > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTags([]);
                    }}
                    className="text-zinc-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-zinc-800 px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-zinc-500 text-xs">
                © 2025 powerfulwebsites.space — A curated collection of powerful
                web tools
              </div>
              <div className="flex items-center gap-5">
                <div className="text-zinc-500 text-xs">
                  Made with ❤️ by{" "}
                  <a
                    href="https://sayedmahmoud266.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-300 hover:text-white transition-colors duration-200"
                  >
                    sayedmahmoud266
                  </a>
                </div>
                <a
                  href="https://github.com/sayedmahmoud266/powerfulwebsites.space"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-xs transition-colors duration-200"
                >
                  <GitHub className="w-3.5 h-3.5" />
                  <span>Contribute on GitHub</span>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Modal */}
      {selectedWebsite && (
        <WebsiteModal
          website={selectedWebsite}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onTagClick={handleModalTagClick}
        />
      )}
    </div>
  );
}

export default App;
