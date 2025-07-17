import React, { memo } from 'react';
import { supabase } from '../lib/supabaseClient';
export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  rating: number;
  reviews: number;
  recommended?: boolean;
  firmness?: string;
  image: string;
  features: string[];
  description: string;
  specifications?: {
    dimensions: string;
    weight: string;
    material: string;
    cover: string;
    filling: string;
    firmness: string;
    warranty: string;
    careInstructions: string;
  };
  stock?: number;
  sales?: number;
  status?: 'active' | 'draft' | 'out_of_stock';
  sleepPositions?: string[]; // Added sleep positions compatibility
}
export interface Brand {
  id: string;
  name: string;
  logo: string;
  pillowCount?: number;
}
export interface Review {
  id: number;
  user: string;
  avatar: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  productId: number;
}
// Template products that can be used to create new products
export const productTemplates: Product[] = [{
  id: 1,
  name: 'Cloud Comfort Elite',
  brand: 'casper',
  price: 129.99,
  rating: 4.8,
  reviews: 1250,
  recommended: true,
  firmness: 'Medium',
  image: 'https://images.unsplash.com/photo-1631006387899-06240b7f6414?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  features: ['Cooling technology', 'Adjustable height', 'Memory foam'],
  description: 'The Cloud Comfort Elite pillow provides exceptional support with its adaptive memory foam core that conforms to your unique shape. The cooling gel-infused cover ensures you stay cool all night long.',
  specifications: {
    dimensions: '24" x 16" x 5"',
    weight: '3.2 lbs',
    material: 'Memory foam with cooling gel layer',
    cover: '100% cotton, hypoallergenic',
    filling: 'Shredded memory foam',
    firmness: 'Medium-firm',
    warranty: '5 years',
    careInstructions: 'Cover is machine washable, air dry only'
  },
  stock: 45,
  sales: 230,
  status: 'active',
  sleepPositions: ['back', 'side']
}, {
  id: 2,
  name: 'Purple Harmony',
  brand: 'purple',
  price: 159.99,
  rating: 4.9,
  reviews: 890,
  recommended: true,
  firmness: 'Medium-firm',
  image: 'https://images.unsplash.com/photo-1591389703635-e15a07609a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  features: ['Grid technology', 'Temperature neutral', 'No pressure points'],
  description: 'The Purple Harmony pillow combines the best of both worlds with a responsive grid design for optimal support and breathability.',
  stock: 12,
  sales: 185,
  status: 'active',
  sleepPositions: ['side', 'back']
}];
// Template brands that can be used to create new brands
export const brandTemplates: Brand[] = [{
  id: 'casper',
  name: 'Casper',
  logo: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
  pillowCount: 4
}, {
  id: 'purple',
  name: 'Purple',
  logo: 'https://images.unsplash.com/photo-1555424221-250de2a343ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
  pillowCount: 3
}];
// Template reviews that can be used to create new reviews
export const reviewTemplates: Review[] = [{
  id: 1,
  user: 'Emily R.',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
  date: '3 weeks ago',
  rating: 5,
  title: 'Best sleep in years!',
  comment: "I've struggled with neck pain for years and tried countless pillows. This one finally gave me the support I needed. The cooling technology really works too - no more flipping to the cold side!",
  helpful: 124,
  verified: true,
  productId: 1
}, {
  id: 2,
  user: 'Michael T.',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
  date: '1 month ago',
  rating: 4,
  title: 'Great support, slightly too firm',
  comment: "The quality is excellent and my neck pain has improved. I do find it slightly too firm for my preference, but it's still much better than my old pillow. The cooling feature is a game changer for hot sleepers.",
  helpful: 87,
  verified: true,
  productId: 1
}];
class ProductService {
  private products: Product[] = [];
  private brands: Brand[] = [];
  private reviews: Review[] = [];
  private initialized = false;
  constructor() {
    this.initializeData();
  }
  async initializeData() {
    if (this.initialized) return;
    try {
      // First check if the tables exist in Supabase
      await this.ensureTablesExist();
      // Then try to get data from Supabase
      const {
        data: productsData,
        error: productsError
      } = await supabase.from('products').select('*');
      if (!productsError && productsData && productsData.length > 0) {
        this.products = productsData;
        console.log('Loaded products from Supabase:', productsData.length);
      } else {
        // If no products in database or error occurred, use local storage
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
          this.products = JSON.parse(storedProducts);
          console.log('Loaded products from localStorage:', this.products.length);
          // Sync local storage data to Supabase if possible
          await this.syncProductsToSupabase();
        } else {
          // If no products in local storage, use template data
          this.products = [...productTemplates];
          localStorage.setItem('products', JSON.stringify(this.products));
          console.log('Initialized products from templates');
          // Save template data to Supabase
          await this.syncProductsToSupabase();
        }
      }
      // Load brands
      const {
        data: brandsData,
        error: brandsError
      } = await supabase.from('brands').select('*');
      if (!brandsError && brandsData && brandsData.length > 0) {
        this.brands = brandsData;
        console.log('Loaded brands from Supabase:', brandsData.length);
      } else {
        // If no brands in database or error occurred, use local storage
        const storedBrands = localStorage.getItem('brands');
        if (storedBrands) {
          this.brands = JSON.parse(storedBrands);
          console.log('Loaded brands from localStorage:', this.brands.length);
          // Sync local storage data to Supabase if possible
          await this.syncBrandsToSupabase();
        } else {
          // If no brands in local storage, use template data
          this.brands = [...brandTemplates];
          localStorage.setItem('brands', JSON.stringify(this.brands));
          console.log('Initialized brands from templates');
          // Save template data to Supabase
          await this.syncBrandsToSupabase();
        }
      }
      // Load reviews
      const {
        data: reviewsData,
        error: reviewsError
      } = await supabase.from('reviews').select('*');
      if (!reviewsError && reviewsData && reviewsData.length > 0) {
        this.reviews = reviewsData;
        console.log('Loaded reviews from Supabase:', reviewsData.length);
      } else {
        // If no reviews in database or error occurred, use local storage
        const storedReviews = localStorage.getItem('reviews');
        if (storedReviews) {
          this.reviews = JSON.parse(storedReviews);
          console.log('Loaded reviews from localStorage:', this.reviews.length);
          // Sync local storage data to Supabase if possible
          await this.syncReviewsToSupabase();
        } else {
          // If no reviews in local storage, use template data
          this.reviews = [...reviewTemplates];
          localStorage.setItem('reviews', JSON.stringify(this.reviews));
          console.log('Initialized reviews from templates');
          // Save template data to Supabase
          await this.syncReviewsToSupabase();
        }
      }
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing product data:', error);
      // Fallback to local storage if Supabase fails
      this.loadFromLocalStorage();
      this.initialized = true;
    }
  }
  // Ensure the necessary tables exist in Supabase
  private async ensureTablesExist() {
    try {
      // Check if products table exists
      const {
        error: productsCheckError
      } = await supabase.from('products').select('id').limit(1);
      if (productsCheckError && productsCheckError.code === '42P01') {
        // Table doesn't exist, create it
        await supabase.rpc('create_products_table');
      }
      // Check if brands table exists
      const {
        error: brandsCheckError
      } = await supabase.from('brands').select('id').limit(1);
      if (brandsCheckError && brandsCheckError.code === '42P01') {
        // Table doesn't exist, create it
        await supabase.rpc('create_brands_table');
      }
      // Check if reviews table exists
      const {
        error: reviewsCheckError
      } = await supabase.from('reviews').select('id').limit(1);
      if (reviewsCheckError && reviewsCheckError.code === '42P01') {
        // Table doesn't exist, create it
        await supabase.rpc('create_reviews_table');
      }
    } catch (error) {
      console.error('Error ensuring tables exist:', error);
      // Continue with initialization even if table creation fails
    }
  }
  // Sync local products to Supabase
  private async syncProductsToSupabase() {
    try {
      // Use upsert to insert or update products
      const {
        error
      } = await supabase.from('products').upsert(this.products, {
        onConflict: 'id'
      });
      if (error) {
        console.error('Error syncing products to Supabase:', error);
      } else {
        console.log('Successfully synced products to Supabase');
      }
    } catch (error) {
      console.error('Error syncing products to Supabase:', error);
    }
  }
  // Sync local brands to Supabase
  private async syncBrandsToSupabase() {
    try {
      // Use upsert to insert or update brands
      const {
        error
      } = await supabase.from('brands').upsert(this.brands, {
        onConflict: 'id'
      });
      if (error) {
        console.error('Error syncing brands to Supabase:', error);
      } else {
        console.log('Successfully synced brands to Supabase');
      }
    } catch (error) {
      console.error('Error syncing brands to Supabase:', error);
    }
  }
  // Sync local reviews to Supabase
  private async syncReviewsToSupabase() {
    try {
      // Use upsert to insert or update reviews
      const {
        error
      } = await supabase.from('reviews').upsert(this.reviews, {
        onConflict: 'id'
      });
      if (error) {
        console.error('Error syncing reviews to Supabase:', error);
      } else {
        console.log('Successfully synced reviews to Supabase');
      }
    } catch (error) {
      console.error('Error syncing reviews to Supabase:', error);
    }
  }
  // Load data from local storage as fallback
  private loadFromLocalStorage() {
    // Load products
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
    } else {
      this.products = [...productTemplates];
      localStorage.setItem('products', JSON.stringify(this.products));
    }
    // Load brands
    const storedBrands = localStorage.getItem('brands');
    if (storedBrands) {
      this.brands = JSON.parse(storedBrands);
    } else {
      this.brands = [...brandTemplates];
      localStorage.setItem('brands', JSON.stringify(this.brands));
    }
    // Load reviews
    const storedReviews = localStorage.getItem('reviews');
    if (storedReviews) {
      this.reviews = JSON.parse(storedReviews);
    } else {
      this.reviews = [...reviewTemplates];
      localStorage.setItem('reviews', JSON.stringify(this.reviews));
    }
  }
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    await this.initializeData();
    return this.products;
  }
  // Get a product by ID
  async getProductById(id: number): Promise<Product | null> {
    await this.initializeData();
    return this.products.find(product => product.id === id) || null;
  }
  // Get related products (excluding the current product)
  async getRelatedProducts(currentProductId: number, limit: number = 3): Promise<Product[]> {
    await this.initializeData();
    return this.products.filter(product => product.id !== currentProductId).slice(0, limit);
  }
  // Get all brands
  async getAllBrands(): Promise<Brand[]> {
    await this.initializeData();
    return this.brands;
  }
  // Get a brand by ID
  async getBrandById(id: string): Promise<Brand | null> {
    await this.initializeData();
    return this.brands.find(brand => brand.id === id) || null;
  }
  // Get reviews for a product
  async getProductReviews(productId: number): Promise<Review[]> {
    await this.initializeData();
    return this.reviews.filter(review => review.productId === productId);
  }
  // Add a new product
  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    await this.initializeData();
    // Generate a new ID
    const newId = Math.max(0, ...this.products.map(p => p.id)) + 1;
    const newProduct: Product = {
      ...product,
      id: newId,
      stock: product.stock || 100,
      sales: product.sales || 0,
      status: product.status || 'active',
      sleepPositions: product.sleepPositions || []
    };
    // Add to local array
    this.products.push(newProduct);
    // Save to local storage
    localStorage.setItem('products', JSON.stringify(this.products));
    // Save to Supabase
    try {
      const {
        error
      } = await supabase.from('products').insert([newProduct]);
      if (error) {
        console.error('Error saving product to Supabase:', error);
        // If insert fails, try update
        const {
          error: updateError
        } = await supabase.from('products').update(newProduct).eq('id', newId);
        if (updateError) {
          console.error('Error updating product in Supabase:', updateError);
        }
      }
    } catch (error) {
      console.error('Error saving product to Supabase:', error);
    }
    return newProduct;
  }
  // Update a product
  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
    await this.initializeData();
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return null;
    const updatedProduct = {
      ...this.products[index],
      ...updates
    };
    // Update local array
    this.products[index] = updatedProduct;
    // Save to local storage
    localStorage.setItem('products', JSON.stringify(this.products));
    // Update in Supabase
    try {
      const {
        error
      } = await supabase.from('products').update(updatedProduct).eq('id', id);
      if (error) {
        console.error('Error updating product in Supabase:', error);
        // If update fails, try insert
        const {
          error: insertError
        } = await supabase.from('products').insert([updatedProduct]);
        if (insertError) {
          console.error('Error inserting product in Supabase:', insertError);
        }
      }
    } catch (error) {
      console.error('Error updating product in Supabase:', error);
    }
    return updatedProduct;
  }
  // Delete a product
  async deleteProduct(id: number): Promise<boolean> {
    await this.initializeData();
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return false;
    // Remove from local array
    this.products.splice(index, 1);
    // Save to local storage
    localStorage.setItem('products', JSON.stringify(this.products));
    // Delete from Supabase
    try {
      const {
        error
      } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error('Error deleting product from Supabase:', error);
      }
    } catch (error) {
      console.error('Error deleting product from Supabase:', error);
    }
    return true;
  }
  // Add a new review
  async addReview(review: Omit<Review, 'id'>): Promise<Review> {
    await this.initializeData();
    // Generate a new ID
    const newId = Math.max(0, ...this.reviews.map(r => r.id)) + 1;
    const newReview: Review = {
      ...review,
      id: newId
    };
    // Add to local array
    this.reviews.push(newReview);
    // Save to local storage
    localStorage.setItem('reviews', JSON.stringify(this.reviews));
    // Save to Supabase
    try {
      const {
        error
      } = await supabase.from('reviews').insert([newReview]);
      if (error) {
        console.error('Error saving review to Supabase:', error);
        // If insert fails, try update
        const {
          error: updateError
        } = await supabase.from('reviews').update(newReview).eq('id', newId);
        if (updateError) {
          console.error('Error updating review in Supabase:', updateError);
        }
      }
    } catch (error) {
      console.error('Error saving review to Supabase:', error);
    }
    return newReview;
  }
  // Add a new brand
  async addBrand(brand: Omit<Brand, 'id'>): Promise<Brand> {
    await this.initializeData();
    // Generate a new ID if not provided
    const brandId = brand.id || `brand-${Date.now()}`;
    const newBrand: Brand = {
      ...brand,
      id: brandId,
      pillowCount: brand.pillowCount || 0
    };
    // Add to local array
    this.brands.push(newBrand);
    // Save to local storage
    localStorage.setItem('brands', JSON.stringify(this.brands));
    // Save to Supabase
    try {
      const {
        error
      } = await supabase.from('brands').insert([newBrand]);
      if (error) {
        console.error('Error saving brand to Supabase:', error);
        // If insert fails, try update
        const {
          error: updateError
        } = await supabase.from('brands').update(newBrand).eq('id', brandId);
        if (updateError) {
          console.error('Error updating brand in Supabase:', updateError);
        }
      }
    } catch (error) {
      console.error('Error saving brand to Supabase:', error);
    }
    return newBrand;
  }
  // Update a brand
  async updateBrand(id: string, updates: Partial<Brand>): Promise<Brand | null> {
    await this.initializeData();
    const index = this.brands.findIndex(brand => brand.id === id);
    if (index === -1) return null;
    const updatedBrand = {
      ...this.brands[index],
      ...updates
    };
    // Update local array
    this.brands[index] = updatedBrand;
    // Save to local storage
    localStorage.setItem('brands', JSON.stringify(this.brands));
    // Update in Supabase
    try {
      const {
        error
      } = await supabase.from('brands').update(updatedBrand).eq('id', id);
      if (error) {
        console.error('Error updating brand in Supabase:', error);
        // If update fails, try insert
        const {
          error: insertError
        } = await supabase.from('brands').insert([updatedBrand]);
        if (insertError) {
          console.error('Error inserting brand in Supabase:', insertError);
        }
      }
    } catch (error) {
      console.error('Error updating brand in Supabase:', error);
    }
    return updatedBrand;
  }
}
export const productService = new ProductService();