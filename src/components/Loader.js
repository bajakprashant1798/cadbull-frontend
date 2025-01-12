import React from 'react';

export default function Loader() {
  return (
    <>
      <div 
            className="loader-container  d-flex justify-content-center align-items-center" 
            style={{
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                // background: 'transparent', 
                zIndex: 9999
            }}
        >
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    </>
  );
}
