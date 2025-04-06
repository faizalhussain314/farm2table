import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { addProduct } from '../../services/products/productService';
import { getCategories, Category } from '../../services/categories/categoryService';
import { getSubcategories, Subcategory } from '../../services/subcategories/subcategoryService';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [unit, setUnit] = useState('kg');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDropdowns = async () => {
      setLoading(true);
      setError(null);
      try {
        const [catData, subData] = await Promise.all([
          getCategories(),
          getSubcategories(),
        ]);
        setCategories(catData);
        setSubcategories(subData);
      } catch (err) {
        setError('Failed to load dropdown data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDropdowns();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      toast.error('Product image is required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('category', category);
    formData.append('subcategory', subcategory);
    formData.append('price', price.toString());
    formData.append('stock', stock.toString());
    formData.append('unit', unit);
    formData.append('description', description);
    formData.append('image', image);

    const toastId = toast.loading('Adding product...');

    try {
      await addProduct(formData);
      toast.success('Product added!', { id: toastId });
      navigate('/products');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add product', { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add New Product</h1>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-background rounded-lg px-4 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-background rounded-lg px-4 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Subcategory
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full bg-background rounded-lg px-4 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary"
              >
                <option value="">Select subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Measurement Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-background rounded-lg px-4 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="ltr">Litre (L)</option>
                <option value="ml">Millilitre (ml)</option>
                <option value="pcs">Pieces</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-background rounded-lg px-4 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-background rounded-lg px-4 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary"
                placeholder="Enter stock quantity"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background rounded-lg px-4 py-2 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary h-32"
              placeholder="Enter product description"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Product Image
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-400">
                  Drag and drop your image here, or{' '}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-primary hover:text-primary-dark cursor-pointer"
                  />
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-6 py-2 rounded-lg border border-gray-700 hover:bg-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-dark text-background"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
