// components/RecaptchaComponent.js
import React, { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const RecaptchaComponent = ({ onChange }) => {
  const recaptchaRef = useRef(null);

  return (
    <div className="recaptcha-container">
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        onChange={onChange}
        ref={recaptchaRef}
      />
    </div>
  );
};

export default RecaptchaComponent;
