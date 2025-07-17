import React, { useEffect, useState } from 'react';
import { StarIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon, ArrowLeftIcon, HeartIcon, BarChartIcon, ThumbsUpIcon, ThumbsDownIcon, ChevronRightIcon, BedIcon } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { productService, Product, Review } from '../services/ProductService';
export const ProductDetailPage = ({
  onBack
}) => {
  const [searchParams] = useSearchParams();
  const productId = parseInt(searchParams.get('id') || '0');
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const {
    addItem
  } = useCart();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productData, relatedData, reviewsData] = await Promise.all([productService.getProductById(productId), productService.getRelatedProducts(productId), productService.getProductReviews(productId)]);
        setProduct(productData);
        setRelatedProducts(relatedData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (productId) {
      fetchData();
    }
  }, [productId]);
  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      alert(`${product.name} added to cart!`);
    }
  };
  if (isLoading) {
    return <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-lg shadow-gray-200/50 text-center py-12">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">Loading product details...</p>
      </div>;
  }
  if (!product) {
    return <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-lg shadow-gray-200/50 text-center py-12">
        <p className="text-gray-500 text-lg">Product not found</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-200 transition-colors">
          Back to Catalog
        </button>
      </div>;
  }
  const brand = {
    casper: 'Casper',
    purple: 'Purple',
    tempurpedic: 'Tempur-Pedic',
    brooklinen: 'Brooklinen',
    tuft: 'Tuft & Needle'
  }[product.brand] || product.brand;
  return <div className="space-y-8">
      {/* Back Button */}
      <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        <span>Back to Catalog</span>
      </button>

      {/* Product Header */}
      <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-lg shadow-gray-200/50">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 space-y-6">
            <div>
              <p className="text-sm font-medium text-blue-500">{brand}</p>
              <h1 className="text-3xl font-medium text-gray-900 mt-1">
                {product.name}
              </h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">
                    {product.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({product.reviews} reviews)
                  </span>
                </div>
                {product.recommended && <div className="ml-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium py-1 px-3 rounded-full shadow-md">
                    Recommended
                  </div>}
              </div>
            </div>

            <div>
              <p className="text-3xl font-medium text-gray-900">
                ${product.price}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Free shipping on orders over $50
              </p>
            </div>

            {/* Sleep Position Compatibility */}
            {product.sleepPositions && product.sleepPositions.length > 0 && <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  Recommended For
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.sleepPositions.map(position => <div key={position} className="flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-xl">
                      <BedIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium capitalize">
                        {position} Sleepers
                      </span>
                    </div>)}
                </div>
              </div>}

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => <li key={index} className="flex items-start">
                    <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mr-3 mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span className="text-gray-600">{feature}</span>
                  </li>)}
              </ul>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
              <button onClick={handleAddToCart} className="w-full flex items-center justify-center p-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">Add to Cart</span>
              </button>
              <button className="w-full flex items-center justify-center p-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                <HeartIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">Add to Wishlist</span>
              </button>
            </div>

            <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <TruckIcon className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-sm text-gray-600">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {['description', 'specifications', 'reviews'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>)}
        </div>
        <div className="p-6">
          {activeTab === 'description' && <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <BarChartIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <h4 className="font-medium text-gray-900">Firmness</h4>
                  </div>
                  <p className="text-gray-600">
                    {product.firmness || 'Medium'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <BedIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <h4 className="font-medium text-gray-900">
                      Sleep Position
                    </h4>
                  </div>
                  <p className="text-gray-600">
                    {product.sleepPositions && product.sleepPositions.length > 0 ? product.sleepPositions.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ') + ' Sleepers' : 'All Sleepers'}
                  </p>
                </div>
              </div>
            </div>}

          {activeTab === 'specifications' && <div className="space-y-6">
              {product.specifications ? <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => <div key={key} className="border-b border-gray-100 pb-3">
                        <p className="text-sm text-gray-500 mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="font-medium text-gray-900">{value}</p>
                      </div>)}
                </div> : <p className="text-gray-500">
                  No detailed specifications available.
                </p>}
            </div>}

          {activeTab === 'reviews' && <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-gray-900">
                  Customer Reviews
                </h3>
                <button className="text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors">
                  Write a Review
                </button>
              </div>
              {reviews.length > 0 ? <div className="space-y-6">
                  {reviews.map(review => <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <img src={review.avatar} alt={review.user} className="h-10 w-10 rounded-full mr-3 object-cover" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {review.user}
                              {review.verified && <span className="ml-2 text-xs bg-green-100 text-green-600 py-0.5 px-2 rounded-full">
                                  Verified Purchase
                                </span>}
                            </p>
                            <p className="text-sm text-gray-500">
                              {review.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {Array.from({
                    length: 5
                  }).map((_, i) => <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        {review.title}
                      </h4>
                      <p className="text-gray-600 mb-4">{review.comment}</p>
                      <div className="flex items-center text-sm">
                        <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                          <ThumbsUpIcon className="h-4 w-4 mr-1" />
                          <span>Helpful ({review.helpful})</span>
                        </button>
                        <span className="mx-2 text-gray-300">|</span>
                        <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                          <ThumbsDownIcon className="h-4 w-4 mr-1" />
                          <span>Not Helpful</span>
                        </button>
                      </div>
                    </div>)}
                </div> : <div className="text-center py-8">
                  <p className="text-gray-500">
                    No reviews yet for this product.
                  </p>
                  <button className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-200 transition-colors">
                    Be the first to review
                  </button>
                </div>}
            </div>}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">
              You May Also Like
            </h2>
            <Link to="/catalog" className="flex items-center text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors">
              <span>View All</span>
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map(relatedProduct => <div key={relatedProduct.id} className="backdrop-blur-xl bg-white/70 rounded-xl shadow-md overflow-hidden">
                <Link to={`/product?id=${relatedProduct.id}`}>
                  <div className="aspect-w-16 aspect-h-9">
                    <img src={relatedProduct.image} alt={relatedProduct.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-blue-500">{brand}</p>
                    <h3 className="text-lg font-medium text-gray-900 mt-1 hover:text-blue-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-medium text-gray-900">
                        ${relatedProduct.price}
                      </p>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">
                          {relatedProduct.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>)}
          </div>
        </div>}
    </div>;
};