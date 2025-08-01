import { FILTERS } from '../constants';


export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};


export const validateFilters = (filters) => {
  if (!filters || typeof filters !== 'object') return false;
  
  const requiredKeys = Object.values(FILTERS);
  return requiredKeys.every(key => key in filters);
};


export const validateInputData = (data) => {
  if (!data) return false;
  
  if (!data.urls) return false;
  
  if (!Array.isArray(data.urls)) return false;
  
  return data.urls.every(url => validateUrl(url));
};


export const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  return text.trim().replace(/[<>]/g, '');
}; 