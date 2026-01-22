import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Plus, Trash2, Save, ArrowLeft, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const { register, control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            category: 'dresses',
            subcategory: 'poshak',
            description: '',
            price: '',
            variants: [
                {
                    color: 'Default',
                    image: '',
                    sizes: [{ size: '', price: '', stock: 1 }]
                }
            ]
        }
    });

    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control,
        name: "variants"
    });

    // Watch for changes to update UI or debug
    const watchedVariants = watch("variants");

    useEffect(() => {
        if (id) {
            loadProduct();
        }
    }, [id]);

    const loadProduct = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'products', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                reset(data);
            } else {
                toast.error('Product not found');
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error loading product');
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async (file) => {
        if (!file) return null;
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleImageUpload = async (index, file) => {
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImage(file);
            setValue(`variants.${index}.image`, url);
            toast.success('Image uploaded');
        } catch (error) {
            console.error(error);
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Ensure numeric values are numbers
            const formattedData = {
                ...data,
                price: Number(data.price),
                updatedAt: new Date(),
                variants: data.variants.map(v => ({
                    ...v,
                    sizes: v.sizes.map(s => ({
                        ...s,
                        price: Number(s.price),
                        stock: Number(s.stock)
                    }))
                }))
            };

            // Flatten for legacy support (optional, but good for searching)
            formattedData.colors = formattedData.variants.map(v => v.color);
            formattedData.sizes = [...new Set(formattedData.variants.flatMap(v => v.sizes.map(s => s.size)))];
            // Use the first variant's image as main image
            formattedData.image = formattedData.variants[0]?.image || '';

            // Legacy structure support
            formattedData.colorImages = {};
            formattedData.variants.forEach(v => {
                formattedData.colorImages[v.color] = v.image;
            });

            if (id) {
                await updateDoc(doc(db, 'products', id), formattedData);
                toast.success('Product updated successfully');
            } else {
                formattedData.createdAt = new Date();
                formattedData.inStock = true;
                await addDoc(collection(db, 'products'), formattedData);
                toast.success('Product created successfully');
            }
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error('Error saving product');
        } finally {
            setLoading(false);
        }
    };

    // Custom nested field array for sizes
    const SizeFieldArray = ({ nestIndex, control, register }) => {
        const { fields, append, remove } = useFieldArray({
            control,
            name: `variants.${nestIndex}.sizes`
        });

        return (
            <div className="sizes-section">
                <label className="form-label" style={{ fontSize: '0.9rem' }}>Sizes for this color</label>
                {fields.map((item, k) => (
                    <div key={item.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                            {...register(`variants.${nestIndex}.sizes.${k}.size`)}
                            placeholder="Size (e.g. 2)"
                            className="form-input"
                            style={{ flex: 1 }}
                        />
                        <input
                            type="number"
                            {...register(`variants.${nestIndex}.sizes.${k}.price`)}
                            placeholder="Price"
                            className="form-input"
                            style={{ flex: 1 }}
                        />
                        <input
                            type="number"
                            {...register(`variants.${nestIndex}.sizes.${k}.stock`)}
                            placeholder="Qty"
                            className="form-input"
                            style={{ width: '80px' }}
                        />
                        <button type="button" className="btn btn-danger" onClick={() => remove(k)} style={{ padding: '0.5rem' }}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                    onClick={() => append({ size: '', price: '', stock: 1 })}
                >
                    + Add Size
                </button>
            </div>
        );
    };

    if (loading && id) return <div className="container"><div className="loading-spinner"></div></div>;

    return (
        <div className="container">
            <div className="header">
                <h1>{id ? 'Edit Product' : 'Add New Product'}</h1>
                <button className="btn btn-secondary" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} /> Back
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card" style={{ maxWidth: '100%' }}>
                <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Product Name</label>
                        <input {...register('name', { required: true })} className="form-input" placeholder="Product Name" />
                        {errors.name && <span style={{ color: 'red' }}>Required</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select {...register('category')} className="form-input">
                            <option value="dresses">Dresses (Poshak)</option>
                            <option value="mukut">Mukut</option>
                            <option value="mala">Mala</option>
                            <option value="bansuri">Bansuri</option>
                            <option value="combo">Combo</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea {...register('description')} className="form-input" rows="3"></textarea>
                </div>

                <div className="form-group">
                    <label className="form-label">Base Price (Display Price)</label>
                    <input type="number" {...register('price', { required: true })} className="form-input" placeholder="0" />
                </div>

                <div style={{ borderTop: '1px solid #eee', margin: '2rem 0' }}></div>

                <h3>Variants (Colors & Sizes)</h3>
                <div style={{ marginTop: '1rem' }}>
                    {variantFields.map((item, index) => (
                        <div key={item.id} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h4 style={{ margin: 0 }}>Variant #{index + 1}</h4>
                                <button type="button" className="btn btn-danger" onClick={() => removeVariant(index)}>
                                    <Trash2 size={16} /> Remove Variant
                                </button>
                            </div>

                            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Color Name</label>
                                    <input {...register(`variants.${index}.color`, { required: true })} className="form-input" placeholder="e.g. Red, Blue, Design 1" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Variant Image</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="text"
                                            {...register(`variants.${index}.image`)}
                                            className="form-input"
                                            placeholder="Image URL"
                                            readOnly
                                        />
                                        <label className="btn btn-primary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            {uploading ? '...' : <Upload size={16} />}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleImageUpload(index, e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                    {watchedVariants[index]?.image && (
                                        <img src={watchedVariants[index].image} alt="Preview" style={{ height: '60px', marginTop: '0.5rem', borderRadius: '4px' }} />
                                    )}
                                </div>
                            </div>

                            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                <RoleBasedSizeInputs nestIndex={index} control={control} register={register} />
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => appendVariant({ color: '', image: '', sizes: [{ size: '', price: '', stock: 1 }] })}
                    >
                        <Plus size={20} /> Add Another Color Variant
                    </button>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading || uploading}>
                        <Save size={20} /> {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// Helper component to fix field array nesting context
function RoleBasedSizeInputs({ nestIndex, control, register }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `variants.${nestIndex}.sizes`
    });

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.9rem', marginBottom: 0 }}>Sizes & Stock</label>
                <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                    onClick={() => append({ size: '', price: '', stock: 1 })}
                >
                    + size
                </button>
            </div>

            {fields.map((item, k) => (
                <div key={item.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                        {...register(`variants.${nestIndex}.sizes.${k}.size`, { required: true })}
                        placeholder="Size"
                        className="form-input"
                        style={{ flex: 1 }}
                    />
                    <input
                        type="number"
                        {...register(`variants.${nestIndex}.sizes.${k}.price`, { required: true })}
                        placeholder="₹ Price"
                        className="form-input"
                        style={{ flex: 1 }}
                    />
                    <input
                        type="number"
                        {...register(`variants.${nestIndex}.sizes.${k}.stock`, { required: true })}
                        placeholder="Qty"
                        className="form-input"
                        style={{ width: '80px' }}
                    />
                    <button type="button" className="btn btn-danger" onClick={() => remove(k)} style={{ padding: '0.5rem' }}>
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
        </>
    );
}
