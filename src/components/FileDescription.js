import React from 'react'

const FileDescription = ({ bgColor, image, type, title, className = 'text-white' }) => {
  return (
    <div className="row-sm-6 row-md-6 row-lg-6 row-xl-3">
      <div className="rounded-1 p-3 py-md-3 d-flex gap-2 align-items-center shadow-sm h-100" style={{ background: bgColor }}>
        {/* <img src={image} alt="icon" width={40} height={40} className='object-fit-contain' /> */}
        <div>
          <p className={className} style={{ fontSize: '0.82rem', opacity: 0.85, margin: '0 0 0 0' }}>{type}</p>
          <h6 className={`${className} fw-bold mb-0`} style={{ fontSize: '0.95rem', lineHeight: '1.2' }}>{title}</h6>
        </div>
      </div>
    </div>
  )
}

export default FileDescription;