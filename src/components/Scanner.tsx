import React, { useEffect, useState, useRef } from 'react';
import { CameraIcon, SmartphoneIcon, XIcon, AlertTriangleIcon } from 'lucide-react';
type ScanError = {
  type: 'permission' | 'compatibility' | 'general';
  message: string;
};
export const Scanner = ({
  onComplete,
  onCancel
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deviceSupported, setDeviceSupported] = useState<boolean | null>(null);
  const [error, setError] = useState<ScanError | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  useEffect(() => {
    // Check device compatibility
    checkDeviceCompatibility();
    return () => {
      // Cleanup: stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  const checkDeviceCompatibility = async () => {
    try {
      // Check if device has camera capabilities
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not available');
      }
      // Check if device might have advanced sensing capabilities
      const userAgent = navigator.userAgent;
      const mightHaveDepthSensor = /iPhone|iPad/.test(userAgent) && (/iPhone13,|iPhone14,|iPad13,|iPad14,/.test(userAgent) || userAgent.includes('iPhone Pro'));
      setDeviceSupported(true);
      // Request camera permissions early
      await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment'
        }
      });
    } catch (err) {
      setError({
        type: 'compatibility',
        message: "Your device doesn't support the required features for scanning"
      });
      setDeviceSupported(false);
    }
  };
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: {
            ideal: 1920
          },
          height: {
            ideal: 1080
          }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setError({
        type: 'permission',
        message: 'Camera permission denied. Please enable camera access to use the scanning feature.'
      });
    }
  };
  const startScan = async () => {
    await startCamera();
    setIsScanning(true);
    setProgress(0);
    // Start measurement process
    requestAnimationFrame(processScan);
  };
  const processScan = () => {
    if (!isScanning) return;
    // Process current frame
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        // Here you would add actual measurement processing logic
      }
    }
    // Update progress (simulated for now)
    setProgress(prev => {
      const newProgress = prev + 2;
      if (newProgress >= 100) {
        completeScan();
        return 100;
      }
      animationFrameRef.current = requestAnimationFrame(processScan);
      return newProgress;
    });
  };
  const completeScan = () => {
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    // Generate measurements (simulated for now)
    const measurements = {
      neckLength: (Math.random() * 2 + 4).toFixed(1),
      neckWidth: (Math.random() * 3 + 6).toFixed(1)
    };
    onComplete(measurements);
  };
  return <div className="fixed inset-0 z-50 bg-black">
      <div className="relative h-full flex flex-col">
        {/* Camera Preview */}
        <div className="relative flex-1 bg-black">
          <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
          {/* Error State */}
          {error && <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center p-6 max-w-md">
                <AlertTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  {error.type === 'permission' ? 'Camera Access Required' : 'Device Not Compatible'}
                </h3>
                <p className="text-gray-300 mb-6">{error.message}</p>
                <button onClick={onCancel} className="px-6 py-3 bg-white rounded-xl text-black font-medium">
                  Go Back
                </button>
              </div>
            </div>}
          {/* Scanning UI Overlay */}
          {isScanning && <div className="absolute inset-0">
              <div className="h-full w-full flex flex-col items-center justify-center">
                {/* Measurement Guide Frame */}
                <div className="w-64 h-64 border-2 border-blue-500 rounded-2xl relative">
                  {/* Scanning line animation */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 transition-transform duration-300" style={{
                transform: `translateY(${progress / 100 * 256}px)`
              }} />
                  {/* Measurement points */}
                  <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-blue-500" />
                  <div className="absolute top-1/4 right-1/4 h-2 w-2 rounded-full bg-blue-500" />
                  <div className="absolute bottom-1/4 left-1/3 h-2 w-2 rounded-full bg-blue-500" />
                  <div className="absolute bottom-1/4 right-1/3 h-2 w-2 rounded-full bg-blue-500" />
                </div>
                <div className="mt-8 text-white text-center">
                  <p className="text-lg font-medium mb-2">
                    Scanning in progress
                  </p>
                  <p className="text-sm text-gray-300">
                    Please hold still while we measure
                  </p>
                </div>
              </div>
            </div>}
        </div>
        {/* Top Controls */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black to-transparent">
          <div className="flex justify-between items-center p-4">
            <button onClick={onCancel} className="p-2 text-white hover:text-gray-300 transition-colors">
              <XIcon className="h-6 w-6" />
            </button>
            {deviceSupported !== null && <div className="flex items-center bg-black/50 rounded-full px-4 py-2">
                <SmartphoneIcon className="h-4 w-4 text-white mr-2" />
                <span className="text-sm text-white">
                  {deviceSupported ? 'Camera Ready' : 'Camera Not Available'}
                </span>
              </div>}
          </div>
        </div>
        {/* Bottom Controls */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent">
          <div className="h-full flex items-center justify-center">
            {!isScanning && !error && <button onClick={startScan} className="px-8 py-3 bg-white rounded-full text-black font-medium hover:bg-gray-100 transition-colors">
                Start Scanning
              </button>}
          </div>
        </div>
        {/* Progress Indicator */}
        {isScanning && <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-white/10 rounded-full w-64 h-1">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{
            width: `${progress}%`
          }} />
            </div>
          </div>}
      </div>
    </div>;
};