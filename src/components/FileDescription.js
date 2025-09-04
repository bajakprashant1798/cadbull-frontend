import React from 'react'

const FileDescription = ({ bgColor, image, type, title, className='text-white' }) => {
  return (
    <div className="row-sm-6 row-md-6 row-lg-6 row-xl-3">
      <div className="rounded-1 p-3 py-md-4 d-flex gap-2 align-items-center shadow-sm h-100" style={{ background: bgColor }}>
        <img src={image} alt="icon" width={40} height={40} className='object-fit-contain' />
        <div>
          <p className={className}>{type}</p>
          <h6 className={`${className} fw-bold`}>{title}</h6>
        </div>
      </div>
    </div>
  )
}

export default FileDescription;