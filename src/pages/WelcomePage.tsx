import React, { Children } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, RulerIcon, StarIcon, CheckIcon, SparklesIcon, ShieldCheckIcon, ThumbsUpIcon, BoxIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const WelcomePage = ({
  onGetStarted
}) => {
  const navigate = useNavigate();
  const fadeIn = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      duration: 0.6
    }
  };
  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const handleGetStarted = () => {
    // Call the original onGetStarted function to update state
    onGetStarted();
    // Also use React Router navigation
    navigate('/measurement');
  };
  // Sample featured products with IDs that match products in the catalog
  const featuredProducts = [{
    id: 1,
    name: 'Cloud Comfort Elite',
    image: 'https://www.silkandsnow.com/wp-content/themes/silkandsnow/img/waffle_sham_eucalyptus_1.jpg',
    price: '$129.99',
    rating: 4.8,
    reviews: 1250,
    tag: 'Best Seller'
  }, {
    id: 2,
    name: 'Memory Foam Contour',
    image: 'https://m.media-amazon.com/images/I/51mjjfaTOAL._AC_SL1500_.jpg',
    price: '$159.99',
    rating: 4.9,
    reviews: 890,
    tag: "Editor's Choice"
  }, {
    id: 3,
    name: 'Organic Cotton Deluxe',
    image: 'https://hush.ca/cdn/shop/files/AUG28_00067crop_dbe51315-fc88-4394-a635-97b2347f2511.jpg?v=1736960335&width=1300',
    price: '$119.99',
    rating: 4.7,
    reviews: 760,
    tag: 'Eco-Friendly'
  }];
  // Function to navigate to product detail page
  const handleViewProductDetails = productId => {
    navigate(`/product?id=${productId}`);
  };
  return <motion.div initial="initial" animate="animate" variants={stagger} className="w-full">
      {/* Hero Section */}
      <div className="backdrop-blur-xl bg-white/70 rounded-3xl overflow-hidden mb-8 sm:mb-12 shadow-lg shadow-gray-200/50 border border-gray-100">
        <div className="relative">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 mix-blend-multiply"></div>
          {/* Hero image */}
          <img src="https://www.ikea.com/ca/en/images/products/lapptatel-pillow-high__0789272_pe763901_s5.jpg?f=s" alt="Perfect Pillow" className="w-full h-[350px] sm:h-[400px] md:h-[500px] object-cover" />
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 md:px-16">
            <motion.div variants={fadeIn} className="max-w-xl">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white flex items-center justify-center mr-3 shadow-md">
                  <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <span className="text-white font-medium text-base sm:text-lg tracking-wide">
                  PerfectPillow
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-6 leading-tight">
                Dream Better <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                  Sleep Smarter
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-5 sm:mb-8 max-w-lg">
                Using advanced technology to match you with the perfect pillow
                for your unique sleep needs
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button onClick={handleGetStarted} className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-blue-700 bg-white hover:bg-blue-50 transition-all shadow-xl font-medium text-base sm:text-lg">
                  Get Started
                  <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </button>
                <button onClick={() => navigate('/catalog')} className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all border border-white/30 font-medium text-base sm:text-lg">
                  Shop Collection
                </button>
              </div>
            </motion.div>
          </div>
          {/* Floating stats */}
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 bg-white/90 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow-xl hidden sm:block">
            <div className="flex items-center">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => <StarIcon key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />)}
              </div>
              <span className="text-sm text-gray-700 font-medium">
                4.9/5 from 2,500+ reviews
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* How It Works Section */}
      <motion.div variants={fadeIn} className="mb-10 sm:mb-16">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-xl mx-auto px-4">
            Our AI-powered process matches you with your perfect pillow in just
            3 simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2">
          {[{
          icon: RulerIcon,
          title: '1. Get Measured',
          description: 'Take quick measurements using our guided process or advanced LiDAR scanning',
          color: 'bg-blue-500',
          lightColor: 'bg-blue-100'
        }, {
          icon: SparklesIcon,
          title: '2. Get Matched',
          description: 'Our algorithm analyzes your data to find your perfect pillow match',
          color: 'bg-purple-500',
          lightColor: 'bg-purple-100'
        }, {
          icon: BoxIcon,
          title: '3. Sleep Better',
          description: 'Enjoy personalized comfort and wake up refreshed every morning',
          color: 'bg-indigo-500',
          lightColor: 'bg-indigo-100'
        }].map((item, index) => <div key={index} className="backdrop-blur-xl bg-white/70 rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className={`h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 ${item.lightColor} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 z-10 relative`}>
                <item.icon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-${item.color.split('-')[0]}-500`} />
              </div>
              {/* Background decoration */}
              <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full ${item.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 relative z-10">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 relative z-10">
                {item.description}
              </p>
            </div>)}
        </div>
      </motion.div>
      {/* Featured Products */}
      <motion.div variants={fadeIn} className="mb-10 sm:mb-16">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            Featured Products
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-xl mx-auto px-4">
            Discover our most popular pillows loved by thousands
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 px-2">
          {featuredProducts.map((product, index) => <div key={index} className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden group">
              <div className="aspect-w-16 aspect-h-10 relative overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium py-1 px-2 sm:px-3 rounded-full shadow-md">
                    {product.tag}
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500 ml-2">
                    ({product.reviews})
                  </span>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center justify-between">
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {product.price}
                  </span>
                  <button onClick={() => handleViewProductDetails(product.id)} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 text-blue-600 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-200 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>)}
        </div>
      </motion.div>
      {/* Testimonials */}
      <motion.div variants={fadeIn} className="mb-10 sm:mb-16">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            What Our Customers Say
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-xl mx-auto px-4">
            Join thousands of satisfied sleepers who've found their perfect
            match
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-2">
          {[{
          quote: "I've struggled with neck pain for years. This pillow changed everything. I wake up refreshed and pain-free!",
          author: 'Emily R.',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
          rating: 5
        }, {
          quote: "The personalized recommendation was spot on. It's like this pillow was made specifically for me and my sleeping style.",
          author: 'Michael T.',
          avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
          rating: 5
        }].map((testimonial, index) => <div key={index} className="backdrop-blur-xl bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 sm:p-8 shadow-lg shadow-gray-200/50 border border-blue-100/30">
              <div className="flex mb-4 sm:mb-6">
                {[...Array(testimonial.rating)].map((_, i) => <StarIcon key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />)}
              </div>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <img src={testimonial.avatar} alt={testimonial.author} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover mr-3 sm:mr-4" />
                <span className="font-medium text-gray-900">
                  {testimonial.author}
                </span>
              </div>
            </div>)}
        </div>
      </motion.div>
      {/* Benefits Section */}
      <motion.div variants={fadeIn} className="mb-10 sm:mb-16 px-2">
        <div className="backdrop-blur-xl bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl overflow-hidden">
          <div className="px-5 py-8 sm:px-8 sm:py-12 md:p-12 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-10 text-center">
                Why Choose PerfectPillow?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {[{
                icon: ThumbsUpIcon,
                title: '100% Satisfaction Guarantee',
                description: 'Love your pillow or return it within 100 nights for a full refund'
              }, {
                icon: ShieldCheckIcon,
                title: '5-Year Warranty',
                description: 'Our pillows are built to last with premium materials and craftsmanship'
              }, {
                icon: CheckIcon,
                title: 'Expert Recommendations',
                description: 'Backed by sleep scientists and medical professionals'
              }].map((benefit, index) => <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                      <benefit.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm sm:text-base text-blue-100">
                      {benefit.description}
                    </p>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Final CTA */}
      <motion.div variants={fadeIn} className="text-center mb-8 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
          Ready to Transform Your Sleep?
        </h2>
        <button onClick={handleGetStarted} className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 font-medium text-base sm:text-lg">
          <span>Find Your Perfect Pillow</span>
          <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
        </button>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500">
          Join over 50,000 people who've improved their sleep quality
        </p>
      </motion.div>
    </motion.div>;
};