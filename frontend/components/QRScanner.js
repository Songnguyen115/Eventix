import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';
import toast from 'react-hot-toast';

export default function QRScanner({ onScan, isScanning = false }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);
  const [lastScan, setLastScan] = useState(null);
  const webcamRef = useRef(null);
  const readerRef = useRef(null);
  const scanIntervalRef = useRef(null);

  useEffect(() => {
    // Initialize QR reader
    readerRef.current = new BrowserMultiFormatReader();

    // Request camera permission
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setHasPermission(true);
      })
      .catch((err) => {
        console.error('Camera permission denied:', err);
        setHasPermission(false);
        setError('Camera access denied. Please enable camera permissions.');
      });

    return () => {
      // Cleanup
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  useEffect(() => {
    if (isScanning && hasPermission) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => stopScanning();
  }, [isScanning, hasPermission]);

  const startScanning = () => {
    if (!webcamRef.current || scanIntervalRef.current) return;

    scanIntervalRef.current = setInterval(() => {
      captureAndScan();
    }, 500); // Scan every 500ms
  };

  const stopScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  const captureAndScan = async () => {
    if (!webcamRef.current || !readerRef.current) return;

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      // Convert base64 to image element
      const img = new Image();
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const result = await readerRef.current.decodeFromImageData(imageData);

          if (result && result.text) {
            const qrCode = result.text;
            
            // Prevent duplicate scans within 3 seconds
            if (lastScan === qrCode && Date.now() - lastScan < 3000) {
              return;
            }

            setLastScan(qrCode);
            toast.success(`QR Code scanned: ${qrCode}`);
            onScan(qrCode);
          }
        } catch (err) {
          // No QR code found in this frame - this is normal
        }
      };
      img.src = imageSrc;
    } catch (err) {
      console.error('Scan error:', err);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'environment', // Use back camera on mobile
  };

  if (hasPermission === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2">Requesting camera permission...</span>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-red-600 font-medium">Camera Access Required</p>
        <p className="text-gray-600 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative rounded-lg overflow-hidden bg-black">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-auto"
        />
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-white opacity-80"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-white opacity-80"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-white opacity-80"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-white opacity-80"></div>
          
          {/* Center square */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-white border-dashed opacity-60 rounded-lg"></div>
          </div>
          
          {/* Status indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isScanning 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}>
              {isScanning ? '🔍 Scanning...' : '⏸️ Paused'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Position the QR code within the frame</p>
        <p>The scanner will automatically detect and process codes</p>
      </div>
    </div>
  );
}
