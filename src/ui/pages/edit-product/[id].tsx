import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../../../services/products/productService';
import { getCategories, Category } from '../../../services/categories/categoryService';
import { getSubcategories, getSubcategoriesByCategoryName, Subcategory } from '../../../services/subcategories/subcategoryService';

import { toast } from 'react-hot-toast';
import { Image } from 'lucide-react';





const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
const inputRef = useRef<HTMLInputElement>(null);
const [backendImage, setBackendImage] = useState<string | null>(null);


  const extractFileName = (url: string) => url.split("/").pop() ?? "image.jpg";

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const [product, categoriesData] = await Promise.all([
          getProductById(id!),
          getCategories(),
        ]);

        setProductName(product.name);
        setCategory(product.category);
        setSubcategory(product.subcategory ?? '');
        setPrice(product.price);
        setStock(product.stock);
        setUnit(product.unit);
        setDescription(product.description || '');
        setCategories(categoriesData);
        setPreviewUrl(product.image ? `${product.image}` : null);

        const subcategoriesData = await getSubcategoriesByCategoryName(product.category)

        
        setSubcategories(subcategoriesData);

      } catch (error) {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
  
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      // no new file → keep backend image
      setPreviewUrl(backendImage);
    }
  };
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('category', category);
    formData.append('subcategory', subcategory);
    formData.append('unit', unit);
    formData.append('price', price.toString());
    formData.append('stock', stock.toString());
    formData.append('description', description);
    if (image) formData.append('image', image);

    const toastId = toast.loading('Updating product...');

    try {
      await updateProduct(id!, formData);
      toast.success('Product updated!', { id: toastId });
      navigate('/products');
    } catch (err) {
      toast.error('Failed to update product', { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Product</h1>
      <div className="bg-white shadow-sm rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product Name" className="w-full bg-background rounded-lg px-4 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary" />

            {/* Category */}
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-background rounded-lg px-4 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* Subcategory */}
            <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full bg-background rounded-lg px-4 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary">
              <option value="">Select subcategory</option>
              {subcategories.map((s) => (
                <option key={s._id} value={s.name}>{s.name}</option>
              ))}
            </select>

            {/* Unit */}
            <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full bg-background rounded-lg px-4 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary">
              <option value="kg">Kilogram</option>
              <option value="g">Gram</option>
              <option value="ltr">Litre</option>
              <option value="ml">Millilitre</option>
              <option value="pcs">Pieces</option>
            </select>

            {/* Price */}
            <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Price" className="w-full bg-background rounded-lg px-4 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary" />

            {/* Stock */}
            <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} placeholder="Stock" className="w-full bg-background rounded-lg px-4 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary" />
          </div>

          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full h-32  bg-background rounded-lg px-4 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary" />

          {/*──────── Product Image picker ────────*/}
<div>
  <label className="block mb-2">Product Image</label>

  {/* hidden real input */}
  <input
    type="file"
    accept="image/*"
    ref={inputRef}
    onChange={handleImageChange}
    className="hidden"
  />

  {/* visible trigger */}
  <button
    type="button"
    onClick={() => inputRef.current?.click()}
    className="p-2  border border-gray-300 rounded text-gray-600 flex items-center gap-2"
  >
    <span className="flex-1 text-left truncate">
      {image
        ? image.name                                   /* newly chosen file */
        : previewUrl
        ? extractFileName(previewUrl)                  /* existing API image */
        : "Choose image…"}
    </span>
    <Image />
  </button>

  {previewUrl && (
    <img
      src={previewUrl}
      alt="Preview"
      className="mt-2 h-24 w-24 object-cover rounded border"
    />
  )}
</div>


          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => navigate('/products')} className="px-6 py-2 rounded-lg border border-gray-700 hover:bg-background">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-dark text-background">Update Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
