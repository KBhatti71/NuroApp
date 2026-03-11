import { useCallback } from 'react';
import { useAppContext } from './useAppContext';
import { exportToPDF, exportToMarkdown, exportToJSON, triggerPrint } from '../services/exportService';

export function useExport() {
  const { state } = useAppContext();
  const { cards, course } = state;

  const exportPDF = useCallback(async (selectedCards = cards) => {
    await exportToPDF(selectedCards, { filename: `${course?.name || 'neurocard'}-study-cards` });
  }, [cards, course]);

  const copyMarkdown = useCallback(async (selectedCards = cards) => {
    const md = exportToMarkdown(selectedCards);
    await navigator.clipboard.writeText(md);
    return md;
  }, [cards]);

  const downloadJSON = useCallback((selectedCards = cards) => {
    const json = exportToJSON(selectedCards);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course?.name || 'neurocard'}-cards.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [cards, course]);

  const print = useCallback((selectedCards = cards) => {
    triggerPrint(selectedCards, course);
  }, [cards, course]);

  return { exportPDF, copyMarkdown, downloadJSON, print, cards };
}
