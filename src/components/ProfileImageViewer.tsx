import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, ImageIcon, RulerIcon, EditIcon, CheckIcon, RefreshCwIcon } from 'lucide-react';
export const ProfileImageViewer = ({
  imageUrl,
  onClose
}) => {
  const [activeView, setActiveView] = useState('front');
  const [editMode, setEditMode] = useState(false);
  // Sample portrait images
  const portraitOptions = ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'];
  // State for current image and editable content
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editableContent, setEditableContent] = useState({
    title: 'Face Analysis',
    skinHealth: 76,
    eyebags: 45,
    hydration: 78,
    drySkin: 17,
    faceWidth: '5.2',
    faceHeight: '7.8',
    eyeDistance: '2.4',
    noseWidth: '1.3'
  });
  // Toggle to next image
  const changeImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % portraitOptions.length);
  };
  // Handle content change
  const handleContentChange = (field, value) => {
    setEditableContent(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Full-width content without device frame */}
      <div className="w-full relative">
        {/* Top controls */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          <button onClick={onClose} className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors">
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setEditMode(!editMode)} className={`p-2 rounded-full transition-colors ${editMode ? 'bg-green-500 text-white' : 'bg-black/70 text-white hover:bg-black/90'}`}>
              {editMode ? <CheckIcon className="h-6 w-6" /> : <EditIcon className="h-6 w-6" />}
            </button>
            {editMode && <button onClick={changeImage} className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors">
                <RefreshCwIcon className="h-6 w-6" />
              </button>}
            <button onClick={onClose} className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        {activeView === 'front' && <div className="relative">
            <div className="relative w-full">
              {/* Full-width image */}
              <img src={portraitOptions[currentImageIndex]} alt="Portrait" className="w-full h-screen object-cover" />
              {/* Dark gradient overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              {/* Measurement points */}
              <div className="absolute top-[30%] left-[30%] h-5 w-5 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
              <div className="absolute top-[35%] right-[35%] h-5 w-5 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
              <div className="absolute top-[45%] left-[40%] h-5 w-5 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
              <div className="absolute top-[60%] left-[28%] h-5 w-5 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
              <div className="absolute top-[60%] right-[28%] h-5 w-5 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
              {/* Measurement lines */}
              <div className="absolute top-[30%] left-[30%] right-[35%] h-[3px] bg-blue-400 opacity-90"></div>
              <div className="absolute top-[35%] bottom-[40%] right-[35%] w-[3px] bg-blue-400 opacity-90"></div>
              <div className="absolute top-[45%] left-[40%] right-[28%] h-[3px] bg-blue-400 opacity-90"></div>
              {/* Title in center */}
              <div className="absolute top-1/4 left-0 right-0 text-center">
                {editMode ? <input type="text" value={editableContent.title} onChange={e => handleContentChange('title', e.target.value)} className="text-3xl font-bold text-white bg-transparent border-b border-white/30 text-center px-2 py-1 focus:outline-none focus:border-white" /> : <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                    {editableContent.title}
                  </h2>}
              </div>
              {/* Scan effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-blue-400/0 via-blue-400 to-blue-400/0 animate-pulse"></div>
              </div>
            </div>
            {/* Skin health metrics at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md px-6 py-8">
              <div className="flex items-center mb-6">
                <div className="text-[48px] font-bold text-green-400 mr-4">
                  {editMode ? <input type="number" value={editableContent.skinHealth} onChange={e => handleContentChange('skinHealth', parseInt(e.target.value) || 0)} className="w-24 text-[48px] font-bold text-green-400 bg-transparent border-b border-white/30 px-2 py-1 focus:outline-none focus:border-white" /> : editableContent.skinHealth}
                </div>
                <div>
                  <div className="text-white text-lg font-semibold">
                    Skin Health Score
                  </div>
                  <div className="flex mt-2 space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-orange-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    <div className="h-3 w-3 rounded-full bg-gray-400/30"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-orange-200 rounded-2xl p-4 flex flex-col items-center justify-center">
                  <div className="text-xl font-bold text-orange-800">
                    {editMode ? <input type="number" value={editableContent.eyebags} onChange={e => handleContentChange('eyebags', parseInt(e.target.value) || 0)} className="w-16 text-xl font-bold text-orange-800 bg-transparent border-b border-orange-300 text-center px-2 py-1 focus:outline-none" /> : editableContent.eyebags}
                  </div>
                  <div className="text-sm font-medium text-orange-700">
                    Eyebags
                  </div>
                </div>
                <div className="bg-green-200 rounded-2xl p-4 flex flex-col items-center justify-center">
                  <div className="text-xl font-bold text-green-800">
                    {editMode ? <input type="number" value={editableContent.hydration} onChange={e => handleContentChange('hydration', parseInt(e.target.value) || 0)} className="w-16 text-xl font-bold text-green-800 bg-transparent border-b border-green-300 text-center px-2 py-1 focus:outline-none" /> : editableContent.hydration}
                  </div>
                  <div className="text-sm font-medium text-green-700">
                    Hydration
                  </div>
                </div>
                <div className="bg-red-200 rounded-2xl p-4 flex flex-col items-center justify-center">
                  <div className="text-xl font-bold text-red-800">
                    {editMode ? <input type="number" value={editableContent.drySkin} onChange={e => handleContentChange('drySkin', parseInt(e.target.value) || 0)} className="w-16 text-xl font-bold text-red-800 bg-transparent border-b border-red-300 text-center px-2 py-1 focus:outline-none" /> : editableContent.drySkin}
                  </div>
                  <div className="text-sm font-medium text-red-700">
                    Dry Skin
                  </div>
                </div>
              </div>
            </div>
          </div>}
        {activeView === 'analysis' && <div className="bg-black min-h-screen px-6 py-20">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">
                {editMode ? <input type="text" value={editableContent.title} onChange={e => handleContentChange('title', e.target.value)} className="w-full text-3xl font-bold text-white bg-transparent border-b border-white/30 px-2 py-1 focus:outline-none focus:border-white" /> : editableContent.title}
              </h2>
              <div className="bg-gray-900 rounded-2xl p-6 mb-8">
                <div className="flex items-center mb-4">
                  <RulerIcon className="h-6 w-6 text-blue-400 mr-3" />
                  <span className="font-semibold text-white text-xl">
                    Face Measurements
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <div className="text-gray-300 mb-1">Face Width</div>
                    <div className="text-xl font-medium text-white flex items-center">
                      {editMode ? <input type="text" value={editableContent.faceWidth} onChange={e => handleContentChange('faceWidth', e.target.value)} className="w-16 text-xl font-medium text-white bg-transparent border-b border-white/30 px-2 py-1 focus:outline-none focus:border-white" /> : editableContent.faceWidth}
                      <span className="ml-1">in</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <div className="text-gray-300 mb-1">Face Height</div>
                    <div className="text-xl font-medium text-white flex items-center">
                      {editMode ? <input type="text" value={editableContent.faceHeight} onChange={e => handleContentChange('faceHeight', e.target.value)} className="w-16 text-xl font-medium text-white bg-transparent border-b border-white/30 px-2 py-1 focus:outline-none focus:border-white" /> : editableContent.faceHeight}
                      <span className="ml-1">in</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <div className="text-gray-300 mb-1">Eye Distance</div>
                    <div className="text-xl font-medium text-white flex items-center">
                      {editMode ? <input type="text" value={editableContent.eyeDistance} onChange={e => handleContentChange('eyeDistance', e.target.value)} className="w-16 text-xl font-medium text-white bg-transparent border-b border-white/30 px-2 py-1 focus:outline-none focus:border-white" /> : editableContent.eyeDistance}
                      <span className="ml-1">in</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <div className="text-gray-300 mb-1">Nose Width</div>
                    <div className="text-xl font-medium text-white flex items-center">
                      {editMode ? <input type="text" value={editableContent.noseWidth} onChange={e => handleContentChange('noseWidth', e.target.value)} className="w-16 text-xl font-medium text-white bg-transparent border-b border-white/30 px-2 py-1 focus:outline-none focus:border-white" /> : editableContent.noseWidth}
                      <span className="ml-1">in</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Analysis Summary
                </h3>
                <p className="text-gray-300 mb-4">
                  Based on your facial proportions, we've calculated your
                  optimal pillow height and firmness.
                </p>
                <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-700/30">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                      <CheckIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-blue-300 text-sm">
                        Recommended Pillow Type
                      </div>
                      <div className="text-white font-medium">
                        Medium-Firm Memory Foam
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>}
        {activeView === 'side' && <div className="relative">
            <img src={portraitOptions[currentImageIndex]} alt="Side profile" className="w-full h-screen object-cover" />
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-black/70 backdrop-blur-md rounded-xl px-6 py-4 text-white font-medium text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-white/70" />
                Side view measurements coming soon
              </div>
            </div>
            {/* Measurement points */}
            <div className="absolute top-[30%] right-[30%] h-5 w-5 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
            <div className="absolute top-[50%] right-[40%] h-5 w-5 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
            <div className="absolute top-[70%] right-[35%] h-5 w-5 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
            {/* Measurement lines */}
            <div className="absolute top-[30%] right-[30%] bottom-[50%] w-[3px] bg-blue-400 opacity-90"></div>
            <div className="absolute top-[50%] right-[40%] bottom-[70%] w-[3px] bg-blue-400 opacity-90"></div>
          </div>}
      </div>
      {/* View switcher */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
          <button onClick={() => setActiveView('front')} className={`p-1.5 px-4 rounded-full text-base font-medium ${activeView === 'front' ? 'bg-white text-black' : 'text-white'}`}>
            Front
          </button>
          <button onClick={() => setActiveView('side')} className={`p-1.5 px-4 rounded-full text-base font-medium ${activeView === 'side' ? 'bg-white text-black' : 'text-white'}`}>
            Side
          </button>
          <button onClick={() => setActiveView('analysis')} className={`p-1.5 px-4 rounded-full text-base font-medium ${activeView === 'analysis' ? 'bg-white text-black' : 'text-white'}`}>
            Analysis
          </button>
        </div>
      </div>
    </motion.div>;
};