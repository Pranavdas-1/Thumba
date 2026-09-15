'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = images[selectedIndex] || images[0];

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/5] rounded-3xl bg-ivory-100 flex items-center justify-center text-ink-400">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnail column */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 md:flex-col md:overflow-y-auto md:pb-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-ivory-100 transition-all duration-160 ${
                selectedIndex === idx
                  ? 'ring-2 ring-ink-900 ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${title} angle ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative aspect-[4/5] w-full flex-1 overflow-hidden bg-ivory-100">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          className="object-cover transition-transform duration-600 ease-out-cubic hover:scale-[1.025]"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
    </div>
  );
}
