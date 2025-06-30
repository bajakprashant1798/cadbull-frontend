// /pages/amp/index.js
import axios from "axios";
import React from "react";

// 1. AMP-only mode:
export const config = { amp: true };

export async function getServerSideProps() {
  // or if your server .env: process.env.API_URL
  const [goldRes, freeRes] = await Promise.all([
    axios(`${process.env.NEXT_PUBLIC_API_MAIN}/projects?type=Gold&page=1&pageSize=15`),
    axios(`${process.env.NEXT_PUBLIC_API_MAIN}/projects?type=Free&page=1&pageSize=15`),
  ]);
//   const goldFiles = await goldRes.data;
//   const freeFiles = await freeRes.data;
//   console.log("goldFiles", goldRes.data);
//   console.log("freeFiles", freeRes.data);
  

  return {
    props: {
      goldFiles: goldRes.data.products || [],
      freeFiles: freeRes.data.products || [],
    },
  };
}

export default function AmpHome({ goldFiles, freeFiles }) {
  // You can copy-paste your CakePHP HTML below,
  // and wherever you see PHP loops, replace with JS map()
  // You must use <amp-img> and valid AMP tags!

  return (
    <html amp="" lang="en">
      <head>
        {/* (All meta, link, amp boilerplate, analytics scripts here, copy as in your CakePHP) */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <title>Cadbull - 2D Cad Library, Cad Blocks, Autocad Blocks Furniture</title>
        <link rel="canonical" href="https://cadbull.com" />
        {/* All <style amp-custom> and other header content */}
        {/* ... */}

        <style amp-custom>{`
        div,span,h1,h2,h3,h4,p,a,ul,li,textarea,input{font: inherit;}*{box-sizing: border-box;outline: none;}*:focus{outline: none;}body{position: relative;font-style: normal;line-height: 1.5;color: #000000;}section{background-color: #ffffff;background-position: 50% 50%;background-repeat: no-repeat;background-size: cover;overflow: hidden;padding: 30px 0;}section,.container,.container-fluid{position: relative;word-wrap: break-word;}h1,h2,h3,h4{margin: 0;padding: 0;}p,li{letter-spacing: 0.5px;line-height: 1.7;}ul,p{margin-bottom: 0;margin-top: 0;}a{cursor: pointer;}a,a:hover{text-decoration: none;}h1,h2,h3,h4,.display-1,.display-2,.display-4,.display-5,.display-7{word-break: break-word;word-wrap: break-word;}input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus,input:-webkit-autofill:active{transition-delay: 9999s;transition-property: background-color,color;}body{height: auto;min-height: 100vh;}.mbr-section-title{margin: 0;padding: 0;font-style: normal;line-height: 1.2;width: 100%;}.mbr-section-subtitle{line-height: 1.3;width: 100%;}.mbr-text{font-style: normal;line-height: 1.6;width: 100%;}.btn{text-align: center;position: relative;margin: .4rem .8rem;font-weight: 700;border-width: 2px;border-style: solid;font-style: normal;white-space: normal;transition: all .2s ease-in-out,box-shadow 2s ease-in-out;display: inline-flex;align-items: center;justify-content: center;word-break: break-word;line-height: 1.5;letter-spacing: 1px;}.btn-form{padding: 1rem 2rem;}.btn-form:hover{cursor: pointer;}.card-title{margin: 0;}.card-img{border-radius: 0;width: auto;flex-shrink: 0;}.card{position: relative;background-color: transparent;border: none;border-radius: 0;width: 100%;padding-left: 1rem;padding-right: 1rem;}.card .card-wrapper{height: 100%;}@media (max-width: 767px){.card .card-wrapper{flex-direction: column;}}.gallery-img-wrap amp-img{height: 100%;}.icons-list a{margin-right: 1rem;}.icons-list a:last-child{margin-right: 0;}amp-image-lightbox a.control{position: absolute;width: 32px;height: 32px;right: 48px;top: 32px;z-index: 1000;}amp-image-lightbox a.control .close{position: relative;}amp-image-lightbox a.control .close:before,amp-image-lightbox a.control .close:after{position: absolute;left: 15px;content: ' ';height: 33px;width: 2px;background-color: #fff;}amp-image-lightbox a.control .close:before{transform: rotate(45deg);}amp-image-lightbox a.control .close:after{transform: rotate(-45deg);}.mbr-white{color: #ffffff;}.mbr-black{color: #000000;}.align-left{text-align: left;}.align-center{text-align: center;}@media (max-width: 767px){.align-left,.align-center{text-align: center;}}.mbr-bold{font-weight: 700;}.mbr-section-btn{margin-left: -.8rem;margin-right: -.8rem;font-size: 0;}.mbr-fullscreen{display: flex;display: -webkit-flex;display: -moz-flex;display: -ms-flex;display: -o-flex;align-items: center;-webkit-align-items: center;min-height: 100vh;padding-top: 3rem;padding-bottom: 3rem;}.mbr-overlay{bottom: 0;left: 0;position: absolute;right: 0;top: 0;z-index: 0;}section.menu{min-height: 70px;}.menu-container{display: flex;justify-content: space-between;align-items: center;min-height: 70px;}@media (max-width: 991px){.menu-container{max-width: 100%;padding: 0 2rem;}}@media (max-width: 767px){.menu-container{padding: 0 1rem;}}.navbar{z-index: 100;width: 100%;}.navbar-fixed-top{position: fixed;top: 0;}.navbar-brand{display: flex;align-items: center;word-break: break-word;z-index: 1;}.navbar-logo{margin-right: .8rem;}@media (max-width: 767px){.navbar-logo amp-img{max-height: 55px;max-width: 55px;}}.navbar .navbar-collapse{display: flex;flex-basis: auto;align-items: center;justify-content: flex-end;}@media (max-width: 991px){.navbar .navbar-collapse{display: none;position: absolute;top: 0;right: 0;min-height: 100vh;padding: 70px 2rem 1rem;z-index: 1;}}.navbar-nav{list-style-type: none;display: flex;flex-wrap: wrap;padding-left: 0;min-width: 10rem;}@media (max-width: 991px){.navbar-nav{flex-direction: column;}}.nav-item{word-break: break-all;}.nav-link{display: flex;align-items: center;justify-content: center;}.nav-link{transition: all 0.2s;letter-spacing: 1px;}.menu-social-list{display: flex;align-items: center;justify-content: center;flex-wrap: wrap;}.menu-social-list a{margin: 0 .5rem;}.hamburger span{position: absolute;right: 0;width: 30px;height: 2px;border-right: 5px;}.hamburger span:nth-child(1){top: 0;transition: all .2s;}.hamburger span:nth-child(2){top: 8px;transition: all .15s;}.hamburger span:nth-child(3){top: 8px;transition: all .15s;}.hamburger span:nth-child(4){top: 16px;transition: all .2s;}.ampstart-btn.hamburger{position: absolute;top: 25px;right: 15px;margin-left: auto;width: 30px;height: 20px;background: none;border: none;cursor: pointer;z-index: 1000;}@media (min-width: 992px){.ampstart-btn,amp-sidebar{display: none;}}.close-sidebar{width: 30px;height: 30px;position: relative;cursor: pointer;background-color: transparent;border: none;}.close-sidebar span{position: absolute;left: 0;width: 30px;height: 2px;border-right: 5px;}.close-sidebar span:nth-child(1){transform: rotate(45deg);}.close-sidebar span:nth-child(2){transform: rotate(-45deg);}.builder-sidebar{position: relative;min-height: 100vh;z-index: 1030;padding: 1rem 2rem;max-width: 20rem;}.google-map{position: relative;width: 100%;}@media (max-width: 992px){.google-map{padding: 0;margin: 0;}}div[submit-success]{padding: 1rem;margin-bottom: 1rem;}div[submit-error]{padding: 1rem;margin-bottom: 1rem;}amp-img{width: 100%;}amp-img img{max-height: 100%;max-width: 100%;}.is-builder amp-img > a + img[async],.is-builder amp-img > a + img[decoding="async"]{display: none;}html:not(.is-builder) amp-img > a{position: absolute;top: 0;bottom: 0;left: 0;right: 0;z-index: 1;}.is-builder .temp-amp-sizer{position: absolute;}.is-builder amp-youtube .temp-amp-sizer,.is-builder amp-vimeo .temp-amp-sizer{position: static;}.is-builder section.horizontal-menu .ampstart-btn{display: none;}div.placeholder{z-index: 4;background: rgba(255,255,255,0.5);}div.placeholder svg{position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);width: 20%;height: auto;}div.placeholder svg circle.big{animation: big-anim 3s linear infinite;}div.placeholder svg circle.small{animation: small-anim 1.5s linear infinite;}@keyframes big-anim{from{stroke-dashoffset: 900;}to{stroke-dashoffset: 0;}}@keyframes small-anim{from{stroke-dashoffset: 850;}to{stroke-dashoffset: 0;}}.placeholder-loader .amp-active > div{display: none;}.container{padding-right: 1rem;padding-left: 1rem;width: 100%;margin-right: auto;margin-left: auto;}@media (max-width: 767px){.container{max-width: 540px;}}@media (min-width: 768px){.container{max-width: 720px;}}@media (min-width: 992px){.container{max-width: 960px;}}@media (min-width: 1200px){.container{max-width: 1140px;}}.container-fluid{width: 100%;margin-right: auto;margin-left: auto;padding-left: 1rem;padding-right: 1rem;}.mbr-flex{display: flex;}.mbr-jc-c{justify-content: center;}.mbr-row{display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;-webkit-flex-wrap: wrap;-ms-flex-wrap: wrap;flex-wrap: wrap;margin-right: -1rem;margin-left: -1rem;}.mbr-row-reverse{flex-direction: row-reverse;}.mbr-column{flex-direction: column;}@media (max-width: 767px){.mbr-col-sm-12{-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding-right: 1rem;padding-left: 1rem;}}@media (min-width: 768px){.mbr-col-md-4{-ms-flex: 0 0 33.333333%;flex: 0 0 33.333333%;max-width: 33.333333%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-md-6{-ms-flex: 0 0 50%;flex: 0 0 50%;max-width: 50%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-md-8{-ms-flex: 0 0 66.666667%;flex: 0 0 66.666667%;max-width: 66.666667%;padding-left: 1rem;padding-right: 1rem;}.mbr-col-md-12{-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding-right: 1rem;padding-left: 1rem;}}@media (min-width: 992px){.mbr-col-lg-4{-ms-flex: 0 0 33.33%;flex: 0 0 33.33%;max-width: 33.33%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-lg-6{-ms-flex: 0 0 50%;flex: 0 0 50%;max-width: 50%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-lg-8{-ms-flex: 0 0 66.666667%;flex: 0 0 66.666667%;max-width: 66.666667%;padding-left: 1rem;padding-right: 1rem;}.mbr-col-lg-12{-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding-right: 1rem;padding-left: 1rem;}}.mbr-pt-2{padding-top: 1rem;}.mbr-pt-3{padding-top: 1.5rem;}.mbr-pt-4{padding-top: 2rem;}.mbr-pb-3{padding-bottom: 1.5rem;}.mbr-pb-4{padding-bottom: 2rem;}.mbr-px-1{padding-left: .5rem;padding-right: .5rem;}.mbr-px-2{padding-left: 1rem;padding-right: 1rem;}.mbr-px-4{padding-left: 2rem;padding-right: 2rem;}@media (max-width: 991px){.mbr-px-4{padding-left: 1rem;padding-right: 1rem;}}.mbr-m-auto{margin: auto;}.form-block{z-index: 1;background-color: transparent;padding: 3rem;position: relative;overflow: visible;}.form-block .mbr-overlay{z-index: -1;}@media (max-width: 992px){.form-block{padding: 1rem;}}.form-block input,.form-block textarea{border-radius: 0;background-color: #ffffff;margin: 0;transition: 0.4s;width: 100%;border: 1px solid #e0e0e0;padding: 11px 1rem;}form .fieldset{display: flex;justify-content: center;flex-wrap: wrap;align-items: center;}.field{flex-basis: auto;flex-grow: 1;flex-shrink: 1;padding: 0.5rem;}@media (max-width: 768px){.field{flex-basis: 100%;}}textarea{width: 100%;margin-right: 0;}.text-field{flex-basis: 100%;flex-grow: 1rem;flex-shrink: 1;padding: 0.5rem;}amp-img{height: 100%;width: 100%;}amp-sidebar{background: transparent;}.amp-carousel-button{outline: none;border-radius: 50%;border: 10px transparent solid;transform: scale(1.5) translateY(-50%);height: 45px;width: 45px;transition: 0.4s;cursor: pointer;}.amp-carousel-button:hover{opacity: 1;}.amp-carousel-button-next{background-position: 75% 50%;}.amp-carousel-button-prev{background-position: 25% 50%;}.iconfont-wrapper{display: inline-block;width: 1.5rem;height: 1.5rem;}.amp-iconfont{vertical-align: middle;width: 1.5rem;height: 100%;font-size: 1.5rem;}body{font-family: Didact Gothic;}div[submit-success]{background: #f6f6f6;}div[submit-error]{background: #b2ccd2;}.display-1{font-family: 'Poppins',sans-serif;font-size: 4.3rem;line-height: 1.2;}.display-2{font-family: 'Poppins',sans-serif;font-size: 2.5rem;line-height: 1.2;}.display-4{font-family: 'Poppins',sans-serif;font-size: 1rem;line-height: 1.4;}.display-5{font-family: 'Poppins',sans-serif;font-size: 1.5rem;line-height: 1.2;}.display-7{font-family: 'Poppins',sans-serif;font-size: 1.1rem;line-height: 1.6;}.form-block input,.form-block textarea{font-family: 'Poppins',sans-serif;font-size: 1.1rem;line-height: 1;}@media (max-width: 768px){.display-1{font-size: 3.44rem;font-size: calc( 2.155rem + (4.3 - 2.155) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (2.155rem + (4.3 - 2.155) * ((100vw - 20rem) / (48 - 20))));}.display-2{font-size: 2rem;font-size: calc( 1.525rem + (2.5 - 1.525) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (1.525rem + (2.5 - 1.525) * ((100vw - 20rem) / (48 - 20))));}.display-4{font-size: 0.8rem;font-size: calc( 1rem + (1 - 1) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (1rem + (1 - 1) * ((100vw - 20rem) / (48 - 20))));}.display-5{font-size: 1.2rem;font-size: calc( 1.175rem + (1.5 - 1.175) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (1.175rem + (1.5 - 1.175) * ((100vw - 20rem) / (48 - 20))));}.display-7{font-size: 0.88rem;font-size: calc( 1.0350000000000001rem + (1.1 - 1.0350000000000001) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (1.0350000000000001rem + (1.1 - 1.0350000000000001) * ((100vw - 20rem) / (48 - 20))));}}.btn{padding: 10px 30px;border-radius: 0px;}.btn-md{padding: 10px 30px;border-radius: 0px;}.btn-primary{position: relative;z-index: 1;}.btn-primary:after{z-index: -1;content: '';position: absolute;top: 0;left: 0;right: 0;bottom: 0;height: 100%;transition: 0.2s;width: 0;}.btn-primary,.btn-primary:active{background-color: #7d5bd9;border-color: #7d5bd9;color: #ffffff;}.btn-primary:hover,.btn-primary:focus{background-color: #7d5bd9;border-color: #7d5bd9;color: #7d5bd9;}.btn-primary:hover:after{width: 100%;background-color: #fff;}.btn-primary:disabled{color: #ffffff;background-color: #7d5bd9;border-color: #7d5bd9;}.text-black{color: #010101;}a[class*="text-"],.amp-iconfont{transition: 0.2s ease-in-out;}.amp-iconfont{color: #7d5bd9;}a.text-black:hover,a.text-black:focus{color: #cccccc;}.features1 span.amp-iconfont{transition: 0.3s;}.features1 .card:hover span.amp-iconfont{color: #f6f6f6;}.team1 .card .amp-iconfont{transition: 0.2s ease-in-out;}@media (max-width: 767px){.team1 .card .card-box .amp-iconfont{color: #f6f6f6;}}.team1 .card:hover .amp-iconfont{color: #f6f6f6;}.cid-r1Dtil7YY5{background-color: #ffffff;}.cid-r1Dtil7YY5 .navbar{background: #ffffff;}.cid-r1Dtil7YY5 .navbar-brand .navbar-logo{max-height: 120px;min-width: 30px;max-width: 120px;}.cid-r1Dtil7YY5 .navbar-brand .navbar-logo amp-img{object-fit: contain;height: 50px;width: 50px;}@media (max-width: 991px){.cid-r1Dtil7YY5 .navbar .navbar-collapse{background: #ffffff;}}.cid-r1Dtil7YY5 .nav-link{margin: .667em 1em;padding: 0;}.cid-r1Dtil7YY5 .hamburger span{background-color: #232323;}.cid-r1Dtil7YY5 .builder-sidebar{background-color: #ffffff;}.cid-r1Dtil7YY5 .close-sidebar:focus{outline: 2px auto #7d5bd9;}.cid-r1Dtil7YY5 .close-sidebar span{background-color: #232323;}@media (min-width: 992px){.cid-r1Dtil7YY5 .menu-social-list{padding-left: 1rem;}}@media (max-width: 991px){.cid-r1Dtil7YY5 .menu-social-list{padding-top: .5rem;}}.cid-r1xV7KHlhZ{padding-top: 10rem;padding-bottom: 10rem;min-height: 50vh;background-image: url("https://cadbull.com/assets/images/intro-5.jpg");align-items: center;display: flex;}.cid-r1xV7KHlhZ .mbr-overlay{background: #000000;opacity: 0.3;}@media (max-width: 767px){.cid-r1xV7KHlhZ .title-block{padding-left: 0;padding-right: 0;}}.cid-r1xV7KHlhZ .mbr-section-title{color: #ffffff;text-align: center;}.cid-r1xV7KHlhZ .mbr-section-subtitle{color: #ffffff;text-align: center;}.cid-r1xV7KHlhZ .title-block{padding: 0;}.cid-rHYj76BV6a{padding-top: 2rem;padding-bottom: 2rem;background-color: #ffffff;}@media (max-width: 768px){.cid-rHYj76BV6a .title-wrap{padding-bottom: 2rem;}}.cid-rHYj76BV6a .field{padding: 0 0 0.5rem 0;}.cid-rHYj76BV6a input{color: #000000;border: 1px solid #cccccc;background-color: #ffffff;}.cid-rHYj76BV6a input::-webkit-input-placeholder{color: rgba(0,0,0,0.3);}.cid-rHYj76BV6a input::-moz-placeholder{color: rgba(0,0,0,0.3);}.cid-rHYj76BV6a .form-wrap .mbr-form{width: 100%;}.cid-rHYj76BV6a .form-wrap .mbr-overlay{opacity: 0;background: #efefef;}.cid-rHYj76BV6a .form-wrap .btn{width: 100%;margin: 0;}.cid-rHYj76BV6a .mbr-section-btn{width: 100%;margin: 0;}.cid-rHYj76BV6a .mbr-section-title{color: #000000;}.cid-rHYj76BV6a .mbr-text{color: #000000;}.cid-rHYijohqtV{padding-top: 2rem;padding-bottom: 2rem;background-color: #ffffff;}.cid-rHYijohqtV .item{margin-bottom: 2rem;cursor: pointer;}.cid-rHYijohqtV .item-wrapper{width: 100%;position: relative;}.cid-rHYijohqtV .item-sign{position: absolute;left: 0;right: 0;bottom: 0;padding: 10px;z-index: 1;text-align: center;background-color: rgba(0,0,0,0.3);color: #ffffff;}.cid-rHYijohqtV .item-box-img amp-img{height: auto;}.cid-rHYijohqtV .item-wrapper{box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.2);}.cid-rHYijohqtV amp-img:after{content: "";pointer-events: none;transition: 0.4s;position: absolute;top: 0;left: 0;right: 0;bottom: 0;opacity: 0;background-color: rgba(0,0,0,0.5);}.cid-rHYijohqtV amp-img:hover:after{opacity: 1;}.cid-rHYijohqtV .icon-wrap{position: absolute;left: 0;top: 0;right: 0;bottom: 0;margin: auto;opacity: 0;transition: 0.4s;height: 1.5rem;width: 1.5rem;z-index: 2;}.cid-rHYijohqtV .icon-wrap span{color: #ffffff;font-size: 1.5rem;}.cid-rHYijohqtV amp-img:hover .icon-wrap{opacity: 1;}.cid-rHYijohqtV .item-wrapper{z-index: 12;border-radius: 10px;overflow: hidden;}.cid-rHYijohqtV .mbr-section-title,.cid-rHYijohqtV .mbr-section-subtitle{text-align: center;}.cid-rHYijohqtV .mbr-section-title{color: #7d5bd9;}.cid-rHYijohqtV .item-sign{text-align: center;}.cid-rHYkLjUwDv{padding-top: 2rem;padding-bottom: 2rem;background-color: #ffffff;}.cid-rHYkLjUwDv .item{margin-bottom: 2rem;cursor: pointer;}.cid-rHYkLjUwDv .item-wrapper{width: 100%;position: relative;}.cid-rHYkLjUwDv .item-sign{position: absolute;left: 0;right: 0;bottom: 0;padding: 10px;z-index: 1;text-align: center;background-color: rgba(0,0,0,0.3);color: #ffffff;}.cid-rHYkLjUwDv .item-box-img amp-img{height: auto;}.cid-rHYkLjUwDv amp-img:after{content: "";pointer-events: none;transition: 0.4s;position: absolute;top: 0;left: 0;right: 0;bottom: 0;opacity: 0;background-color: rgba(0,0,0,0.4);}.cid-rHYkLjUwDv amp-img:hover:after{opacity: 1;}.cid-rHYkLjUwDv .icon-wrap{position: absolute;left: 0;top: 0;right: 0;bottom: 0;margin: auto;opacity: 0;transition: 0.4s;height: 1.5rem;width: 1.5rem;z-index: 2;}.cid-rHYkLjUwDv .icon-wrap span{color: #ffffff;font-size: 1.5rem;}.cid-rHYkLjUwDv amp-img:hover .icon-wrap{opacity: 1;}.cid-rHYkLjUwDv .item-wrapper{z-index: 12;border-radius: 10px;overflow: hidden;}.cid-rHYkLjUwDv .mbr-section-title,.cid-rHYkLjUwDv .mbr-section-subtitle{text-align: center;}.cid-rHYkLjUwDv .mbr-section-title{color: #7d5bd9;}.cid-rHYmguPHha{padding-top: 2rem;padding-bottom: 2rem;background-color: #ffffff;}@media (max-width: 768px){.cid-rHYmguPHha .title-wrap{padding-bottom: 2rem;}}.cid-rHYmguPHha .mbr-section-btn{width: 100%;text-align: center;}@media (max-width: 768px){.cid-rHYmguPHha .mbr-section-btn{text-align: left;}}.cid-rHYmguPHha .mbr-section-btn .btn:first-child{margin-left: 0;}.cid-r7X9D17LlB{padding-top: 2rem;padding-bottom: 2rem;background-color: #ffffff;}.cid-r7X9D17LlB .card-wrapper{position: relative;border: 1px solid #cccccc;z-index: 1;}@media (max-width: 991px){.cid-r7X9D17LlB .card-wrapper{flex-wrap: wrap;}}.cid-r7X9D17LlB .card-wrapper:after{content: "";position: absolute;left: 0;right: 0;top: 0;bottom: 0;background-color: #f8f7fd;opacity: 1;z-index: -1;}.cid-r7X9D17LlB .card-box{width: 100%;}.cid-r7X9D17LlB .card-img{padding: 0;}@media (max-width: 991px){.cid-r7X9D17LlB .card-img{width: 100%;margin-bottom: 2rem;}}@media (min-width: 992px){.cid-r7X9D17LlB .card-img{margin-right: 2rem;}}.cid-r1xXC1gI5j{background-color: #7d5bd9;}@media (max-width: 992px){.cid-r1xXC1gI5j .mbr-row{flex-direction: column-reverse;}.cid-r1xXC1gI5j .mbr-row .title-wrap{padding-top: 2rem;}}.cid-r1xXC1gI5j .title-block{margin: auto;width: 100%;}.cid-r1xXC1gI5j .image-block,.cid-r1xXC1gI5j .image-wrap{width: 100%;}.cid-r1xXC1gI5j .mbr-section-title{color: #ffffff;}.cid-r1xXC1gI5j .mbr-section-subtitle{color: #ffffff;}.cid-r1xXC1gI5j .mbr-text{color: #ffffff;}.cid-r1xVN0ZoD9{padding-top: 2rem;padding-bottom: 2rem;background-color: #f8f7fd;}.cid-r1xVN0ZoD9 .map-block{width: 100%;}@media (max-width: 992px){.cid-r1xVN0ZoD9 .map-block{margin-bottom: 2rem;}}.cid-r1xVN0ZoD9 .map-block .google-map,.cid-r1xVN0ZoD9 .map-block amp-iframe{min-height: 400px;width: 100%;}.cid-r88mQeL4XJ{padding-top: 30px;padding-bottom: 30px;background-color: #ffffff;}.cid-r88mQeL4XJ .form-block{padding: 0;}.cid-r88mQeL4XJ .iconfont-wrapper{width: 2rem;height: 2rem;display: inline-block;}.cid-r88mQeL4XJ .amp-iconfont{color: #7d5bd9;font-size: 2rem;width: 2rem;vertical-align: middle;}@media (max-width: 992px){.cid-r88mQeL4XJ .first-element{padding-bottom: 2rem;}}@media (max-width: 992px){.cid-r88mQeL4XJ .contacts-block{text-align: center;}}.cid-r88mQeL4XJ .mbr-form .fieldset input,.cid-r88mQeL4XJ .mbr-form .fieldset textarea{background-color: #ffffff;color: #000000;border: 1px solid #767676;}.cid-r88mQeL4XJ .mbr-form .fieldset input::-webkit-input-placeholder{color: rgba(0,0,0,0.5);}.cid-r88mQeL4XJ .mbr-form .fieldset input::-moz-placeholder{color: rgba(0,0,0,0.5);}.cid-r88mQeL4XJ .mbr-form .fieldset textarea::-webkit-input-placeholder{color: rgba(0,0,0,0.5);}.cid-r88mQeL4XJ .mbr-form .fieldset textarea::-moz-placeholder{color: rgba(0,0,0,0.5);}.cid-r88mQeL4XJ .mbr-form .fieldset textarea{min-height: 200px;}@media (min-width: 992px){.cid-r88mQeL4XJ .main-row{margin-left: -2rem;margin-right: -2rem;}.cid-r88mQeL4XJ .main-row > *{padding-left: 2rem;padding-right: 2rem;}}.cid-r88mQeL4XJ .mbr-section-title{color: #000000;}.cid-r88mQeL4XJ .mbr-text{color: #000000;}.cid-rHYpt6VI9p{padding-top: 2rem;padding-bottom: 2rem;background-color: #767676;}.cid-rHYpt6VI9p .link-items .fLink{width: auto;}.cid-rHYpt6VI9p .mbr-row{margin: 0;}.cid-rHYpt6VI9p .mbr-row:nth-child(1){margin-bottom: 1rem;}[class*="-iconfont"]{display: inline-flex;}
        `}</style>
      </head>
      <body>
        {/* (Copy your body content, menu/sidebar sections here) */}

        {/* ... */}
        <section className="amp-lightbox-gallery cid-rHYijohqtV" id="item-wizard-gallery-1m">
          <div className="container-fluid">
            <div className="title mbr-pb-4">
              <h3 className="mbr-section-title mbr-bold mbr-fonts-style display-2">
                Gold Files Of The Days
              </h3>
              <h4 className="mbr-section-subtitle mbr-fonts-style mbr-pt-2 display-5">
                Download Gold files
              </h4>
            </div>
            <div className="mbr-row">
              {goldFiles.map((project) => {
                const linkProductName = project.work_title.replace(/ /g, "-").trim();
                return (
                  <div
                    key={project.id}
                    className="item gallery-image mbr-col-md-6 mbr-col-sm-12 mbr-col-lg-4"
                  >
                    <a href={`https://cadbull.com/amp/${project.id}/${linkProductName}`}>
                      <div className="item-wrapper">
                        <amp-img
                          lightbox="item-wizard-gallery-1m"
                          src={project.photo_url} // change as needed (S3 URL etc)
                          layout="responsive"
                          width="394.5"
                          height="263"
                          alt={project.work_title}
                          class="placeholder-loader"
                        >
                          <div placeholder="" className="placeholder">
                            {/* ...SVG loading code... */}
                          </div>
                          <div className="icon-wrap iconfont-wrapper">
                            {/* ...SVG icon... */}
                          </div>
                          <p className="item-sign mbr-fonts-style display-7">
                            {project.work_title.slice(0, 60)}
                          </p>
                        </amp-img>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="amp-lightbox-gallery cid-rHYkLjUwDv" id="item-wizard-gallery-1q">
          <div className="container-fluid">
            <div className="title mbr-pb-4">
              <h3 className="mbr-section-title mbr-bold mbr-fonts-style display-2">
                Free Files Of The Days
              </h3>
              <h4 className="mbr-section-subtitle mbr-fonts-style mbr-pt-2 display-5">
                Download Free files
              </h4>
            </div>
            <div className="mbr-row">
              {freeFiles.map((project) => {
                const linkProductName = project.work_title.replace(/ /g, "-").trim();
                return (
                  <div
                    key={project.id}
                    className="item gallery-image mbr-col-md-6 mbr-col-sm-12 mbr-col-lg-4"
                  >
                    <a href={`https://cadbull.com/amp/${project.id}/${linkProductName}`}>
                      <div className="item-wrapper">
                        <amp-img
                          lightbox="item-wizard-gallery-1m"
                          src={project.photo_url} // change as needed (S3 URL etc)
                          layout="responsive"
                          width="394.5"
                          height="263"
                          alt={project.work_title}
                          class="placeholder-loader"
                        >
                          <div placeholder="" className="placeholder">
                            {/* ...SVG loading code... */}
                          </div>
                          <div className="icon-wrap iconfont-wrapper">
                            {/* ...SVG icon... */}
                          </div>
                          <p className="item-sign mbr-fonts-style display-7">
                            {project.work_title.slice(0, 60)}
                          </p>
                        </amp-img>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        
      </body>
    </html>
  );
}
