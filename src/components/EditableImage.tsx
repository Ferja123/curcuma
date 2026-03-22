import React, { useState, useEffect } from 'react';
import { Upload, Save, Loader2 } from 'lucide-react';

type EditableImageProps = React.ComponentProps<"img"> & {
  id: string;
  initialSrc: string;
  containerClassName?: string;
};

export default function EditableImage({ id, initialSrc, containerClassName = "", className = "", ...props }: EditableImageProps) {
  const [src, setSrc] = useState(initialSrc);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch persisted image on mount or when id changes
  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (data[id]) {
          setSrc(data[id]);
        } else {
          setSrc(initialSrc);
        }
      })
      .catch(err => {
        console.warn('Could not fetch persisted image:', err);
        setSrc(initialSrc);
      });
  }, [id, initialSrc]);

  // Update state if initialSrc changes and we don't have a persisted image
  useEffect(() => {
    setPendingFile(null);
  }, [initialSrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSrc(url);
      setPendingFile(file);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!pendingFile) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', pendingFile);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      if (data.url) {
        setSrc(data.url);
        setPendingFile(null);
        
        // Save to data.json
        try {
          await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [id]: data.url })
          });
        } catch (e) {
          console.warn('Failed to persist image data:', e);
        }
        
        alert('¡Imagen guardada permanentemente!');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Hubo un error al guardar la imagen. Por favor, inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative group/edit w-full h-full ${containerClassName}`}>
      <img src={src} className={className} loading="lazy" decoding="async" {...props} />
      <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/edit:opacity-100 transition-opacity cursor-pointer z-20">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg transform hover:scale-105 transition-transform">
            <Upload className="w-4 h-4" />
            Cambiar foto
          </div>
          {pendingFile && (
            <button 
              onClick={handleSave}
              disabled={isUploading}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-sm flex items-center gap-2 transition-transform hover:scale-105 shadow-lg disabled:opacity-70"
              title="Guardar imagen"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isUploading ? 'Guardando...' : 'Guardar'}
            </button>
          )}
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
}
