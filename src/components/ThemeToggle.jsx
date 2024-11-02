import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded bg-gray-200 dark:bg-gray-600"
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}; 