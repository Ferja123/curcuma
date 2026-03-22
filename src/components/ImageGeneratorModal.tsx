import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { X, Image as ImageIcon, Loader2, Sparkles, Settings2 } from 'lucide-react';

interface ImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (url: string) => void;
  defaultPrompt: string;
}

export default function ImageGeneratorModal({ isOpen, onClose, onImageGenerated, defaultPrompt }: ImageGeneratorModalProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const aspectRatios = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      // @ts-ignore
      if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
      
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      
      const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: prompt,
        config: {
          // @ts-ignore
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: "1K"
          }
        }
      });
      
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          setGeneratedImage(imageUrl);
          break;
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Error al generar la imagen. Asegúrate de haber seleccionado una clave API válida con permisos de facturación.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 text-gray-900">
          <Sparkles className="w-7 h-7 text-amber-500" />
          Generador de Imágenes IA
        </h2>
        <p className="text-gray-600 mb-6">
          Usa inteligencia artificial para generar imágenes fotorrealistas de tu producto basadas en la imagen que compartiste.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción de la imagen (Prompt)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-2xl h-32 resize-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-700 leading-relaxed"
              placeholder="Describe la imagen que deseas generar..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Relación de aspecto (Aspect Ratio)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 px-1 rounded-xl text-sm font-bold transition-all border-2 ${
                    aspectRatio === ratio
                      ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-sm'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tip: Usa 9:16 para TikTok Reels/Stories, y 1:1 para posts cuadrados.
            </p>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-70 transition-all shadow-lg shadow-amber-500/30"
          >
            {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
            {isGenerating ? 'Generando con Gemini 3.1...' : 'Generar Imagen Mágica'}
          </button>
          
          {generatedImage && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-bold text-gray-800 mb-3">Resultado:</h3>
              <div className="rounded-2xl overflow-hidden border-4 border-gray-100 shadow-inner">
                <img src={generatedImage} alt="Generated" className="w-full h-auto object-cover" loading="lazy" decoding="async" />
              </div>
              <button 
                onClick={() => {
                  onImageGenerated(generatedImage);
                  onClose();
                }}
                className="mt-4 w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-colors shadow-xl"
              >
                ✅ Usar esta imagen en la página
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
