'use client';

import React from 'react';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const Products = ({
  products,
  searchTerm,
  setSearchTerm,
  handleAddProduct,
  handleEditProduct,
  handleDeleteProduct,
  pagination = { total: 0, page: 1, limit: 25, pages: 1 },
  currentPage = 1,
  onPageChange,
}) => {
  const total = pagination.total || 0;
  const pages = Math.max(1, pagination.pages || 1);
  const limit = pagination.limit || 25;
  const page = currentPage || pagination.page || 1;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const goToPage = (next) => {
    if (!onPageChange) return;
    const safe = Math.min(pages, Math.max(1, next));
    if (safe !== page) onPageChange(safe);
  };

  const pageButtons = () => {
    const buttons = [];
    const windowSize = 5;
    let start = Math.max(1, page - Math.floor(windowSize / 2));
    let end = Math.min(pages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    for (let i = start; i <= end; i += 1) buttons.push(i);
    return buttons;
  };

  return (
    <div className="row animate__animated animate__fadeIn">
      <div className="col-12">
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
          <div className="card-header bg-white py-3 border-0">
            <div className="row align-items-center g-3">
              <div className="col-md-4">
                <h5
                  className="mb-0 fw-bold d-flex align-items-center gap-2"
                  style={{ color: '#0f172a' }}
                >
                  <Package size={22} className="text-primary" />
                  Inventory Stock
                </h5>
                <p className="text-muted small mb-0">
                  Manage chemical and detergent inventory
                  {total > 0 ? ` · ${total} products` : ''}
                </p>
              </div>

              <div className="col-md-8">
                <div className="d-flex flex-wrap justify-content-md-end gap-2">
                  <div className="input-group" style={{ maxWidth: '350px' }}>
                    <span className="input-group-text bg-light border-0">
                      <Search size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 bg-light shadow-none"
                      placeholder="Search batch or product..."
                      style={{ fontSize: '0.9rem' }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <button
                    className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm"
                    style={{
                      backgroundColor: '#0284c7',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                    onClick={handleAddProduct}
                    type="button"
                  >
                    <Plus size={18} />
                    <span>New Entry</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: '12px', overflow: 'hidden' }}
        >
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    <th className="px-4 py-3 border-0">PRODUCT SPECIFICATIONS</th>
                    <th className="text-center py-3 border-0">CATEGORY</th>
                    <th className="text-center py-3 border-0">UNIT PRICE</th>
                    <th className="text-center py-3 border-0">STOCK LEVEL</th>
                    <th className="text-center py-3 border-0">AVAILABILITY</th>
                    <th className="text-end px-4 py-3 border-0">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {(products || []).length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id || Math.random()}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-light rounded p-1 me-3 border shadow-sm"
                              style={{ width: '50px', height: '50px' }}
                            >
                              <img
                                src={
                                  product.image_url || '/placeholder-chemical.png'
                                }
                                alt={product.name}
                                className="w-100 h-100 rounded"
                                style={{ objectFit: 'contain' }}
                              />
                            </div>
                            <div>
                              <h6
                                className="mb-0 fw-semibold"
                                style={{ color: '#334155' }}
                              >
                                {product.name}
                              </h6>
                              <code
                                className="text-muted"
                                style={{ fontSize: '0.75rem' }}
                              >
                                SKU-
                                {(product.sku || product.id || '')
                                  .toString()
                                  .padStart(5, '0')}
                              </code>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span
                            className="badge bg-soft-info text-info px-3"
                            style={{ backgroundColor: '#e0f2fe' }}
                          >
                            {product.category_relation?.name || 'Bulk'}
                          </span>
                        </td>
                        <td className="text-center fw-medium text-dark">
                          Rs. {Number(product.price || 0).toLocaleString()}
                        </td>
                        <td className="text-center">
                          <div className="d-flex flex-column align-items-center">
                            <span
                              className={`badge ${
                                (product.stock_quantity || 0) > 10
                                  ? 'bg-success'
                                  : 'bg-danger'
                              } rounded-pill`}
                              style={{ fontSize: '0.75rem' }}
                            >
                              {product.stock_quantity || 0} units
                            </span>
                            {(product.stock_quantity || 0) <= 10 && (
                              <small
                                className="text-danger mt-1 d-flex align-items-center gap-1"
                                style={{ fontSize: '0.65rem' }}
                              >
                                <AlertCircle size={10} /> Low Stock
                              </small>
                            )}
                          </div>
                        </td>
                        <td className="text-center">
                          {product.is_active ? (
                            <span className="text-success d-flex align-items-center justify-content-center gap-1 small fw-bold">
                              <CheckCircle2 size={14} /> ACTIVE
                            </span>
                          ) : (
                            <span className="text-muted d-flex align-items-center justify-content-center gap-1 small">
                              INACTIVE
                            </span>
                          )}
                        </td>
                        <td className="text-end px-4">
                          <div className="btn-group shadow-sm border rounded">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="btn btn-white btn-sm border-end px-3"
                              title="Edit Formula"
                              type="button"
                            >
                              <Edit size={15} className="text-primary" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="btn btn-white btn-sm px-3"
                              title="Archive Product"
                              type="button"
                            >
                              <Trash2 size={15} className="text-danger" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <Package
                          size={48}
                          className="text-muted opacity-25 mb-3"
                        />
                        <h6 className="text-muted">
                          No products found matching your search.
                        </h6>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {total > 0 && (
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 px-4 py-3 border-top bg-white">
                <small className="text-muted">
                  Showing {from}–{to} of {total}
                </small>
                <div className="d-flex align-items-center gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {pageButtons().map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`btn btn-sm ${
                        n === page ? 'btn-primary' : 'btn-outline-secondary'
                      }`}
                      style={
                        n === page
                          ? {
                              backgroundColor: '#E86C24',
                              borderColor: '#E86C24',
                            }
                          : undefined
                      }
                      onClick={() => goToPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                    disabled={page >= pages}
                    onClick={() => goToPage(page + 1)}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
