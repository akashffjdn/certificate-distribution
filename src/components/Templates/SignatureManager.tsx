import React, { useState, useRef } from 'react';
import { Upload, Pen, X, Check } from 'lucide-react';

interface Signature {
  id: string;
  role: 'principal' | 'hod' | 'coordinator';
  type: 'upload' | 'draw';
  data: string; // base64 for uploaded images or SVG path for drawn signatures
  name: string;
}

interface SignatureManagerProps {
  signatures: Signature[];
  onSignaturesChange: (signatures: Signature[]) => void;
}

export default function SignatureManager({ signatures, onSignaturesChange }: SignatureManagerProps) {
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const roles = [
    { id: 'principal', label: 'Principal', description: 'Principal signature with seal' },
    { id: 'hod', label: 'HOD', description: 'Head of Department signature' },
    { id: 'coordinator', label: 'Coordinator/Guide', description: 'Event coordinator or guide signature' }
  ];

  const getSignature = (role: string) => {
    return signatures.find(sig => sig.role === role);
  };

  const handleFileUpload = (role: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (.png, .jpg, .svg)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newSignature: Signature = {
        id: Date.now().toString(),
        role: role as any,
        type: 'upload',
        data: e.target?.result as string,
        name: file.name
      };

      const updatedSignatures = signatures.filter(sig => sig.role !== role);
      onSignaturesChange([...updatedSignatures, newSignature]);
      setActiveRole(null);
    };
    reader.readAsDataURL(file);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const saveDrawnSignature = (role: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL();
    const newSignature: Signature = {
      id: Date.now().toString(),
      role: role as any,
      type: 'draw',
      data: dataURL,
      name: `${role}_signature_drawn`
    };

    const updatedSignatures = signatures.filter(sig => sig.role !== role);
    onSignaturesChange([...updatedSignatures, newSignature]);
    setDrawingMode(false);
    setActiveRole(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const removeSignature = (role: string) => {
    const updatedSignatures = signatures.filter(sig => sig.role !== role);
    onSignaturesChange(updatedSignatures);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Digital Signatures</h3>
        <p className="text-sm text-gray-600">
          Add digital signatures for Principal, HOD, and Coordinator/Guide. These will appear in the certificate footer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => {
          const signature = getSignature(role.id);
          
          return (
            <div key={role.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{role.label}</h4>
                  <p className="text-xs text-gray-500">{role.description}</p>
                </div>
                {signature && (
                  <button
                    onClick={() => removeSignature(role.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {signature ? (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center min-h-[80px]">
                    <img
                      src={signature.data}
                      alt={`${role.label} signature`}
                      className="max-h-16 max-w-full object-contain"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>Type: {signature.type === 'upload' ? 'Uploaded' : 'Hand-drawn'}</p>
                    <p>File: {signature.name}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-6 text-center min-h-[80px] flex items-center justify-center">
                    <p className="text-sm text-gray-500">No signature added</p>
                  </div>
                  
                  {activeRole === role.id ? (
                    <div className="space-y-3">
                      {!drawingMode ? (
                        <div className="space-y-2">
                          <label className="block">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(role.id, file);
                              }}
                              className="hidden"
                            />
                            <div className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 cursor-pointer transition-colors">
                              <Upload className="w-4 h-4" />
                              Upload Image
                            </div>
                          </label>
                          
                          <button
                            onClick={() => setDrawingMode(true)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                          >
                            <Pen className="w-4 h-4" />
                            Draw Signature
                          </button>
                          
                          <button
                            onClick={() => setActiveRole(null)}
                            className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="border border-gray-300 rounded">
                            <canvas
                              ref={canvasRef}
                              width={200}
                              height={100}
                              className="w-full cursor-crosshair"
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                              style={{ touchAction: 'none' }}
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={clearCanvas}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => saveDrawnSignature(role.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              Save
                            </button>
                          </div>
                          
                          <button
                            onClick={() => {
                              setDrawingMode(false);
                              setActiveRole(null);
                              clearCanvas();
                            }}
                            className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveRole(role.id)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Add Signature
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {signatures.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">
              {signatures.length} signature{signatures.length !== 1 ? 's' : ''} configured. 
              These will appear in the certificate footer.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}