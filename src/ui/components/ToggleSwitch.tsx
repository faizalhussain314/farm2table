import React from 'react';

interface ToggleSwitchProps {
    /**
     * Determines if the toggle switch is checked (on) or not (off).
     */
    isChecked: boolean;
    /**
     * Optional callback function triggered when the toggle state changes.
     * Receives the new checked state (boolean) as an argument.
     */
    onChange?: (checked: boolean) => void;
}

/**
 * A simple visual toggle switch component styled with Tailwind CSS.
 * It can be used to display a boolean state and optionally handle changes.
 */
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isChecked, onChange }) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        {/* Hidden checkbox input - the visual toggle is built using CSS pseudo-elements */}
        <input
            type="checkbox"
            value=""
            className="sr-only peer" // sr-only makes it visually hidden but accessible
            checked={isChecked}
            // If onChange is not provided, the toggle acts as read-only
            readOnly={!onChange}
            // Call the onChange prop when the input's checked state changes
            onChange={(e) => onChange?.(e.target.checked)}
        />
        {/* The visual representation of the toggle switch */}
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        {/* Optional text next to the toggle (currently commented out) */}
        {/* <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span> */}
      </label>
    );
  };

export default ToggleSwitch;
