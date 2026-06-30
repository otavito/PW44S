import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IProduct } from '@/commons/types';
import ProductService from '@/services/product-service';

const ProductSlide: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'warning' | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductService.findAllPageable(currentPage);
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("An error occurred while loading the products", error);
            }
        };

        fetchProducts();
    }, [currentPage]);

    const addItemCart = (product: IProduct) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.find((item: IProduct) => item.id === product.id)) {
            setAlertType('warning');
            setAlertMessage('This product is already in your cart.');
        } else {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            setAlertType('success');
            setAlertMessage('Product added to your cart.');
        }

        setTimeout(() => {
            setAlertMessage(null);
            setAlertType(null);
        }, 3000);
    };

    const loadProduct = (productId: number) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div>
            {/* Alert Bootstrap */}
            {alertMessage && (
                <div className={`alert alert-${alertType} mx-5`} role="alert">
                    {alertMessage}
                </div>
            )}

            {/* Cards de produto */}
            <div className="mt-5 row row-cols-1 row-cols-md-3 g-4 mx-5" id="product-cards">
                {products.map(product => (
                    <div className="col" key={product.id}>
                        <div className="card h-100">
                            <img
                                src={product.img}
                                className="card-img-top"
                                alt={product.title}
                                onClick={() => loadProduct(product.id!)}
                                style={{ cursor: 'pointer' }}
                            />
                            <div className="card-body" onClick={() => loadProduct(product.id!)}>
                                <h5 className="card-title">{product.title}</h5>
                                <p className="card-text">{product.text}</p>
                            </div>
                            <div className="card-footer d-flex justify-content-between flex-column flex-lg-row">
                                <div className="d-flex bg-transparent align-items-end">
                                    <s className="text-muted bg-transparent me-2">${product.price}</s>
                                    <strong className="bg-transparent">{product.installment}</strong>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-dark btn-outline-success"
                                    onClick={() => addItemCart(product)}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginação */}
            <div className="pagination-controls d-flex justify-content-center align-items-center mt-3">
                <button
                    className="btn btn-secondary me-2"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage + 1} of {totalPages}
                </span>
                <button
                    className="btn btn-secondary ms-2"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductSlide;
