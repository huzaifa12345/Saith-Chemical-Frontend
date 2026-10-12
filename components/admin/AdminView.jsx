'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { themeApi } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProductModal from '@/components/ProductTypeModal';
import CategoryManagement from '@/components/admin/CategoryManagement';
import WebsiteSettings from '@/components/admin/WebsiteSettings';
import OrderManagement from '@/components/admin/OrderManagement';
import Dashboard from '@/components/admin/Dashboard';
import Products from '@/components/admin/ProductManagement';
import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  Settings,
  Menu,
  LogOut,
  Store,
  Activity,
  Search,
  Trophy,
} from 'lucide-react';

export default function AdminView() {
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [nextSku, setNextSku] = useState('001');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock_quantity: '',
    image_url: '',
    images: [],
    status: 'active',
    barcode: '',
  });

  const sidebarItems = [
    { id: 'dashboard', name: 'Analytics Hub', icon: LayoutDashboard },
    { id: 'products', name: 'Chemical Inventory', icon: Package },
    { id: 'categories', name: 'Categories', icon: Tags },
    { id: 'orders', name: 'Orders', icon: Truck },
    { id: 'website-settings', name: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }
      try {
        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          themeApi.getProducts(),
          themeApi.getCategories(),
          themeApi.getAllOrders(),
        ]);
        setProducts(productsRes.products || []);
        setCategories(categoriesRes || []);
        setOrders(ordersRes.orders || []);
        setStats({
          totalProducts: productsRes.products?.length || 0,
          totalOrders: ordersRes.orders?.length || 0,
          totalRevenue:
            ordersRes.orders?.reduce(
              (sum, order) => sum + (parseFloat(order.total_amount) || 0),
              0
            ) || 0,
        });
      } catch {
        toast.error('System Error: Data sync failed');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isAuthenticated]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category_id: '',
      stock_quantity: '',
      status: 'active',
      barcode: '',
    });
    fetchNextSku();
    setShowProductForm(true);
  };

  const fetchNextSku = async () => {
    try {
      const skuData = await themeApi.getNextSKU();
      setNextSku(skuData.sku || '001');
    } catch {
      setNextSku('001');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      ...product,
      status: product.is_active ? 'active' : 'inactive',
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to archive this formulation?')) {
      return;
    }
    try {
      await themeApi.deleteProduct(id);
      toast.success('Product removed from active inventory');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    try {
      const result = await themeApi.uploadImages(Array.from(files));
      setUploadedImages((prev) => [...prev, ...result.images]);
      toast.success(`${result.images.length} image(s) uploaded successfully!`);
    } catch {
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeUploadedImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveProduct = async () => {
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock_quantity: parseInt(productForm.stock_quantity, 10),
        image_url: uploadedImages[0] || productForm.image_url,
        images: uploadedImages,
        is_active: productForm.status === 'active',
      };
      if (editingProduct) {
        await themeApi.updateProduct(editingProduct.id, productData);
        toast.success('Formulation Updated');
      } else {
        await themeApi.createProduct(productData);
        toast.success('New Formulation Registered');
      }
      setShowProductForm(false);
      setUploadedImages([]);
      const productsRes = await themeApi.getProducts();
      setProducts(productsRes.products || []);
    } catch (error) {
      toast.error(
        'Save Failed: ' + (error.response?.data?.error || error.message)
      );
    }
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <div className="min-h-screen d-flex align-items-center justify-content-center bg-white">
          <div className="text-center">
            <Trophy size={48} className="text-primary mb-3" />
            <p className="fw-bold text-dark">Accessing Secure Database...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div
        className="admin-wrapper"
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(180deg, #fff7ed 0%, #f8fafc 55%, #eef2f7 100%)',
        }}
      >
        <header
          className="sticky-top w-100 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #111827 0%, #0f172a 100%)',
            borderBottom: '3px solid #f26522',
            zIndex: 1050,
          }}
        >
          <div className="container-fluid px-4">
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ height: '75px' }}
            >
              <div className="d-flex align-items-center gap-4">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="btn btn-link text-white p-2 border-0 shadow-none"
                >
                  <Menu size={24} />
                </button>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="p-2 rounded-3 shadow-lg d-flex align-items-center justify-content-center"
                    style={{
                      width: '42px',
                      height: '42px',
                      background: 'linear-gradient(135deg, #f26522, #fb923c)',
                    }}
                  >
                    <Trophy size={22} className="text-white" />
                  </div>
                  <div className="d-flex flex-column">
                    <span
                      className="text-white fw-bold m-0"
                      style={{
                        fontSize: '1.2rem',
                        letterSpacing: '1px',
                        lineHeight: '1.1',
                      }}
                    >
                      SAITH CHEMICAL
                    </span>
                    <span
                      className="fw-bold"
                      style={{
                        fontSize: '0.65rem',
                        letterSpacing: '2px',
                        color: '#fb923c',
                      }}
                    >
                      CONTROL PANEL
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-none d-xl-flex align-items-center bg-dark bg-opacity-25 rounded-pill px-4 py-2 border border-white border-opacity-10">
                <div className="d-flex align-items-center gap-2">
                  <Activity size={14} className="text-success" />
                  <span className="text-white-50 small fw-medium">
                    Status: <span className="text-success">Online</span>
                  </span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <Link
                  href="/"
                  className="btn btn-sm btn-link text-white-50 text-decoration-none d-none d-md-flex align-items-center gap-2 px-3"
                >
                  <Store size={18} />{' '}
                  <span className="fw-semibold small">Live Portal</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="btn btn-danger d-flex align-items-center gap-2 px-3 py-2 rounded-3 shadow-sm border-0 fw-bold"
                  style={{ fontSize: '0.8rem' }}
                >
                  <LogOut size={16} />{' '}
                  <span className="d-none d-lg-inline">TERMINATE SESSION</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container-fluid py-4 px-md-5">
          <div className="row g-4">
            {sidebarOpen && (
              <div className="col-lg-3">
                <div
                  className="card border-0 shadow-sm p-3"
                  style={{
                    borderRadius: '20px',
                    position: 'sticky',
                    top: '100px',
                    background: '#ffffff',
                  }}
                >
                  <div className="list-group list-group-flush border-0">
                    {sidebarItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`list-group-item list-group-item-action border-0 rounded-4 mb-2 py-3 px-4 d-flex align-items-center ${
                            activeTab === item.id
                              ? 'fw-bold shadow-lg text-white'
                              : 'text-secondary'
                          }`}
                          style={
                            activeTab === item.id
                              ? {
                                  background:
                                    'linear-gradient(135deg, #f26522 0%, #fb923c 100%)',
                                  color: '#fff',
                                }
                              : { background: '#f8fafc', color: '#475569' }
                          }
                        >
                          <Icon size={19} className="me-3" />
                          <span>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className={`col-lg-${sidebarOpen ? '9' : '12'}`}>
              <div
                className="content-area"
                style={{
                  background: 'rgba(255,255,255,0.65)',
                  borderRadius: '24px',
                  padding: '8px',
                }}
              >
                {activeTab === 'dashboard' && (
                  <Dashboard
                    stats={stats}
                    products={products}
                    categories={categories}
                  />
                )}
                {activeTab === 'products' && (
                  <Products
                    products={products}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleAddProduct={handleAddProduct}
                    handleEditProduct={handleEditProduct}
                    handleDeleteProduct={handleDeleteProduct}
                  />
                )}
                {activeTab === 'categories' && (
                  <CategoryManagement
                    categories={categories}
                    onCategoriesChange={async () => {
                      const categoriesRes = await themeApi.getCategories();
                      setCategories(categoriesRes || []);
                    }}
                  />
                )}
                {activeTab === 'orders' && (
                  <OrderManagement
                    orders={orders}
                    onOrdersChange={async () => {
                      const ordersRes = await themeApi.getAllOrders();
                      setOrders(ordersRes.orders || []);
                    }}
                  />
                )}
                {activeTab === 'website-settings' && <WebsiteSettings />}
              </div>
            </div>
          </div>
        </div>

        {showProductForm && (
          <ProductModal
            onClose={() => setShowProductForm(false)}
            productForm={productForm}
            setProductForm={setProductForm}
            editingProduct={editingProduct}
            nextSku={nextSku}
            categories={categories}
            uploadedImages={uploadedImages}
            uploadingImages={uploadingImages}
            handleImageUpload={handleImageUpload}
            removeUploadedImage={removeUploadedImage}
            handleSaveProduct={handleSaveProduct}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
