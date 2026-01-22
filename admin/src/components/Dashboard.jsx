import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Edit, Trash2, Search, Power } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
        } catch (error) {
            toast.error('Error fetching products');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteDoc(doc(db, 'products', id));
            setProducts(products.filter(p => p.id !== id));
            toast.success('Product deleted');
        } catch (error) {
            toast.error('Error deleting product');
        }
    };

    const toggleStock = async (product) => {
        try {
            const newStatus = !product.inStock;
            await updateDoc(doc(db, 'products', product.id), {
                inStock: newStatus
            });
            setProducts(products.map(p =>
                p.id === product.id ? { ...p, inStock: newStatus } : p
            ));
            toast.success(newStatus ? 'Product marked In Stock' : 'Product marked Out of Stock');
        } catch (error) {
            toast.error('Error updating status');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="container"><div className="loading-spinner"></div></div>;

    return (
        <div className="container">
            <div className="header">
                <h1>Product Dashboard</h1>
                <Link to="/add-product" className="btn btn-primary">
                    <Plus size={20} /> Add Product
                </Link>
            </div>

            <div className="form-group" style={{ maxWidth: '400px' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '10px', top: '10px', color: '#666' }} />
                    <input
                        type="text"
                        className="form-input"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="products-grid">
                {filteredProducts.map(product => {
                    // Safe check for images array
                    const mainImage = product.image || (product.images && product.images[0]) || '';

                    return (
                        <div key={product.id} className="product-card">
                            <img src={mainImage} alt={product.name} className="product-image" onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=No+Image'} />
                            <div className="product-details">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <h3 className="product-title">{product.name}</h3>
                                        <p className="product-meta">{product.category} • ₹{product.price}</p>
                                    </div>
                                    <span className={`badge ${product.inStock ? 'badge-success' : 'badge-danger'}`}>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>

                                <div className="product-actions">
                                    <Link to={`/edit-product/${product.id}`} className="btn btn-secondary" style={{ flex: 1 }}>
                                        <Edit size={16} /> Edit
                                    </Link>
                                    <button
                                        onClick={() => toggleStock(product)}
                                        className="btn btn-secondary"
                                        title={product.inStock ? "Mark Out of Stock" : "Mark In Stock"}
                                    >
                                        <Power size={16} color={product.inStock ? "green" : "red"} />
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="btn btn-danger">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    No products found.
                </div>
            )}
        </div>
    );
}
