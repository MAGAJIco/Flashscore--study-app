
"use client";

import { useEffect, useState } from 'react';

type ColorBlindMode = 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'achromatopsia';

const COLOR_BLIND_FILTERS = {
  deuteranopia: `
    .deuteranopia-filter {
      filter: url('#deuteranopia');
    }
  `,
  protanopia: `
    .protanopia-filter {
      filter: url('#protanopia');
    }
  `,
  tritanopia: `
    .tritanopia-filter {
      filter: url('#tritanopia');
    }
  `,
  achromatopsia: `
    .achromatopsia-filter {
      filter: grayscale(100%);
    }
  `
};

export function useColorBlindMode() {
  const [mode, setMode] = useState<ColorBlindMode>('none');

  useEffect(() => {
    const savedMode = localStorage.getItem('color_blind_mode') as ColorBlindMode || 'none';
    setMode(savedMode);
    applyColorBlindMode(savedMode);
  }, []);

  const applyColorBlindMode = (newMode: ColorBlindMode) => {
    // Remove existing filters
    document.body.classList.remove('deuteranopia-filter', 'protanopia-filter', 'tritanopia-filter', 'achromatopsia-filter');
    
    // Apply new filter
    if (newMode !== 'none') {
      document.body.classList.add(`${newMode}-filter`);
      
      // Add SVG filters if not exists
      if (!document.getElementById('color-blind-filters')) {
        const svgFilters = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgFilters.id = 'color-blind-filters';
        svgFilters.style.position = 'absolute';
        svgFilters.style.width = '0';
        svgFilters.style.height = '0';
        svgFilters.innerHTML = `
          <defs>
            <filter id="deuteranopia">
              <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/>
            </filter>
            <filter id="protanopia">
              <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/>
            </filter>
            <filter id="tritanopia">
              <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/>
            </filter>
          </defs>
        `;
        document.body.appendChild(svgFilters);
      }
    }
    
    setMode(newMode);
    localStorage.setItem('color_blind_mode', newMode);
  };

  return { mode, setColorBlindMode: applyColorBlindMode };
}
