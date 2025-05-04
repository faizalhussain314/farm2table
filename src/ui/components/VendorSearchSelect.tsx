import { useState, useEffect, useRef } from "react";
import { getVendors } from "../../services/vendors/vendorService";   // unchanged service

/* A light‑weight shape that only the picker cares about */
export interface VendorOption {
  id: string;          // Mongo _id as string
  name: string;  
  vendorCode: string;       
}

interface Props {
  onSelect: (v: VendorOption | null) => void;
  initial?: VendorOption | null;
  className?: string;
}

const VendorSearchSelect = ({
  onSelect,
  initial = null,
  className = "",
}: Props) => {
  const [query, setQuery] = useState(initial?.name ?? "");
  const [list, setList] = useState<VendorOption[] | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);

  /* ───────── fetch & flatten once ───────── */
  useEffect(() => {
    getVendors()
      .then((raw) => {
        /* raw is the long object array; flatten just for this UI */
        const flat = raw.map((item: any) => ({
          id: item._id,
          name: item.userId?.name ?? "Unnamed vendor",
          vendorCode: item.vendorCode ?? "",
        }));
        setList(flat);
        if (flat.length === 0) setError("Vendor list is empty");
      })
      .catch(() => setError("Could not load vendor list"));
  }, []);

  /* ───────── close dropdown on outside click ───────── */
  useEffect(() => {
    const handler = (e: MouseEvent) =>
      box.current && !box.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const q = query.toLowerCase().trim();
  const filtered = Array.isArray(list)
  ? list.filter((v) =>
      v.name.toLowerCase().includes(q) ||
      v.vendorCode.toLowerCase().includes(q) ||
      v.id.toLowerCase().includes(q)           // ← optional: search by Mongo _id
    )
  : [];

  const choose = (v: VendorOption) => {
    setQuery(v.name);
    setOpen(false);
    onSelect(v);
  };

  /* ───────── UI ───────── */
  return (
    <div ref={box} className={`relative ${className}`}>
      <input
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          onSelect(null);
          setOpen(true);
        }}
        placeholder="Search vendor (e.g., Vikram )"
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary bg-white"
        required
      />

      {error && <p className="mt-2 text-red-500">{error}</p>}

      {open && (
        <ul className="absolute z-10 w-full mt-1 max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-md">
          {Array.isArray(list) && list.length === 0 ? (
            <li className="p-3 text-gray-500">Vendor list is empty</li>
          ) : filtered.length === 0 ? (
            <li className="p-3 text-gray-500">No vendors found</li>
          ) : (
            filtered.map((v) => (
              <li
                key={v.id}
                onClick={() => choose(v)}
                className="p-3 cursor-pointer hover:bg-blue-50"
              >
                {v.name} -  {v.vendorCode}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default VendorSearchSelect;
export type { VendorOption as Vendor };
