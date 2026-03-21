import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { products } from '../data/products';
import ProductCardTechForward from '../components/ProductCardTechForward';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const ProductsPageTechForward: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'concentrate', name: 'Concentrates' },
    { id: 'flavored', name: 'Flavored' },
    { id: 'tea', name: 'Tea' },
    { id: 'cold-brew', name: 'Cold Brew' },
  ];

  const filteredProducts = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchLower) ||
                           product.description.toLowerCase().includes(searchLower);
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [filteredProducts, sortBy]);

  return (
    <div className="min-h-screen bg-background pb-16">
      <SEO 
        title="Shop Nitrogen-Preserved Coffee | Cafe at Once Collection"
        description="Shop Cafe at Once nitrogen-preserved Arabica coffee press tubes. Americano, Latte, and Mocha variants. Real coffee in 5 seconds — no machine required."
        url="https://cafeatonce.com/products"
        breadcrumbs={[
          { name: "Home", url: "https://cafeatonce.com" },
          { name: "Shop", url: "https://cafeatonce.com/products" }
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Shop <span className="text-primary">Cafe at Once</span>
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl">
            Nitrogen-preserved brewed Arabica coffee in portable press tubes. Americano, Latte, and Mocha — 
            ready in 5 seconds. <Link to="/faq" className="text-primary hover:underline">See how it works</Link>
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                data-testid="search-input"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 h-12 px-6 bg-primary text-white font-medium rounded-lg"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
                className="h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                data-testid="sort-select"
              >
                <option value="name">Name</option>
                <option value="price">Price: Low to High</option>
                <option value="rating">Rating: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filters - Always visible on desktop, toggle on mobile */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block mt-4 pt-4 border-t border-border`}>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const productCount = category.id === 'all'
                  ? products.length
                  : products.filter(p => p.category === category.id).length;

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
                    }`}
                    data-testid={`category-${category.id}`}
                  >
                    {category.name} ({productCount})
                  </button>
                );
              })}
            </div>

            {/* Mobile Sort */}
            <div className="lg:hidden mt-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-foreground/70">
            Showing <span className="font-bold text-foreground">{sortedProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground/60 text-lg mb-4">No products found</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {sortedProducts.map((product) => (
              <ProductCardTechForward key={product.id} {...product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductsPageTechForward;
