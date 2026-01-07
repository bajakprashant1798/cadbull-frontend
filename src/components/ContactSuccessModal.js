import React from 'react';
import Icons from './Icons';

const ContactSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="contact-success-modal-overlay" onClick={onClose}>
      <div className="contact-success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="contact-success-modal-content">
          {/* Close button */}
          <button className="contact-success-modal-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          {/* Success icon */}
          <div className="contact-success-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
          </div>
          
          {/* Content */}
          <div className="contact-success-text">
            <h3>Thank You for Contacting Us!</h3>
            <p>We have received your message and will get back to you soon.</p>
            <p className="contact-success-note">Our team typically responds within 24 hours.</p>
          </div>
          
          {/* Action button */}
          <button className="contact-success-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .contact-success-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          backdrop-filter: blur(5px);
        }
        
        .contact-success-modal {
          background: white;
          border-radius: 16px;
          max-width: 450px;
          width: 100%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          position: relative;
          animation: modalSlideIn 0.3s ease-out;
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .contact-success-modal-content {
          padding: 40px 30px 30px;
          text-align: center;
          position: relative;
        }
        
        .contact-success-modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .contact-success-modal-close:hover {
          background-color: #f3f4f6;
          color: #374151;
        }
        
        .contact-success-icon {
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
        }
        
        .contact-success-text h3 {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 12px;
          margin-top: 0;
        }
        
        .contact-success-text p {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 8px;
          line-height: 1.5;
        }
        
        .contact-success-note {
          font-size: 14px !important;
          color: #9ca3af !important;
          font-style: italic;
        }
        
        .contact-success-button {
          background-color: #3D6098;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 12px 24px;
          box-shadow: 0px 3px 0px rgba(0, 0, 0, 0.1607843137);
          font: normal normal 500 14px/1 "Inter", sans-serif;
          text-transform: capitalize;
          cursor: pointer;
          margin-top: 20px;
          transition: all 0.2s ease;
          min-width: 120px;
        }
        
        .contact-success-button:hover {
          background-color: #20325A;
          transform: translateY(-1px);
        }
        
        .contact-success-button:active {
          transform: translateY(0);
          box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.1607843137);
        }
        
        @media (max-width: 767px) {
          .contact-success-button {
            font: normal normal 500 12px/1 "Inter", sans-serif;
          }
        }
        
        @media (max-width: 480px) {
          .contact-success-modal {
            margin: 20px;
            max-width: none;
          }
          
          .contact-success-modal-content {
            padding: 30px 20px 20px;
          }
          
          .contact-success-text h3 {
            font-size: 20px;
          }
          
          .contact-success-text p {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactSuccessModal;
