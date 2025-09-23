import React, { useState, useEffect, useMemo } from "react";
import { SearchBar } from "./components/SearchBar";
import { WebsiteCard, Website } from "./components/WebsiteCard";
import { WebsiteModal } from "./components/WebsiteModal";
import { TagFilter } from "./components/TagFilter";
import { ParticleBackground } from "./components/ParticleBackground";
import { Zap, Github as GitHub } from "lucide-react";
import websitesData from "./data/websites.json";

function App() {
  const [websites] = useState<Website[]>(websitesData);
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>(websites);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          website.tags_list.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply tag filter (AND logic)
    if (selectedTags.length > 0) {
      filtered = filtered.filter((website) =>
        selectedTags.every((selectedTag) =>
          website.tags_list.some((tag) => tag === selectedTag)
        )
      );
    }

    setFilteredWebsites(filtered);
  }, [websites, searchQuery, selectedTags]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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
    <div className="min-h-screen bg-black text-white relative">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Main Content */}
      <div className="relative" style={{ zIndex: 5 }}>
        {/* Sticky Header */}
        <header
          className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50 py-4"
          style={{ position: "sticky", zIndex: 50 }}
        >
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3 min-w-0 flex-shrink">
                <Zap className="w-6 h-6 text-orange-400 flex-shrink-0" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 bg-clip-text text-transparent font-bungee truncate">
                  POWERFULWEBSITES.SPACE
                </h1>
              </div>
              <div className="flex-1 max-w-sm">
                <SearchBar onSearch={handleSearch} className="w-full" />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Discover powerful but lesser-known websites that can transform
              your workflow. Curated tools, resources, and platforms you
              probably haven't heard of yet.
            </p>

            <div className="text-sm text-gray-400 flex items-center justify-center space-x-2">
              <span>
                Showing {filteredWebsites.length} of {websites.length} powerful
                websites
              </span>
              {(searchQuery || selectedTags.length > 0) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTags([]);
                  }}
                  className="text-orange-400 hover:text-orange-300 ml-2"
                >
                  • Clear filters
                </button>
              )}
            </div>
          </div>
        </section>

        <main className="container mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Tag Filter */}
            <aside className="lg:col-span-1">
              <div className="sticky" style={{ top: "110px" }}>
                <TagFilter
                  selectedTags={selectedTags}
                  availableTags={allTags}
                  onTagToggle={handleTagToggle}
                  onClearAll={handleClearAllTags}
                />
              </div>
            </aside>

            {/* Main Content - Website Grid */}
            <section className="lg:col-span-3">
              {filteredWebsites.length > 0 ? (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  role="grid"
                  aria-label="Website cards"
                >
                  {filteredWebsites.map((website, index) => (
                    <WebsiteCard
                      key={`${website.name}-${index}`}
                      website={website}
                      onExpand={handleExpandWebsite}
                      onTagClick={handleTagClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="space-y-4">
                    <Zap className="w-16 h-16 text-gray-600 mx-auto" />
                    <h3 className="text-2xl font-bold text-gray-400">
                      No websites found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {searchQuery || selectedTags.length > 0
                        ? "Try adjusting your search query or removing some tag filters."
                        : "No websites are currently available."}
                    </p>
                    {(searchQuery || selectedTags.length > 0) && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedTags([]);
                        }}
                        className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 bg-gray-900/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2025 powerfulwebsites.space - A curated collection of powerful
                web tools
              </div>
              <div className="flex items-center space-x-6">
                <a
                  href="https://github.com/powerfulwebsites/powerfulwebsites.space"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-orange-400 transition-colors duration-200"
                >
                  <GitHub className="w-4 h-4" />
                  <span className="text-sm">Contribute on GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
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
