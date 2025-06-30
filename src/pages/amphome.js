// /pages/amp/index.js
import axios from "axios";
import React from "react";
import logo from "@/assets/images/logo.png";
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
  // --- USER AUTH CHECK ---
  let user = null;
  try {
    const cookie = context.req.headers.cookie || "";
    const apiConfig = { headers: { cookie } };
    const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_MAIN}/auth/me`, apiConfig);
    user = userRes.data?.user || null;
  } catch (e) {
    user = null;
  }

  return {
    props: {
      goldFiles: goldRes.data.products || [],
      freeFiles: freeRes.data.products || [],
      user
    },
  };
}

export default function AmpHome({ goldFiles, freeFiles, user }) {
  // You can copy-paste your CakePHP HTML below,
  // and wherever you see PHP loops, replace with JS map()
  // You must use <amp-img> and valid AMP tags!

  return (
    <html amp="" lang="en">
      <head>
        {/* (All meta, link, amp boilerplate, analytics scripts here, copy as in your CakePHP) */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <link rel="canonical" href="https://cadbull.com" />
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Removed <meta name="viewport"> as Next.js AMP injects it automatically */}

        <meta property="og:title" content="Cadbull - 2D Cad Library, Cad Blocks, Autocad Blocks Furniture" />

        <title>Cadbull - 2D Cad Library, Cad Blocks, Autocad Blocks Furniture</title>
        <meta name="theme-color" content="#7d5bd9" />

        <link
          rel="shortcut icon"
          href="/favicon.ico"
        />
        {/* All <style amp-custom> and other header content */}
        {/* ... */}

        <style amp-custom>{`
        div,span,h1,h2,h3,h4,p,a,ul,li,textarea,input{font: inherit;}*{box-sizing: border-box;outline: none;}*:focus{outline: none;}body{position: relative;font-style: normal;line-height: 1.5;color: #000000;}section{background-color: #ffffff;background-position: 50% 50%;background-repeat: no-repeat;background-size: cover;overflow: hidden;padding: 30px 0;}section,.container,.container-fluid{position: relative;word-wrap: break-word;}h1,h2,h3,h4{margin: 0;padding: 0;}p,li{letter-spacing: 0.5px;line-height: 1.7;}ul,p{margin-bottom: 0;margin-top: 0;}a{cursor: pointer;}a,a:hover{text-decoration: none;}h1,h2,h3,h4,.display-1,.display-2,.display-4,.display-5,.display-7{word-break: break-word;word-wrap: break-word;}input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus,input:-webkit-autofill:active{transition-delay: 9999s;transition-property: background-color,color;}body{height: auto;min-height: 100vh;}.mbr-section-title{margin: 0;padding: 0;font-style: normal;line-height: 1.2;width: 100%;}.mbr-section-subtitle{line-height: 1.3;width: 100%;}.mbr-text{font-style: normal;line-height: 1.6;width: 100%;}.btn{text-align: center;position: relative;margin: .4rem .8rem;font-weight: 700;border-width: 2px;border-style: solid;font-style: normal;white-space: normal;transition: all .2s ease-in-out,box-shadow 2s ease-in-out;display: inline-flex;align-items: center;justify-content: center;word-break: break-word;line-height: 1.5;letter-spacing: 1px;}.btn-form{padding: 1rem 2rem;}.btn-form:hover{cursor: pointer;}.card-title{margin: 0;}.card-img{border-radius: 0;width: auto;flex-shrink: 0;}.card{position: relative;background-color: transparent;border: none;border-radius: 0;width: 100%;padding-left: 1rem;padding-right: 1rem;}.card .card-wrapper{height: 100%;}@media (max-width: 767px){.card .card-wrapper{flex-direction: column;}}.gallery-img-wrap amp-img{height: 100%;}.icons-list a{margin-right: 1rem;}.icons-list a:last-child{margin-right: 0;}amp-image-lightbox a.control{position: absolute;width: 32px;height: 32px;right: 48px;top: 32px;z-index: 1000;}amp-image-lightbox a.control .close{position: relative;}amp-image-lightbox a.control .close:before,amp-image-lightbox a.control .close:after{position: absolute;left: 15px;content: ' ';height: 33px;width: 2px;background-color: #fff;}amp-image-lightbox a.control .close:before{transform: rotate(45deg);}amp-image-lightbox a.control .close:after{transform: rotate(-45deg);}.mbr-white{color: #ffffff;}.mbr-black{color: #000000;}.align-left{text-align: left;}.align-center{text-align: center;}@media (max-width: 767px){.align-left,.align-center{text-align: center;}}.mbr-bold{font-weight: 700;}.mbr-section-btn{margin-left: -.8rem;margin-right: -.8rem;font-size: 0;}.mbr-fullscreen{display: flex;display: -webkit-flex;display: -moz-flex;display: -ms-flex;display: -o-flex;align-items: center;-webkit-align-items: center;min-height: 100vh;padding-top: 3rem;padding-bottom: 3rem;}.mbr-overlay{bottom: 0;left: 0;position: absolute;right: 0;top: 0;z-index: 0;}section.menu{min-height: 70px;}.menu-container{display: flex;justify-content: space-between;align-items: center;min-height: 70px;}@media (max-width: 991px){.menu-container{max-width: 100%;padding: 0 2rem;}}@media (max-width: 767px){.menu-container{padding: 0 1rem;}}.navbar{z-index: 100;width: 100%;}.navbar-fixed-top{position: fixed;top: 0;}.navbar-brand{display: flex;align-items: center;word-break: break-word;z-index: 1;}.navbar-logo{margin-right: .8rem;}@media (max-width: 767px){.navbar-logo amp-img{max-height: 55px;max-width: 55px;}}.navbar .navbar-collapse{display: flex;flex-basis: auto;align-items: center;justify-content: flex-end;}@media (max-width: 991px){.navbar .navbar-collapse{display: none;position: absolute;top: 0;right: 0;min-height: 100vh;padding: 70px 2rem 1rem;z-index: 1;}}.navbar-nav{list-style-type: none;display: flex;flex-wrap: wrap;padding-left: 0;min-width: 10rem;}@media (max-width: 991px){.navbar-nav{flex-direction: column;}}.nav-item{word-break: break-all;}.nav-link{display: flex;align-items: center;justify-content: center;}.nav-link{transition: all 0.2s;letter-spacing: 1px;}.menu-social-list{display: flex;align-items: center;justify-content: center;flex-wrap: wrap;}.menu-social-list a{margin: 0 .5rem;}.hamburger span{position: absolute;right: 0;width: 30px;height: 2px;border-right: 5px;}.hamburger span:nth-child(1){top: 0;transition: all .2s;}.hamburger span:nth-child(2){top: 8px;transition: all .15s;}.hamburger span:nth-child(3){top: 8px;transition: all .15s;}.hamburger span:nth-child(4){top: 16px;transition: all .2s;}.ampstart-btn.hamburger{position: absolute;top: 25px;right: 15px;margin-left: auto;width: 30px;height: 20px;background: none;border: none;cursor: pointer;z-index: 1000;}@media (min-width: 992px){.ampstart-btn,amp-sidebar{display: none;}}.close-sidebar{width: 30px;height: 30px;position: relative;cursor: pointer;background-color: transparent;border: none;}.close-sidebar span{position: absolute;left: 0;width: 30px;height: 2px;border-right: 5px;}.close-sidebar span:nth-child(1){transform: rotate(45deg);}.close-sidebar span:nth-child(2){transform: rotate(-45deg);}.builder-sidebar{position: relative;min-height: 100vh;z-index: 1030;padding: 1rem 2rem;max-width: 20rem;}.google-map{position: relative;width: 100%;}@media (max-width: 992px){.google-map{padding: 0;margin: 0;}}div[submit-success]{padding: 1rem;margin-bottom: 1rem;}div[submit-error]{padding: 1rem;margin-bottom: 1rem;}amp-img{width: 100%;}amp-img img{max-height: 100%;max-width: 100%;}.is-builder amp-img > a + img[async],.is-builder amp-img > a + img[decoding="async"]{display: none;}html:not(.is-builder) amp-img > a{position: absolute;top: 0;bottom: 0;left: 0;right: 0;z-index: 1;}.is-builder .temp-amp-sizer{position: absolute;}.is-builder amp-youtube .temp-amp-sizer,.is-builder amp-vimeo .temp-amp-sizer{position: static;}.is-builder section.horizontal-menu .ampstart-btn{display: none;}div.placeholder{z-index: 4;background: rgba(255,255,255,0.5);}div.placeholder svg{position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);width: 20%;height: auto;}div.placeholder svg circle.big{animation: big-anim 3s linear infinite;}div.placeholder svg circle.small{animation: small-anim 1.5s linear infinite;}@keyframes big-anim{from{stroke-dashoffset: 900;}to{stroke-dashoffset: 0;}}@keyframes small-anim{from{stroke-dashoffset: 850;}to{stroke-dashoffset: 0;}}.placeholder-loader .amp-active > div{display: none;}.container{padding-right: 1rem;padding-left: 1rem;width: 100%;margin-right: auto;margin-left: auto;}@media (max-width: 767px){.container{max-width: 540px;}}@media (min-width: 768px){.container{max-width: 720px;}}@media (min-width: 992px){.container{max-width: 960px;}}@media (min-width: 1200px){.container{max-width: 1140px;}}.container-fluid{width: 100%;margin-right: auto;margin-left: auto;padding-left: 1rem;padding-right: 1rem;}.mbr-flex{display: flex;}.mbr-jc-c{justify-content: center;}.mbr-row{display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;-webkit-flex-wrap: wrap;-ms-flex-wrap: wrap;flex-wrap: wrap;margin-right: -1rem;margin-left: -1rem;}.mbr-row-reverse{flex-direction: row-reverse;}.mbr-column{flex-direction: column;}@media (max-width: 767px){.mbr-col-sm-12{-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding-right: 1rem;padding-left: 1rem;}}@media (min-width: 768px){.mbr-col-md-4{-ms-flex: 0 0 33.333333%;flex: 0 0 33.333333%;max-width: 33.333333%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-md-6{-ms-flex: 0 0 50%;flex: 0 0 50%;max-width: 50%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-md-8{-ms-flex: 0 0 66.666667%;flex: 0 0 66.666667%;max-width: 66.666667%;padding-left: 1rem;padding-right: 1rem;}.mbr-col-md-12{-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding-right: 1rem;padding-left: 1rem;}}@media (min-width: 992px){.mbr-col-lg-4{-ms-flex: 0 0 33.33%;flex: 0 0 33.33%;max-width: 33.33%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-lg-6{-ms-flex: 0 0 50%;flex: 0 0 50%;max-width: 50%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-lg-8{-ms-flex: 0 0 66.666667%;flex: 0 0 66.666667%;max-width: 66.666667%;padding-left: 1rem;padding-right: 1rem;}.mbr-col-lg-12{-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding-right: 1rem;padding-left: 1rem;}}.mbr-pt-2{padding-top: 1rem;}.mbr-pt-3{padding-top: 1.5rem;}.mbr-pt-4{padding-top: 2rem;}.mbr-pb-3{padding-bottom: 1.5rem;}.mbr-pb-4{padding-bottom: 2rem;}.mbr-px-1{padding-left: .5rem;padding-right: .5rem;}.mbr-px-2{padding-left: 1rem;padding-right: 1rem;}.mbr-px-4{padding-left: 2rem;padding-right: 2rem;}@media (max-width: 991px){.mbr-px-4{padding-left: 1rem;padding-right: 1rem;}}.mbr-m-auto{margin: auto;}.form-block{z-index: 1;background-color: transparent;padding: 3rem;position: relative;overflow: visible;}.form-block .mbr-overlay{z-index: -1;}@media (max-width: 992px){.form-block{padding: 1rem;}}.form-block input,.form-block textarea{border-radius: 0;background-color: #ffffff;margin: 0;transition: 0.4s;width: 100%;border: 1px solid #e0e0e0;padding: 11px 1rem;}form .fieldset{display: flex;justify-content: center;flex-wrap: wrap;align-items: center;}.field{flex-basis: auto;flex-grow: 1;flex-shrink: 1;padding: 0.5rem;}@media (max-width: 768px){.field{flex-basis: 100%;}}textarea{width: 100%;margin-right: 0;}.text-field{flex-basis: 100%;flex-grow: 1rem;flex-shrink: 1;padding: 0.5rem;}amp-img{height: 100%;width: 100%;}amp-sidebar{background: transparent;}.amp-carousel-button{outline: none;border-radius: 50%;border: 10px transparent solid;transform: scale(1.5) translateY(-50%);height: 45px;width: 45px;transition: 0.4s;cursor: pointer;}.amp-carousel-button:hover{opacity: 1;}.amp-carousel-button-next{background-position: 75% 50%;}.amp-carousel-button-prev{background-position: 25% 50%;}.iconfont-wrapper{display: inline-block;width: 1.5rem;height: 1.5rem;}.amp-iconfont{vertical-align: middle;width: 1.5rem;height: 100%;font-size: 1.5rem;}body{font-family: Didact Gothic;}div[submit-success]{background: #f6f6f6;}div[submit-error]{background: #b2ccd2;}.display-1{font-family: 'Poppins',sans-serif;font-size: 4.3rem;line-height: 1.2;}.display-2{font-family: 'Poppins',sans-serif;font-size: 2.5rem;line-height: 1.2;}.display-4{font-family: 'Poppins',sans-serif;font-size: 1rem;line-height: 1.4;}.display-5{font-family: 'Poppins',sans-serif;font-size: 1.5rem;line-height: 1.2;}.display-7{font-family: 'Poppins',sans-serif;font-size: 1.1rem;line-height: 1.6;}.form-block input,.form-block textarea{font-family: 'Poppins',sans-serif;font-size: 1.1rem;line-height: 1;}@media (max-width: 768px){.display-1{font-size: 3.44rem;font-size: calc( 2.155rem + (4.3 - 2.155) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (2.155rem + (4.3 - 2.155) * ((100vw - 20rem) / (48 - 20))));}.display-2{font-size: 2rem;font-size: calc( 1.525rem + (2.5 - 1.525) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (1.525rem + (2.5 - 1.525) * ((100vw - 20rem) / (48 - 20))));}.display-4{font-size: 0.8rem;font-size: calc( 1rem + (1 - 1) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (1rem + (1 - 1) * ((100vw - 20rem) / (48 - 20))));}.display-5{font-size: 1.2rem;font-size: calc( 1.175rem + (1.5 - 1.175) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (1.175rem + (1.5 - 1.175) * ((100vw - 20rem) / (48 - 20))));}.display-7{font-size: 0.88rem;font-size: calc( 1.0350000000000001rem + (1.1 - 1.0350000000000001) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (1.0350000000000001rem + (1.1 - 1.0350000000000001) * ((100vw - 20rem) / (48 - 20))));}}.btn{padding: 10px 30px;border-radius: 0px;}.btn-md{padding: 10px 30px;border-radius: 0px;}.btn-primary{position: relative;z-index: 1;}.btn-primary:after{z-index: -1;content: '';position: absolute;top: 0;left: 0;right: 0;bottom: 0;height: 100%;transition: 0.2s;width: 0;}.btn-primary,.btn-primary:active{background-color: #7d5bd9;border-color: #7d5bd9;color: #ffffff;}.btn-primary:hover,.btn-primary:focus{background-color: #7d5bd9;border-color: #7d5bd9;color: #7d5bd9;}.btn-primary:hover:after{width: 100%;background-color: #fff;}.btn-primary:disabled{color: #ffffff;background-color: #7d5bd9;border-color: #7d5bd9;}.text-black{color: #010101;}a[class*="text-"],.amp-iconfont{transition: 0.2s ease-in-out;}.amp-iconfont{color: #7d5bd9;}a.text-black:hover,a.text-black:focus{color: #cccccc;}.features1 span.amp-iconfont{transition: 0.3s;}.features1 .card:hover span.amp-iconfont{color: #f6f6f6;}.team1 .card .amp-iconfont{transition: 0.2s ease-in-out;}@media (max-width: 767px){.team1 .card .card-box .amp-iconfont{color: #f6f6f6;}}.team1 .card:hover .amp-iconfont{color: #f6f6f6;}.cid-r1Dtil7YY5{background-color: #ffffff;} .navbar{background: #ffffff;} .navbar-brand .navbar-logo{max-height: 120px;min-width: 30px;max-width: 120px;} .navbar-brand .navbar-logo amp-img{object-fit: contain;height: 45px;width: 150px;}@media (max-width: 991px){ .navbar .navbar-collapse{background: #ffffff;}} .nav-link{margin: .667em 1em;padding: 0;} .hamburger span{background-color: #232323;} .builder-sidebar{background-color: #ffffff;} .close-sidebar:focus{outline: 2px auto #7d5bd9;} .close-sidebar span{background-color: #232323;}@media (min-width: 992px){ .menu-social-list{padding-left: 1rem;}}@media (max-width: 991px){ .menu-social-list{padding-top: .5rem;}}.cid-r1xV7KHlhZ{padding-top: 10rem;padding-bottom: 10rem;min-height: 50vh;background-image: url(/assets/images/intro-5.jpg);align-items: center;display: flex;}.cid-r1xV7KHlhZ .mbr-overlay{background: #000000;opacity: 0.3;}@media (max-width: 767px){.cid-r1xV7KHlhZ .title-block{padding-left: 0;padding-right: 0;}}.cid-r1xV7KHlhZ .mbr-section-title{color: #ffffff;text-align: center;}.cid-r1xV7KHlhZ .mbr-section-subtitle{color: #ffffff;text-align: center;}.cid-r1xV7KHlhZ .title-block{padding: 0;}.cid-rHYj76BV6a{padding-top: 2rem;padding-bottom: 2rem;background-color: #ffffff;}@media (max-width: 768px){.cid-rHYj76BV6a .title-wrap{padding-bottom: 2rem;}}.cid-rHYj76BV6a .field{padding: 0 0 0.5rem 0;}.cid-rHYj76BV6a input{color: #000000;border: 1px solid #cccccc;background-color: #ffffff;}.cid-rHYj76BV6a input::-webkit-input-placeholder{color: rgba(0,0,0,0.3);}.cid-rHYj76BV6a input::-moz-placeholder{color: rgba(0,0,0,0.3);}.cid-rHYj76BV6a .form-wrap .mbr-form{width: 100%;}.cid-rHYj76BV6a .form-wrap .mbr-overlay{opacity: 0;background: #efefef;}.cid-rHYj76BV6a .form-wrap .btn{width: 100%;margin: 0;}.cid-rHYj76BV6a .mbr-section-btn{width: 100%;margin: 0;}.cid-rHYj76BV6a .mbr-section-title{color: #000000;}.cid-rHYj76BV6a .mbr-text{color: #000000;}.cid-rHYijohqtV{padding-top: 2rem;padding-bottom: 2rem;background-color: #ffffff;}.cid-rHYijohqtV .item{margin-bottom: 2rem;cursor: pointer;}.cid-rHYijohqtV .item-wrapper{width: 100%;position: relative;}.cid-rHYijohqtV .item-sign{position: absolute;left: 0;right: 0;bottom: 0;padding: 10px;z-index: 1;text-align: center;background-color: rgba(0,0,0,0.3);color: #ffffff;}.cid-rHYijohqtV .item-box-img amp-img{height: auto;}.cid-rHYijohqtV .item-wrapper{box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.2);}.cid-rHYijohqtV amp-img:after{content: "";pointer-events: none;transition: 0.4s;position: absolute;top: 0;left: 0;right: 0;bottom: 0;opacity: 0;background-color: rgba(0,0,0,0.5);}.cid-rHYijohqtV amp-img:hover:after{opacity: 1;}.cid-rHYijohqtV .icon-wrap{position: absolute;left: 0;top: 0;right: 0;bottom: 0;margin: auto;opacity: 0;transition: 0.4s;height: 1.5rem;width: 1.5rem;z-index: 2;}.cid-rHYijohqtV .icon-wrap span{color: #ffffff;font-size: 1.5rem;}.cid-rHYijohqtV amp-img:hover .icon-wrap{opacity: 1;}.cid-rHYijohqtV .item-wrapper{z-index: 12;border-radius: 10px;overflow: hidden;}.cid-rHYijohqtV .mbr-section-title,.cid-rHYijohqtV .mbr-section-subtitle{text-align: center;}.cid-rHYijohqtV .mbr-section-title{color: #7d5bd9;}.cid-rHYijohqtV .item-sign{text-align: center;}.cid-rHYkLjUwDv{padding-top: 2rem;padding-bottom: 2rem;background-color: #ffffff;}.cid-rHYkLjUwDv .item{margin-bottom: 2rem;cursor: pointer;}.cid-rHYkLjUwDv .item-wrapper{width: 100%;position: relative;}.cid-rHYkLjUwDv .item-sign{position: absolute;left: 0;right: 0;bottom: 0;padding: 10px;z-index: 1;text-align: center;background-color: rgba(0,0,0,0.3);color: #ffffff;}.cid-rHYkLjUwDv .item-box-img amp-img{height: auto;}.cid-rHYkLjUwDv amp-img:after{content: "";pointer-events: none;transition: 0.4s;position: absolute;top: 0;left: 0;right: 0;bottom: 0;opacity: 0;background-color: rgba(0,0,0,0.4);}.cid-rHYkLjUwDv amp-img:hover:after{opacity: 1;}.cid-rHYkLjUwDv .icon-wrap{position: absolute;left: 0;top: 0;right: 0;bottom: 0;margin: auto;opacity: 0;transition: 0.4s;height: 1.5rem;width: 1.5rem;z-index: 2;}.cid-rHYkLjUwDv .icon-wrap span{color: #ffffff;font-size: 1.5rem;}.cid-rHYkLjUwDv amp-img:hover .icon-wrap{opacity: 1;}.cid-rHYkLjUwDv .item-wrapper{z-index: 12;border-radius: 10px;overflow: hidden;}.cid-rHYkLjUwDv .mbr-section-title,.cid-rHYkLjUwDv .mbr-section-subtitle{text-align: center;}.cid-rHYkLjUwDv .mbr-section-title{color: #7d5bd9;}.cid-rHYmguPHha{padding-top: 2rem;padding-bottom: 2rem;background-color: #ffffff;}@media (max-width: 768px){.cid-rHYmguPHha .title-wrap{padding-bottom: 2rem;}}.cid-rHYmguPHha .mbr-section-btn{width: 100%;text-align: center;}@media (max-width: 768px){.cid-rHYmguPHha .mbr-section-btn{text-align: left;}}.cid-rHYmguPHha .mbr-section-btn .btn:first-child{margin-left: 0;}.cid-r7X9D17LlB{padding-top: 2rem;padding-bottom: 2rem;background-color: #ffffff;}.cid-r7X9D17LlB .card-wrapper{position: relative;border: 1px solid #cccccc;z-index: 1;}@media (max-width: 991px){.cid-r7X9D17LlB .card-wrapper{flex-wrap: wrap;}}.cid-r7X9D17LlB .card-wrapper:after{content: "";position: absolute;left: 0;right: 0;top: 0;bottom: 0;background-color: #f8f7fd;opacity: 1;z-index: -1;}.cid-r7X9D17LlB .card-box{width: 100%;}.cid-r7X9D17LlB .card-img{padding: 0;}@media (max-width: 991px){.cid-r7X9D17LlB .card-img{width: 100%;margin-bottom: 2rem;}}@media (min-width: 992px){.cid-r7X9D17LlB .card-img{margin-right: 2rem;}}.cid-r1xXC1gI5j{background-color: #7d5bd9;}@media (max-width: 992px){.cid-r1xXC1gI5j .mbr-row{flex-direction: column-reverse;}.cid-r1xXC1gI5j .mbr-row .title-wrap{padding-top: 2rem;}}.cid-r1xXC1gI5j .title-block{margin: auto;width: 100%;}.cid-r1xXC1gI5j .image-block,.cid-r1xXC1gI5j .image-wrap{width: 100%;}.cid-r1xXC1gI5j .mbr-section-title{color: #ffffff;}.cid-r1xXC1gI5j .mbr-section-subtitle{color: #ffffff;}.cid-r1xXC1gI5j .mbr-text{color: #ffffff;}.cid-r1xVN0ZoD9{padding-top: 2rem;padding-bottom: 2rem;background-color: #f8f7fd;}.cid-r1xVN0ZoD9 .map-block{width: 100%;}@media (max-width: 992px){.cid-r1xVN0ZoD9 .map-block{margin-bottom: 2rem;}}.cid-r1xVN0ZoD9 .map-block .google-map,.cid-r1xVN0ZoD9 .map-block amp-iframe{min-height: 400px;width: 100%;}.cid-r88mQeL4XJ{padding-top: 30px;padding-bottom: 30px;background-color: #ffffff;}.cid-r88mQeL4XJ .form-block{padding: 0;}.cid-r88mQeL4XJ .iconfont-wrapper{width: 2rem;height: 2rem;display: inline-block;}.cid-r88mQeL4XJ .amp-iconfont{color: #7d5bd9;font-size: 2rem;width: 2rem;vertical-align: middle;}@media (max-width: 992px){.cid-r88mQeL4XJ .first-element{padding-bottom: 2rem;}}@media (max-width: 992px){.cid-r88mQeL4XJ .contacts-block{text-align: center;}}.cid-r88mQeL4XJ .mbr-form .fieldset input,.cid-r88mQeL4XJ .mbr-form .fieldset textarea{background-color: #ffffff;color: #000000;border: 1px solid #767676;}.cid-r88mQeL4XJ .mbr-form .fieldset input::-webkit-input-placeholder{color: rgba(0,0,0,0.5);}.cid-r88mQeL4XJ .mbr-form .fieldset input::-moz-placeholder{color: rgba(0,0,0,0.5);}.cid-r88mQeL4XJ .mbr-form .fieldset textarea::-webkit-input-placeholder{color: rgba(0,0,0,0.5);}.cid-r88mQeL4XJ .mbr-form .fieldset textarea::-moz-placeholder{color: rgba(0,0,0,0.5);}.cid-r88mQeL4XJ .mbr-form .fieldset textarea{min-height: 200px;}@media (min-width: 992px){.cid-r88mQeL4XJ .main-row{margin-left: -2rem;margin-right: -2rem;}.cid-r88mQeL4XJ .main-row > *{padding-left: 2rem;padding-right: 2rem;}}.cid-r88mQeL4XJ .mbr-section-title{color: #000000;}.cid-r88mQeL4XJ .mbr-text{color: #000000;}.cid-rHYpt6VI9p{padding-top: 2rem;padding-bottom: 2rem;background-color: #767676;}.cid-rHYpt6VI9p .link-items .fLink{width: auto;}.cid-rHYpt6VI9p .mbr-row{margin: 0;}.cid-rHYpt6VI9p .mbr-row:nth-child(1){margin-bottom: 1rem;}[class*="-iconfont"]{display: inline-flex;}

        .mbr-flex{display: flex;}.mbr-jc-c{justify-content: center;}.mbr-row{display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;-webkit-flex-wrap: wrap;-ms-flex-wrap: wrap;flex-wrap: wrap;margin-right: -1rem;margin-left: -1rem;}.mbr-column{flex-direction: column;}@media (max-width: 767px){.mbr-col-sm-12{-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding-right: 1rem;padding-left: 1rem;}}@media (min-width: 768px){.mbr-col-md-4{-ms-flex: 0 0 33.333333%;flex: 0 0 33.333333%;max-width: 33.333333%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-md-6{-ms-flex: 0 0 50%;flex: 0 0 50%;max-width: 50%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-md-12{-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding-right: 1rem;padding-left: 1rem;}}@media (min-width: 992px){.mbr-col-lg-3{-ms-flex: 0 0 25%;flex: 0 0 25%;max-width: 25%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-lg-4{-ms-flex: 0 0 33.33%;flex: 0 0 33.33%;max-width: 33.33%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-lg-12{-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding-right: 1rem;padding-left: 1rem;}}.mbr-pt-2{padding-top: 1rem;}.mbr-pt-3{padding-top: 1.5rem;}.mbr-pt-4{padding-top: 2rem;}.mbr-pb-3{padding-bottom: 1.5rem;}.mbr-pb-4{padding-bottom: 2rem;}.mbr-px-2{padding-left: 1rem;padding-right: 1rem;}.mbr-px-4{padding-left: 2rem;padding-right: 2rem;}@media (max-width: 991px){.mbr-px-4{padding-left: 1rem;padding-right: 1rem;}}.mbr-m-auto{margin: auto;}amp-img{height: 100%;width: 100%;}amp-sidebar{background: transparent;}.amp-carousel-button{outline: none;border-radius: 50%;border: 10px transparent solid;transform: scale(1.5) translateY(-50%);height: 45px;width: 45px;transition: 0.4s;cursor: pointer;}.amp-carousel-button:hover{opacity: 1;}.amp-carousel-button-next{background-position: 75% 50%;}.amp-carousel-button-prev{background-position: 25% 50%;}.iconfont-wrapper{display: inline-block;width: 1.5rem;height: 1.5rem;}.amp-iconfont{vertical-align: middle;width: 1.5rem;height: 100%;font-size: 1.5rem;}body{font-family: Didact Gothic;}.display-2{font-family: 'Poppins',sans-serif;font-size: 2.5rem;line-height: 1.2;}.display-5{font-family: 'Poppins',sans-serif;font-size: 1.5rem;line-height: 1.2;}.display-7{font-family: 'Poppins',sans-serif;font-size: 1.1rem;line-height: 1.6;}@media (max-width: 768px){.display-2{font-size: 2rem;font-size: calc( 1.525rem + (2.5 - 1.525) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (1.525rem + (2.5 - 1.525) * ((100vw - 20rem) / (48 - 20))));}.display-5{font-size: 1.2rem;font-size: calc( 1.175rem + (1.5 - 1.175) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (1.175rem + (1.5 - 1.175) * ((100vw - 20rem) / (48 - 20))));}.display-7{font-size: 0.88rem;font-size: calc( 1.0350000000000001rem + (1.1 - 1.0350000000000001) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (1.0350000000000001rem + (1.1 - 1.0350000000000001) * ((100vw - 20rem) / (48 - 20))));}}.display-7 .mbr-iconfont-btn{font-size: 1.1rem;width: 1.1rem;}.btn{padding: 10px 30px;border-radius: 0px;}.btn-warning{position: relative;z-index: 1;}.btn-warning:after{z-index: -1;content: '';position: absolute;top: 0;left: 0;right: 0;bottom: 0;height: 100%;transition: 0.2s;width: 0;}.btn-warning,.btn-warning:active{background-color: #fac769;border-color: #fac769;color: #614003;}.btn-warning:hover,.btn-warning:focus{background-color: #fac769;border-color: #fac769;color: #fac769;}.btn-warning:hover:after{width: 100%;background-color: #fff;}.btn-warning:disabled{color: #614003;background-color: #fac769;border-color: #fac769;}.btn-primary{position: relative;z-index: 1;}.btn-primary:after{z-index: -1;content: '';position: absolute;top: 0;left: 0;right: 0;bottom: 0;height: 100%;transition: 0.2s;width: 0;}.btn-primary,.btn-primary:active{background-color: #7d5bd9;border-color: #7d5bd9;color: #ffffff;}.btn-primary:hover,.btn-primary:focus{background-color: #7d5bd9;border-color: #7d5bd9;color: #7d5bd9;}.btn-primary:hover:after{width: 100%;background-color: #fff;}.btn-primary:disabled{color: #ffffff;background-color: #7d5bd9;border-color: #7d5bd9;}.text-black{color: #010101;}a[class*="text-"],.amp-iconfont{transition: 0.2s ease-in-out;}.amp-iconfont{color: #7d5bd9;}a.text-black:hover,a.text-black:focus{color: #cccccc;}.features1 .card-wrapper,.features1 .card-title,.features1 .card-subtitle,.features1 span.amp-iconfont{transition: 0.3s;}
        .title-h3{color: #7d5bd9;font-size: 2.5rem;line-height: 1.2;font-weight: 700;}
        .card-wrapper {
          position: relative;
          border: 1px solid #cccccc;
          z-index: 1;
        }
        @media (max-width: 991px){.navbar .navbar-collapse{display: none;position: absolute;top: 0;right: 0;min-height: 100vh;padding: 70px 2rem 1rem;z-index: 1;}}
        @media (max-width: 991px){.navbar-nav{flex-direction: column;}}
        .nav-item {
          margin-right: 20px;
        }
        @media (max-width: 991px){.nav-item{margin-right: 0px;}.title-h3{font-size: 2rem;} .title-block h1{font-size: 2rem;} }
        `}</style>
      </head>
      <body>
        {/* (Copy your body content, menu/sidebar sections here) */}

        {/* AMP Sidebar */}
        <amp-sidebar id="sidebar" layout="nodisplay" side="right">
          <div className="builder-sidebar">
            <button on="tap:sidebar.close" className="close-sidebar">
              <span></span>
              <span></span>
            </button>
            <ul className="navbar-nav nav-dropdown nav-right">
              <li className="nav-item">
                <a href="/amphome">Home</a>
              </li>
              {/* <li className="nav-item">
                <a href="https://cadbull.com/features">Features</a>
              </li>
              <li className="nav-item">
                <a href="https://cadbull.com/contact-us">Contact Us</a>
              </li> */}
              {/* <li className="nav-item">
                <a href="https://cadbull.com/amplogin">Login</a>
              </li> */}
              {user ? (
                <>
                  <li className="nav-item"><a href="/ampprofile">{user.firstname}</a></li>
                  <li className="nav-item"><a href="/logout">Logout</a></li>
                </>
              ) : (
                <li className="nav-item"><a href="/login">Login</a></li>
              )}
  
            </ul>
          </div>
        </amp-sidebar>

        <section class="cid-r1xV7KHlhZ" id="header1-0">
          <div class="mbr-overlay"></div>
          <div class="container">
            <div class="align-left">
              <div class="title-block mbr-col-sm-12 mbr-col-md-12 mbr-col-lg-12">
                <h1 class="mbr-section-title mbr-fonts-style mbr-normal display-1">Welcome to Cadbull</h1>
                <h2 class="mbr-section-subtitle mbr-fonts-style mbr-pt-3 display-2">Download 150000+ Free And Premium Files</h2>
              </div>
            </div>
          </div>
        </section>
  
        {/* Navbar/Header */}
        <section className="menu1 menu horizontal-menu">
          <nav className="navbar navbar-dropdown navbar-expand-lg navbar-fixed-top">
            <div className="menu-container container">
              <div className="navbar-brand">
                <a href="/amphome">
                  <div className="navbar-logo">
                    <amp-img
                      src={logo.src}
                      layout="responsive"
                      width="50"
                      height="50"
                      alt="Logo"
                    ></amp-img>
                  </div>
                </a>
              </div>
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav nav-dropdown nav-right">
                  <li className="nav-item">
                    <a href="/amphome">Home</a>
                  </li>
                  {/* <li className="nav-item">
                    <a href="https://cadbull.com/features">Features</a>
                  </li>
                  <li className="nav-item">
                    <a href="https://cadbull.com/contact-us">Contact Us</a>
                  </li> */}
                  {/* <li className="nav-item">
                    <a href="https://cadbull.com/amplogin">Login</a>
                  </li> */}
  
                  {user ? (
                    <>
                      <li><a href="/ampprofile">{user.firstname}</a></li>
                      <li><a href="/logout">Logout</a></li>
                    </>
                  ) : (
                    <li><a href="/auth/login">Login</a></li>
                  )}
                </ul>
              </div>
              <button on="tap:sidebar.toggle" className="ampstart-btn hamburger">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </nav>
        </section>

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

        {/* Contact Section */}
        <section className="contacts7 map">
          <div className="container-fluid">
            <div className="title mbr-pb-4 align-center">
              <h3 className="title-h3">Contact Us</h3>
            </div>
            <div className="mbr-row mbr-px-2 mbr-jc-c">
              <div className="card mbr-col-sm-12 mbr-col-md-6 mbr-col-lg-3 align-center md-pb">
                <div className="card-wrapper mbr-flex mbr-column mbr-pt-3 mbr-px-4 mbr-pb-3">
                  <div className="card-img align-center">
                    <div class="iconfont-wrapper">
                      <span class="amp-iconfont fa-map-marker fa"><svg width="100%" height="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M1152 640q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm256 0q0 109-33 179l-364 774q-16 33-47.5 52t-67.5 19-67.5-19-46.5-52l-365-774q-33-70-33-179 0-212 150-362t362-150 362 150 150 362z"></path></svg></span>
                    </div>
                  </div>
                  <div className="card-box mbr-pt-3">
                    <h4 className="card-title mbr-bold mbr-fonts-style display-5">Address</h4>
                    <p className="card-text mbr-fonts-style mbr-pt-2 display-7">403 Fortune Business Hub, Beside Science City, Sola, Ahmedabad - India</p>
                  </div>
                </div>
              </div>
              <div className="card mbr-col-sm-12 mbr-col-md-6 mbr-col-lg-3 align-center md-pb">
                <div className="card-wrapper mbr-flex mbr-column mbr-pt-3 mbr-px-4 mbr-pb-3">
                  <div className="card-img align-center">
                    <div class="iconfont-wrapper">
                      <span class="amp-iconfont fa-phone fa"><svg width="100%" height="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-53-3.5t-57.5-12.5-47-14.5-55.5-20.5-49-18q-98-35-175-83-127-79-264-216t-216-264q-48-77-83-175-3-9-18-49t-20.5-55.5-14.5-47-12.5-57.5-3.5-53q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"></path></svg></span>
                    </div>
                  </div>
                  <div className="card-box mbr-pt-3">
                    <h4 className="card-title mbr-bold mbr-fonts-style display-5">Phone</h4>
                    <p className="card-text mbr-fonts-style mbr-pt-2 display-7">+91 9898748697</p>
                  </div>
                </div>
              </div>
              <div className="card mbr-col-sm-12 mbr-col-md-6 mbr-col-lg-3 align-center">
                <div className="card-wrapper mbr-flex mbr-column mbr-pt-3 mbr-px-4 mbr-pb-3">
                  <div className="card-img align-center">
                    <div class="iconfont-wrapper">
                      <span class="amp-iconfont fa-envelope-o fa"><svg width="100%" height="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M1664 1504v-768q-32 36-69 66-268 206-426 338-51 43-83 67t-86.5 48.5-102.5 24.5h-2q-48 0-102.5-24.5t-86.5-48.5-83-67q-158-132-426-338-37-30-69-66v768q0 13 9.5 22.5t22.5 9.5h1472q13 0 22.5-9.5t9.5-22.5zm0-1051v-24.5l-.5-13-3-12.5-5.5-9-9-7.5-14-2.5h-1472q-13 0-22.5 9.5t-9.5 22.5q0 168 147 284 193 152 401 317 6 5 35 29.5t46 37.5 44.5 31.5 50.5 27.5 43 9h2q20 0 43-9t50.5-27.5 44.5-31.5 46-37.5 35-29.5q208-165 401-317 54-43 100.5-115.5t46.5-131.5zm128-37v1088q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-1088q0-66 47-113t113-47h1472q66 0 113 47t47 113z"></path></svg></span>
                    </div>
                  </div>
                  <div className="card-box mbr-pt-3">
                    <h4 className="card-title mbr-bold mbr-fonts-style display-5">E-mail</h4>
                    <p className="card-text mbr-fonts-style mbr-pt-2 display-7">support@cadbull.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
