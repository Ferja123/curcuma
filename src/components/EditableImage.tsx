import React from 'react';

type EditableImageProps = React.ComponentProps<"img"> & {
  id: string;
  initialSrc: string;
  containerClassName?: string;
};

export default function EditableImage({ id, initialSrc, containerClassName = "", className = "", ...props }: EditableImageProps) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${containerClassName}`}>
      {initialSrc ? (
        <img src={initialSrc} className={className} loading="lazy" decoding="async" {...props} />
      ) : (
        <div className="w-full h-full min-h-[150px] bg-gray-100 flex items-center justify-center text-gray-400">
          <span className="text-sm font-medium">Imagen no disponible</span>
        </div>
      )}
    </div>
  );
}
