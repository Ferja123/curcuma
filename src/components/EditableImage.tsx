import React, { useState, useRef, useEffect } from 'react';
import { Camera, Loader2, Trash2, ImagePlus } from 'lucide-react';

type EditableImageProps = React.ComponentProps<"img"> & {
  id: string;
  initialSrc: string;
  containerClassName?: string;
};

export default function EditableImage({ id, initialSrc, containerClassName = "", className = "", ...props }: EditableImageProps) {
  const [src, setSrc] = useState(initialSrc);
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data[`image_${id}`] !== undefined) {
          setSrc(data[`image_${id}`]);
        }
      })
      .catch(err => console.error("Error loading image data:", err));
  }, [id]);

  const handleImageClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Removed window.confirm as it's blocked in iframe
    setIsUploading(true);
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [`image_${id}`]: "" })
      });
      setSrc("");
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error('Upload failed');
        
        const { url } = await uploadRes.json();
        
        // Save to global data
        await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [`image_${id}`]: url })
        });

        setSrc(url);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div 
      className={`relative w-full h-full group cursor-pointer bg-gray-100 flex items-center justify-center ${containerClassName}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleImageClick}
    >
      {src ? (
        <img src={src} className={className} loading="lazy" decoding="async" {...props} />
      ) : (
        <div className="w-full h-full min-h-[150px] flex flex-col items-center justify-center text-gray-400">
          <ImagePlus className="w-12 h-12 mb-2" />
          <span className="text-sm font-medium">Click para agregar imagen</span>
        </div>
      )}
      
      {/* Overlay de edición visible solo al hacer hover */}
      <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity duration-300 ${isHovered || isUploading ? 'opacity-100' : 'opacity-0'}`}>
        {isUploading ? (
          <>
            <Loader2 className="w-12 h-12 text-white mb-2 animate-spin" />
            <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">
              Actualizando...
            </span>
          </>
        ) : (
          <>
            <Camera className="w-12 h-12 text-white mb-2" />
            <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">
              {src ? 'Clic para cambiar imagen' : 'Clic para agregar imagen'}
            </span>
          </>
        )}
      </div>

      {/* Delete Button */}
      {src && isHovered && !isUploading && (
        <button 
          onClick={handleDelete}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center gap-2 z-30 pointer-events-auto"
          title="Eliminar imagen"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="absolute w-0 h-0 opacity-0"
      />
    </div>
  );
}
