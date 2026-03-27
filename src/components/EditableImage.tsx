import React, { useState, useEffect } from 'react';

type EditableImageProps = React.ComponentProps<"img"> & {
  id: string;
  initialSrc: string;
  containerClassName?: string;
};

export default function EditableImage({ id, initialSrc, containerClassName = "", className = "", ...props }: EditableImageProps) {
  const [src, setSrc] = useState(initialSrc);

  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (data && data[`image_${id}`]) {
          setSrc(data[`image_${id}`]);
        }
      })
      .catch(() => {
        // Silently fallback to initialSrc when API is unavailable (e.g. static hosting)
      });
  }, [id]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${containerClassName}`}>
      {src ? (
        <img src={src} className={className} loading="lazy" decoding="async" {...props} />
      ) : (
        <div className="w-full h-full min-h-[150px] bg-gray-100 flex items-center justify-center text-gray-400">
          <span className="text-sm font-medium">Imagen no disponible</span>
        </div>
      )}
    </div>
  );
}
