import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, RulerIcon, StarIcon, CheckIcon, SparklesIcon, ShieldCheckIcon, ThumbsUpIcon, BoxIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- iOS Install Banner Helpers ---
function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function IOSInstallBanner() {
  if (!isIOS()) return null;
  return (


  <>
    <div style={{background: "#000", color: "#fff", padding: 20}}>DEBUG TEST</div>
    <IOSInstallBanner />
    <motion.div initial="initial" animate="animate" variants={stagger} className="w-full">
      {/* ...rest of your content... */}
    </motion.div>
  </>
);

    <div style={{
      background: "#f8fafc",
      padding: "18px",
      borderRadius: "16px",
      textAlign: "center",
      margin: "32px auto",
      maxWidth: 350,
      boxShadow: "0 2px 12px #0001"
    }}>
      <strong>Install this app:</strong>
      <ol style={{ textAlign: "left", margin: "1em 0 0 2em" }}>
        <li>Tap the <b>Share</b> <span role="img" aria-label="Share">⬆️</span> button at the bottom of your screen.</li>
        <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
        <li>Tap <b>Add</b> in the top right corner.</li>
      </ol>
    </div>
  );
}

// --- Main Welcome Page ---
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
    onGetStarted();
    navigate('/measurement');
  };
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
  const handleViewProductDetails = productId => {
    navigate(`/product?id=${productId}`);
  };

  return (
    <>
      <IOSInstallBanner />
      <motion.div initial="initial" animate="animate" variants={stagger} className="w-full">
        {/* Hero Section */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl overflow-hidden mb-8 sm:mb-12 shadow-lg shadow-gray-200/50 border border-gray-100">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 mix-blend-multiply"></div>
            <img src="https://www.ikea.com/ca/en/images/products/lapptatel-pillow-high__0789272_pe763901_s5.jpg?f=s" alt="Perfect Pillow" className="w-full h-[350px] sm:h-[400px] md:h-[500px] object-cover" />
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
        {/* ...the rest of your WelcomePage code remains unchanged... */}
        {/* How It Works Section */}
        {/* Featured Products */}
        {/* Testimonials */}
        {/* Benefits Section */}
        {/* Final CTA */}
        {/* ... */}
      </motion.div>
    </>
  );
};
