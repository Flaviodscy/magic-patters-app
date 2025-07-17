import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, RulerIcon, StarIcon, CheckIcon, SparklesIcon, ShieldCheckIcon, ThumbsUpIcon, BoxIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- iOS Install Banner Helpers ---
function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function IOSInstallBanner() {
  // REMOVE the device check for now, always show the banner!
  // if (!isIOS()) return null;
  return (
    <div style={{
      background: "#000",
      color: "#fff",
      padding: 20,
      textAlign: "center",
      margin: "32px auto",
      maxWidth: 350,
      borderRadius: "16px",
      boxShadow: "0 2px 12px #0001"
    }}>
      DEBUG TEST: Install this app!<br/>
      <ol style={{ textAlign: "left", margin: "1em 0 0 2em", color: "#fff" }}>
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
        {/* ...rest of your content... */}
        {/* Hero Section, How It Works, etc. */}
      </motion.div>
    </>
  );
};
