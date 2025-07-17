import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, RulerIcon, StarIcon, CheckIcon, SparklesIcon, ShieldCheckIcon, ThumbsUpIcon, BoxIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- iOS Install Banner Helpers ---
function IOSInstallBanner() {
  // REMOVE the device check for now, always show the banner!
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
