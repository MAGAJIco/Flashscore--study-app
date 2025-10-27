
"use client";

import React from 'react';

interface FeatureApp {
  id: string;
  icon: string;
  name: string;
}

interface DocsAppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  apps: FeatureApp[];
}

export function DocsAppDrawer({ isOpen, onClose, apps }: DocsAppDrawerProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-20 right-5 bg-white rounded-xl shadow-2xl p-5 w-96 max-h-96 overflow-y-auto z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'
        }`}
      >
        <div className="text-lg font-semibold text-gray-700 mb-5 pb-4 border-b border-gray-200">
          Sports Central Apps
        </div>
        <div className="grid grid-cols-3 gap-4">
          {apps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl mb-2 text-white">
                {app.icon}
              </div>
              <div className="text-sm text-center font-medium text-gray-700">{app.name}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
