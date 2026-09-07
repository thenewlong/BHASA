import React, { createContext, useState, useEffect } from 'react';

export const WordContext = createContext();

const getRelativeTime = (timestamp) => {
  if (!timestamp) return "Just now";
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - timestamp) / 1000);
  if (elapsedSeconds < 60) return 'Just now';
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) return `${elapsedMinutes} min${elapsedMinutes > 1 ? 's' : ''} ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} hr${elapsedHours > 1 ? 's' : ''} ago`;
  const elapsedDays = Math.floor(elapsedHours / 24);
  return `${elapsedDays} day${elapsedDays > 1 ? 's' : ''} ago`;
};

export const WordProvider = ({ children }) => {
  const [words, setWords] = useState(() => {
    const saved = localStorage.getItem('bhasa_words');
    if (saved) return JSON.parse(saved);
    const currentTime = Date.now();
    return [
      { id: 1, word: "Chwikha", eng: "Home", hindi: "घर", bengali: "বাড়ি", example: "Chwikha no thangwi tong.", contributor: "Rathan Debbarma", createdAt: currentTime - 1000 * 60 * 30, votes: 12, status: "PENDING" },
      { id: 2, word: "Nukhung", eng: "Water", hindi: "पानी", bengali: "জল", example: "Nukhung man nangai.", contributor: "Sujata Chakma", createdAt: currentTime - 1000 * 60 * 120, votes: 8, status: "APPROVED" },
    ];
  });

  useEffect(() => {
    localStorage.setItem('bhasa_words', JSON.stringify(words));
  }, [words]);

  const addWord = (newWordData) => {
    const newItem = { id: Date.now(), ...newWordData, status: "PENDING", votes: 1, createdAt: Date.now() };
    setWords([newItem, ...words]);
  };

  const updateStatus = (id, newStatus) => {
    setWords(words.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  // Naya feature: Permanent Delete
  const deleteWord = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this word?")) {
      setWords(words.filter(item => item.id !== id));
    }
  };

  // Naya feature: Permanent Edit
  const editWord = (id, updatedData) => {
    setWords(words.map(item => item.id === id ? { ...item, ...updatedData } : item));
  };

  const formattedWords = words.map(item => ({ ...item, time: getRelativeTime(item.createdAt) }));

  return (
    <WordContext.Provider value={{ words: formattedWords, addWord, updateStatus, deleteWord, editWord }}>
      {children}
    </WordContext.Provider>
  );
};