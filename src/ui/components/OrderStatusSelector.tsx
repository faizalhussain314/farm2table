// OrderStatusSelector.tsx
import React from "react";

export type OrderStatus =
  | "Placed"
  | "Packing"
  | "Ready"
  | "Dispatch"
  | "Delivered";

interface OrderStatusSelectorProps {
  
  options: OrderStatus[];
  /** Currently selected status (controlled) */
  selected: OrderStatus;
  /** Called whenever the user picks a new status */
  onChange: (value: OrderStatus) => void;
  /** Disable the control (e.g. while saving) */
  disabled?: boolean;
  /** Whether the menu is open (controlled from parent) */
  open: boolean;
  /** Setter for the open state */
  setOpen: (v: boolean) => void;
  /** Ref so the parent can close on outside‑click if needed */
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const OrderStatusSelector: React.FC<OrderStatusSelectorProps> = ({
  options,
  selected,
  onChange,
  disabled = false,
  open,
  setOpen,
  dropdownRef,
}) => (
  <div className="w-full" ref={dropdownRef}>
    <label
      htmlFor="order‑status"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Order Status
    </label>

    {/* trigger */}
    <button
      id="order‑status"
      type="button"
      disabled={disabled}
      onClick={() => setOpen(!open)}
      className={`w-full mt-1 rounded-md border-2 px-3 py-2 shadow-sm
                  text-left flex items-center justify-between
                  ${
                    disabled
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
    >
      {selected}
      {/* chevron */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        className={`transition-transform duration-200 ${
          open ? "rotate-180" : ""
        }`}
      >
        <path
          d="M7 10l5 5 5-5"
          stroke="#6b7280"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>

    {/* menu */}
    {open && !disabled && (
      <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto">
        {options.map((s) => (
          <li
            key={s}
            className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
              s === selected ? "bg-gray-50" : ""
            }`}
            onClick={() => {
              onChange(s);
              setOpen(false);
            }}
          >
            {s}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default OrderStatusSelector;
