// src/components/WhatsAppButton.js
import React from 'react';
import Image from 'next/image';
import whatsappImg from "@/assets/images/whatsappImg.png";

const WhatsAppButton = () => {
  // IMPORTANT: Replace with your actual WhatsApp phone number including the country code.
  const whatsappUrl = "https://wa.me/919824011921"; // Example for +91 98765 43210

  const buttonStyle = {
    position: 'fixed',
    bottom: '25px',
    right: '25px',
    zIndex: 1050, // High z-index to be on top of other elements
    cursor: 'pointer',
    // borderRadius: '50%',
    overflow: 'hidden', // Ensures the image respects the border radius
    // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s ease-in-out',
  };

  const handleMouseOver = (e) => {
    e.currentTarget.style.transform = 'scale(1.1)';
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <div
      style={buttonStyle}
      onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      title="Chat with us on WhatsApp"
    >
      <Image
        src={whatsappImg} // This image must be in your `public` folder
        alt="WhatsApp Chat"
        width={120}
        height={50}
        quality={100}
      />
    </div>
  );
};

export default WhatsAppButton;