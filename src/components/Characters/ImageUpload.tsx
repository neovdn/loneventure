import React, { useState, useRef } from 'react';
import { Upload, X, User, Camera, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../UI/LoadingSpinner';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImage, 
  onImageChange, 
  disabled = false 
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a valid image file (JPG, PNG, or WebP)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageChange(result);
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to process image');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload image');
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-300 mb-3">
        Character Avatar
      </label>
      
      {currentImage ? (
        <div className="relative group">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-purple-500/50 shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
            <img
              src={currentImage}
              alt="Character avatar"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <button
            type="button"
            onClick={removeImage}
            disabled={disabled || uploading}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            dragOver
              ? 'border-purple-400 bg-purple-500/10'
              : 'border-slate-600 hover:border-purple-500/50 hover:bg-slate-700/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-3">
              <LoadingSpinner size="lg" />
              <p className="text-slate-400">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <p className="text-slate-300 font-medium mb-1">Upload Character Avatar</p>
                <p className="text-slate-400 text-sm">
                  Drag & drop or click to select
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  JPG, PNG, WebP up to 5MB
                </p>
              </div>
              <Upload className="w-6 h-6 text-slate-400" />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />
    </div>
  );
};

export default ImageUpload;