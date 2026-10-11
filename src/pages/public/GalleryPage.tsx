import React, { useState } from 'react';
import { useBrand } from '../../context/BrandContext';
import { Lightbox } from '../../components/common/Lightbox';
import { Camera } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'halls' | 'banquets' | 'stages'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const images = [
    { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80', cat: 'halls', title: 'The Mughal Shahi Grand Ballroom Chandelier Canopy' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80', cat: 'halls', title: 'The Crystal Glasshouse Marquee & Italian Fountains' },
    { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80', cat: 'stages', title: 'Shahi Barat Floral Stage with Deep Red Roses & Candelabras' },
    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', cat: 'stages', title: 'Walima Pastel Floral Backdrop & Royal Velvet Sofa' },
    { url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80', cat: 'banquets', title: 'Live Charcoal BBQ, Shinwari Sajji & Degi Biryani Hot Station' },
    { url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80', cat: 'banquets', title: 'Royal Shahi Dastarkhwan Cutlery, Bone China & Brass Thalis' },
    { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80', cat: 'halls', title: 'Royal Jasmine Open-Air Lawn with Fairy Lights for Mehendi' },
    { url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80', cat: 'stages', title: 'Genda Phool & Motia Fragrant Walkway Tunnel for Baraat Entry' },
  ];

  const filtered = filter === 'all' ? images : images.filter((img) => img.cat === filter);

  return (
    <div className="pt-28 pb-20 space-y-12 champagne-gradient-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#FAF8F5] text-xs font-semibold text-[#997A15]">
          <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Real Celebrations Portfolio</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1C1917]">
          Moments of Shahi Pakistani Weddings
        </h1>
        <p className="text-sm text-[#78716C] max-w-xl mx-auto font-light">
          Explore real photographs from grand Barat processions, elegant Walima receptions, and festive Mehendi nights.
        </p>

        {/* Filter Tabs */}
        <div className="flex justify-center pt-4">
          <div className="inline-flex p-1 rounded-full bg-white border border-stone-200 shadow-sm gap-1">
            {[
              { id: 'all', label: 'All Photographs' },
              { id: 'halls', label: 'Ballrooms & Lawns' },
              { id: 'stages', label: 'Stage & Décor' },
              { id: 'banquets', label: 'Culinary Banquets' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  filter === f.id
                    ? 'gold-gradient-bg text-white shadow-sm'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
              className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md bg-stone-100 border border-stone-200"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                  {item.cat}
                </span>
                <h4 className="text-sm font-semibold text-white mt-1">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        images={filtered.map((f) => f.url)}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((p) => (p > 0 ? p - 1 : filtered.length - 1))}
        onNext={() => setLightboxIndex((p) => (p < filtered.length - 1 ? p + 1 : 0))}
        caption={filtered[lightboxIndex]?.title}
      />
    </div>
  );
};
