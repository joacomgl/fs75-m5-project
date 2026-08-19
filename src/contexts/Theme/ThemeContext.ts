import {createContext} from 'react';
import type {ThemeContextType} from './ThemeContext.types';

export const ThemeContext = createContext<ThemeContextType | null>(null);