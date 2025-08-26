import Head from "next/head";
// import fetch from "node-fetch"; // Or just fetch() in latest Next.js
import axios from "axios";
import logo from "@/assets/images/logo.png";
// AMP config: Export this to make page AMP-only
export const config = { amp: true };

// // ✅ ADD THIS HELPER FUNCTION HERE
// function slugify(text) {
//   if (!text) return "";
//   return text
//     .toString()
//     .toLowerCase()
//     .replace(/\s+/g, '-')           // Replace spaces with -
//     .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
//     .replace(/\-\-+/g, '-')         // Replace multiple - with single -
//     .replace(/^-+/, '')             // Trim - from start of text
//     .replace(/-+$/, '');            // Trim - from end of text
// }
// --- Old site slug function (matches detail page) ---
function slugify(text) {
  if (!text) return '';
  return text
    .replace(/\s+/g, '-')      // spaces -> -
    .replace(/\-+/g, '-')      // collapse --
    .replace(/^\-+|\-+$/g, ''); // trim -
}


export async function getServerSideProps(context) {
  const { params, req } = context;
  const { id } = params;
  let productData = null;
  let similarProjects = [];
  let publisher = null;

  // Example: read cookie
  const cookie = req.headers.cookie || "";
  
  // Pass cookie to API (if needed for auth endpoints)
  const apiConfig = { headers: { cookie } };

  try {
    // Try to fetch product
    const productRes = await axios(`${process.env.NEXT_PUBLIC_API_MAIN}/projects/${id}`);
    productData = productRes.data;

    // ✅ LOG THE MAIN PRODUCT IMAGE FILENAME
    // console.log("--- AMP Page Debug ---");
    // console.log("✔️ Main Product Image Filename:", productData?.image);
  } catch (e) {
    // 404 from backend, product not found
    return { notFound: true }; // Next.js will show 404 page
  }

  try {
    // Fetch similar projects if product exists
    // console.log(productData, "productData");
    
    const subcatId = productData?.product_sub_category_id;
    // console.log(subcatId, "subcatId");
    
    if (subcatId) {
      const simRes = await axios(
        `${process.env.NEXT_PUBLIC_API_MAIN}/projects/sub/${subcatId}?page=1&pageSize=3&excludeIds=${id}`
      );
      similarProjects = simRes.data?.projects || [];
      // console.log(similarProjects, "similar projects");
      
    }
  } catch (e) {
    // Just log, don't crash
    similarProjects = [];
  }

  const categoryName = productData?.product_category_title || "";
  const subcategoryName = productData?.product_subcategory_title || "";


  try {
    // Fetch publisher info
    if (productData?.user_id || productData?.profile_id) {
      const pubRes = await axios(
        `${process.env.NEXT_PUBLIC_API_MAIN}/profile/author/${productData.profile_id || productData.user_id}`
      );
      publisher = pubRes.data || null;
      // console.log("✔️ Publisher Data Fetched:", publisher);
    }
  } catch (e) {
    publisher = null;
  }

  // subcategory = productData?.category || {};

  // Optionally, get user info if logged in
  let user = null;
  try {
    const userRes = await axios(`${process.env.NEXT_PUBLIC_API_MAIN}/users/user-data`, apiConfig); // replace with your user/me endpoint
    user = userRes.data.user;
  } catch (e) {
    user = null;
  }

  return {
    props: {
      product: productData,
      similar: similarProjects,
      publisher,
      categoryName,
      subcategoryName,
      user
    },
  };
}


export default function AmpProductPage({ product, similar, publisher, categoryName, subcategoryName, user }) {
  const title = product?.work_title || "Product";
  const description = product?.description || "";
  const imageUrl = product?.image
    ? `https://beta-assets.cadbull.com/product_img/original/${product.image}`
    : "https://cadbull.com/default-img.png";
  // This is the correct code
  const profilePic =
    publisher?.profile?.profile_pic
      ? publisher.profile.profile_pic // Use the full URL directly from the API
      : "https://beta-assets.cadbull.com/assets/icons/profile.png"; // Fallback URL
  // const canonical = `https://cadbull.com/detail/${product?.id}/${slugify(product?.work_title || "")}`;

  const canonicalSlug =
    (product?.slug || slugify(product?.work_title || ""));

  // const ogUrl = `https://cadbull.com/amp/${product?.id}/${encodeURIComponent(product?.work_title || "")}`;

  const canonical = `https://cadbull.com/amp/${product?.id}/${canonicalSlug}`;
  const ogUrl = `https://cadbull.com/amp/${product?.id}/${canonicalSlug}`;

  // Helper for SVG icons
  const FileIcon = () => (
    <span className="amp-iconfont mbri-file">
      {/* ...Paste SVG from your original code if needed... */}
    </span>
  );

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" /> */}
        <link
          rel="shortcut icon"
          href="/favicon.ico"
        />
        <link rel="preconnect" href="https://beta-assets.cadbull.com" crossorigin />

        <meta name="description" content={description} />
        <meta name="keywords" content={product?.tags || ""} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${product?.work_title} - CAD Drawing from Cadbull AMP`} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:site_name" content="Cadbull" />
        <meta property="fb:app_id" content="1018457459282520" />
        
        {/* Pinterest specific tags */}
        <meta name="pinterest-rich-pin" content="true" />
        <meta property="og:locale" content="en_US" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cadbull" />
        <meta name="twitter:creator" content="@cadbull" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:image:alt" content={`${product?.work_title} - CAD Drawing from Cadbull AMP`} />
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
        <meta name="theme-color" content="#7d5bd9" />
        {/* Removed all <script> tags from <Head> as Next.js AMP injects them automatically */}
        {/* AMP Boilerplate CSS */}
        <style amp-boilerplate="">{`body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`}</style>
        <noscript>
          <style amp-boilerplate="">{`body{-webkit-animation:none;animation:none}`}</style>
        </noscript>

        <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>
        <script async custom-element="amp-auto-ads" src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"></script>
        
        <script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>
        <script async custom-element="amp-sidebar"   src="https://cdn.ampproject.org/v0/amp-sidebar-0.1.js"></script>
        <script async custom-element="amp-lightbox-gallery" src="https://cdn.ampproject.org/v0/amp-lightbox-gallery-0.1.js"></script>

        <style amp-custom>{`
          div,span,h1,h2,h3,h4,p,a,ul,li{font: inherit;}*{box-sizing: border-box;outline: none;}*:focus{outline: none;}body{position: relative;font-style: normal;line-height: 1.5;color: #000000;}section{background-color: #ffffff;background-position: 50% 50%;background-repeat: no-repeat;background-size: cover;overflow: hidden;padding: 30px 30px;}section,.container-fluid{position: relative;word-wrap: break-word;margin-right: auto;margin-left: auto;padding-left: 1rem;padding-right: 1rem;}.title-block h1{font-size: 2.5rem;line-height: 1.2;font-weight: 700;}.title-block h2{font-size: 1.1rem;line-height: 1.6;padding-top: 1.5rem;}h1,h2,h3,h4{margin: 0;padding: 0;}p,li{letter-spacing: 0.5px;line-height: 1.7;}ul,p{margin-bottom: 0;margin-top: 0;}a{cursor: pointer;}a,a:hover{text-decoration: none;}h1,h2,h3,h4,.display-2,.display-5,.display-7{word-break: break-word;word-wrap: break-word;}body{height: auto;min-height: 100vh;}.mbr-section-title{margin: 0;padding: 0;font-style: normal;line-height: 1.2;width: 100%;}.mbr-section-subtitle{line-height: 1.3;width: 100%;}.btn{text-align: center;position: relative;margin: .4rem .8rem;font-weight: 700;border-width: 2px;border-style: solid;font-style: normal;white-space: normal;transition: all .2s ease-in-out,box-shadow 2s ease-in-out;display: inline-flex;align-items: center;justify-content: center;word-break: break-word;line-height: 1.5;letter-spacing: 1px;}.card-title{margin: 0;}.card-img{border-radius: 0;width: auto;flex-shrink: 0;}.card{position: relative;background-color: transparent;border: none;border-radius: 0;width: 100%;padding-left: 1rem;padding-right: 1rem;}@media (max-width: 767px){.card:not(.last-child){padding-bottom: 2rem;}}.card .card-wrapper{height: 100%;}@media (max-width: 767px){.card .card-wrapper{flex-direction: column;}}@media (max-width: 991px){.md-pb{padding-bottom: 2rem;}}.gallery-img-wrap amp-img{height: 100%;}.icons-list a{margin-right: 1rem;}.icons-list a:last-child{margin-right: 0;}amp-image-lightbox a.control{position: absolute;width: 32px;height: 32px;right: 48px;top: 32px;z-index: 1000;}amp-image-lightbox a.control .close{position: relative;}amp-image-lightbox a.control .close:before,amp-image-lightbox a.control .close:after{position: absolute;left: 15px;content: ' ';height: 33px;width: 2px;background-color: #fff;}amp-image-lightbox a.control .close:before{transform: rotate(45deg);}amp-image-lightbox a.control .close:after{transform: rotate(-45deg);}.align-left{text-align: left;}.align-center{text-align: center;}@media (max-width: 767px){.align-left,.align-center{text-align: center;}}.mbr-bold{font-weight: 700;}.mbr-section-btn{margin-left: -.8rem;margin-right: -.8rem;}.btn .mbr-iconfont{cursor: pointer;margin-right: 0.5rem;}section.menu{min-height: 70px;}.menu-container{display: flex;justify-content: space-between;align-items: center;min-height: 70px;}@media (max-width: 991px){.menu-container{max-width: 100%;padding: 0 2rem;}}@media (max-width: 767px){.menu-container{padding: 0 1rem;}}.navbar{z-index: 100;width: 100%;}.navbar-fixed-top{position: fixed;top: 0;}.navbar-brand{display: flex;align-items: center;word-break: break-word;z-index: 1;}.navbar-logo{margin-right: .8rem;}@media (max-width: 767px){.navbar-logo amp-img{max-height: 45px;max-width: 150px;}}.navbar .navbar-collapse{display: flex;flex-basis: auto;align-items: center;justify-content: flex-end;}.navbar-nav{list-style-type: none;display: flex;flex-wrap: wrap;padding-left: 0;min-width: 10rem;}.nav-item{word-break: break-all;}.nav-link{display: flex;align-items: center;justify-content: center;}.nav-link{transition: all 0.2s;letter-spacing: 1px;}.hamburger span{position: absolute;right: 0;width: 30px;height: 2px;border-right: 5px;}.hamburger span:nth-child(1){top: 0;transition: all .2s;}.hamburger span:nth-child(2){top: 8px;transition: all .15s;}.hamburger span:nth-child(3){top: 8px;transition: all .15s;}.hamburger span:nth-child(4){top: 16px;transition: all .2s;}.ampstart-btn.hamburger{position: absolute;top: 25px;right: 35px;margin-left: auto;width: 30px;height: 20px;background: none;border: none;cursor: pointer;z-index: 1000;}@media (min-width: 992px){.ampstart-btn,amp-sidebar{display: none;}}.close-sidebar{width: 30px;height: 30px;position: relative;cursor: pointer;background-color: transparent;border: none;}.close-sidebar span{position: absolute;left: 0;width: 30px;height: 2px;border-right: 5px;}.close-sidebar span:nth-child(1){transform: rotate(45deg);}.close-sidebar span:nth-child(2){transform: rotate(-45deg);}.builder-sidebar{position: relative;min-height: 100vh;z-index: 1030;padding: 1rem 2rem;max-width: 20rem;}amp-img{width: 100%;}amp-img img{max-height: 100%;max-width: 100%;}.is-builder amp-img > a + img[async],.is-builder amp-img > a + img[decoding="async"]{display: none;}html:not(.is-builder) amp-img > a{position: absolute;top: 0;bottom: 0;left: 0;right: 0;z-index: 1;}.is-builder .temp-amp-sizer{position: absolute;}.is-builder amp-youtube .temp-amp-sizer,.is-builder amp-vimeo .temp-amp-sizer{position: static;}.is-builder section.horizontal-menu .ampstart-btn{display: none;}div.placeholder{z-index: 4;background: rgba(255,255,255,0.5);}div.placeholder svg{position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);width: 20%;height: auto;}div.placeholder svg circle.big{animation: big-anim 3s linear infinite;}div.placeholder svg circle.small{animation: small-anim 1.5s linear infinite;}@keyframes big-anim{from{stroke-dashoffset: 900;}to{stroke-dashoffset: 0;}}@keyframes small-anim{from{stroke-dashoffset: 850;}to{stroke-dashoffset: 0;}}.placeholder-loader .amp-active > div{display: none;}.container{padding-right: 1rem;padding-left: 1rem;width: 100%;margin-right: auto;margin-left: auto;}@media (max-width: 767px){.container{max-width: 540px;}}@media (min-width: 768px){.container{max-width: 720px;}}@media (min-width: 992px){.container{max-width: 960px;}}@media (min-width: 1200px){.container{max-width: 1140px;}}.container-fluid{width: 100%;margin-right: auto;margin-left: auto;padding-left: 1rem;padding-right: 1rem;}.mbr-flex{display: flex;}.mbr-jc-c{justify-content: center;}.mbr-row{display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;-webkit-flex-wrap: wrap;-ms-flex-wrap: wrap;flex-wrap: wrap;margin-right: -1rem;margin-left: -1rem;}.mbr-column{flex-direction: column;}@media (max-width: 767px){.mbr-col-sm-12{-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding-right: 1rem;padding-left: 1rem;}}@media (min-width: 768px){.mbr-col-md-4{-ms-flex: 0 0 33.333333%;flex: 0 0 33.333333%;max-width: 33.333333%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-md-6{-ms-flex: 0 0 50%;flex: 0 0 50%;max-width: 50%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-md-12{-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding-right: 1rem;padding-left: 1rem;}}@media (min-width: 992px){.mbr-col-lg-3{-ms-flex: 0 0 25%;flex: 0 0 25%;max-width: 25%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-lg-4{-ms-flex: 0 0 33.33%;flex: 0 0 33.33%;max-width: 33.33%;padding-right: 1rem;padding-left: 1rem;}.mbr-col-lg-12{-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding-right: 1rem;padding-left: 1rem;}}.mbr-pt-2{padding-top: 1rem;}.mbr-pt-3{padding-top: 1.5rem;}.mbr-pt-4{padding-top: 2rem;}.mbr-pb-3{padding-bottom: 1.5rem;}.mbr-pb-4{padding-bottom: 2rem;}.mbr-px-2{padding-left: 1rem;padding-right: 1rem;}.mbr-px-4{padding-left: 2rem;padding-right: 2rem;}@media (max-width: 991px){.mbr-px-4{padding-left: 1rem;padding-right: 1rem;}}.mbr-m-auto{margin: auto;}amp-img{height: 100%;width: 100%;}amp-sidebar{background: transparent;}.amp-carousel-button{outline: none;border-radius: 50%;border: 10px transparent solid;transform: scale(1.5) translateY(-50%);height: 45px;width: 45px;transition: 0.4s;cursor: pointer;}.amp-carousel-button:hover{opacity: 1;}.amp-carousel-button-next{background-position: 75% 50%;}.amp-carousel-button-prev{background-position: 25% 50%;}.iconfont-wrapper{display: inline-block;width: 1.5rem;height: 1.5rem;}.amp-iconfont{vertical-align: middle;width: 1.5rem;height: 100%;font-size: 1.5rem;}body{font-family: Didact Gothic;}.display-2{font-family: 'Poppins',sans-serif;font-size: 2.5rem;line-height: 1.2;}.display-5{font-family: 'Poppins',sans-serif;font-size: 1.5rem;line-height: 1.2;}.display-7{font-family: 'Poppins',sans-serif;font-size: 1.1rem;line-height: 1.6;}@media (max-width: 768px){.display-2{font-size: 2rem;font-size: calc( 1.525rem + (2.5 - 1.525) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (1.525rem + (2.5 - 1.525) * ((100vw - 20rem) / (48 - 20))));}.display-5{font-size: 1.2rem;font-size: calc( 1.175rem + (1.5 - 1.175) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (1.175rem + (1.5 - 1.175) * ((100vw - 20rem) / (48 - 20))));}.display-7{font-size: 0.88rem;font-size: calc( 1.0350000000000001rem + (1.1 - 1.0350000000000001) * ((100vw - 20rem) / (48 - 20)));line-height: calc( 1.4 * (1.0350000000000001rem + (1.1 - 1.0350000000000001) * ((100vw - 20rem) / (48 - 20))));}}.display-7 .mbr-iconfont-btn{font-size: 1.1rem;width: 1.1rem;}.btn{padding: 10px 30px;border-radius: 0px;}.btn-warning{position: relative;z-index: 1;}.btn-warning:after{z-index: -1;content: '';position: absolute;top: 0;left: 0;right: 0;bottom: 0;height: 100%;transition: 0.2s;width: 0;}.btn-warning,.btn-warning:active{background-color: #fac769;border-color: #fac769;color: #614003;}.btn-warning:hover,.btn-warning:focus{background-color: #fac769;border-color: #fac769;}.btn-warning:hover:after{width: 100%;background-color: #fff;}.btn-warning:disabled{color: #614003;background-color: #fac769;border-color: #fac769;}.btn-primary{position: relative;z-index: 1;}.btn-primary:after{z-index: -1;content: '';position: absolute;top: 0;left: 0;right: 0;bottom: 0;height: 100%;transition: 0.2s;width: 0;}.btn-primary,.btn-primary:active{background-color: #7d5bd9;border-color: #7d5bd9;color: #ffffff;}.btn-primary:hover,.btn-primary:focus{background-color: #7d5bd9;border-color: #7d5bd9;}.btn-primary:hover:after{width: 100%;background-color: #fff;}.btn-primary:disabled{color: #ffffff;background-color: #7d5bd9;border-color: #7d5bd9;}.text-black{color: #010101;}a[class*="text-"],.amp-iconfont{transition: 0.2s ease-in-out;}.amp-iconfont{color: #7d5bd9;}a.text-black:hover,a.text-black:focus{color: #cccccc;}.features1 .card-wrapper,.features1 .card-title,.features1 .card-subtitle,.features1 span.amp-iconfont{transition: 0.3s;}
          .features1 .card:hover .card-wrapper:after{background-color: #222222;}.features1 .card:hover .card-title,.features1 .card:hover .card-subtitle,.features1 .card:hover span.amp-iconfont{color: #f6f6f6;}.team1 .card .card-box,.team1 .card .card-title,.team1 .card .card-subtitle,.team1 .card .amp-iconfont{transition: 0.2s ease-in-out;}.team1 .card .card-box{display: flex;text-align: center;align-content: center;flex-direction: column;justify-content: center;opacity: 0;}@media (max-width: 767px){.team1 .card .card-box{background-color: #7d5bd9;opacity: 1;}.team1 .card .card-box .card-title,.team1 .card .card-box .card-subtitle,.team1 .card .card-box .amp-iconfont{color: #f6f6f6;}}.team1 .card:hover .card-box{background-color: #7d5bd9;opacity: 1;}.team1 .card:hover .card-title,.team1 .card:hover .card-subtitle,.team1 .card:hover .amp-iconfont{color: #f6f6f6;}.team1 .card-wrapper{position: relative;}.team1 .card-wrapper .card-box{pointer-events: none;}@media (min-width: 768px){.team1 .card-wrapper .card-box{position: absolute;top: 0;bottom: 0;left: 0;right: 0;padding: 1.5rem 2rem;}}@media (max-width: 767px){.team1 .card-wrapper .card-box{position: relative;padding: 2rem 1rem;}}.team1 .card-wrapper .card-box > *{pointer-events: all;}.cid-r1Dtil7YY5{background-color: #ffffff;}.navbar{background: #ffffff;}.navbar-brand .navbar-logo{max-height: 120px;min-width: 30px;max-width: 120px;}.navbar-brand .navbar-logo amp-img{object-fit: contain;height: 45px;width: 150px;}@media (max-width: 991px){.navbar .navbar-collapse{background: #ffffff;}}.nav-link{margin: .667em 1em;padding: 0;}.hamburger span{background-color: #232323;}.builder-sidebar{background-color: #ffffff;}.close-sidebar:focus{outline: 2px auto #7d5bd9;}.close-sidebar span{background-color: #232323;}.cid-rFCR1GdfS2{padding-top: 2rem;padding-bottom: 2rem;background-color: #efefef;align-items: center;display: flex;}.cid-rFCR1GdfS2 .mbr-section-title{color: #000000;}.cid-rFCR1GdfS2 .mbr-section-subtitle{color: #000000;}.cid-rFCR1GdfS2 .mbr-section-title{text-align: left;}.cid-rFCQBqQV15{padding-top: 2rem;padding-bottom: 2rem;background-color: #ffffff;}.cid-rFCUSfIaax{padding-top: 2rem;padding-bottom: 2rem;background-color: #ffffff;}.cid-rFCUSfIaax .card-wrapper{position: relative;border: 1px solid #cccccc;z-index: 1;}@media (max-width: 991px){.cid-rFCUSfIaax .card-wrapper{flex-wrap: wrap;}}.cid-rFCUSfIaax .card-wrapper:after{content: "";position: absolute;left: 0;right: 0;top: 0;bottom: 0;background-color: #efefef;opacity: 0.5;z-index: -1;}.cid-rFCUSfIaax .card-box{width: 100%;}.cid-rFCUSfIaax .iconfont-wrapper{height: 2.5rem;width: 2.5rem;display: inline-block;}.cid-rFCUSfIaax .iconfont-wrapper .amp-iconfont{color: #7d5bd9;transition: color 0.2s;vertical-align: bottom;}@media (min-width: 768px){.cid-rFCUSfIaax .iconfont-wrapper .amp-iconfont{font-size: 2.5rem;width: 2.5rem;}}@media (max-width: 767px){.cid-rFCUSfIaax .iconfont-wrapper .amp-iconfont{font-size: 2.5rem;width: 2.5rem;}}.cid-rFCUSfIaax .mbr-section-title{color: #7d5bd9;}.cid-rFCYhX3uaX{padding-top: 30px;padding-bottom: 30px;background-color: #ffffff;}.cid-rFCYhX3uaX .card-img{width: 100%;}.cid-rFCYhX3uaX .icons-list .iconfont-wrapper{width: 2rem;height: 2rem;display: inline-block;}.cid-rFCYhX3uaX .icons-list .amp-iconfont{font-size: 2rem;width: 2rem;color: #7d5bd9;vertical-align: middle;}.cid-rFCYhX3uaX .mbr-section-title{color: #7d5bd9;}.cid-rFD1fLKd4z{padding-top: 1rem;padding-bottom: 1rem;background-color: #efefef;}.cid-rFD1fLKd4z .card-wrapper{border: 1px solid #cccccc;}@media (max-width: 991px){.cid-rFD1fLKd4z .card-wrapper{flex-wrap: wrap;}}.cid-rFD1fLKd4z .card-box{width: 100%;}.cid-rFD1fLKd4z .iconfont-wrapper{display: inline-block;width: 3rem;height: 3rem;}.cid-rFD1fLKd4z .amp-iconfont{color: #7d5bd9;vertical-align: middle;}@media (min-width: 768px){.cid-rFD1fLKd4z .amp-iconfont{font-size: 3rem;width: 3rem;}}@media (max-width: 767px){.cid-rFD1fLKd4z .amp-iconfont{font-size: 2.5rem;width: 2.5rem;}}.cid-rFD1fLKd4z .mbr-section-title{color: #7d5bd9;}.cid-rFD1fLKd4z .mbr-section-subtitle{color: #000000;}.cid-rFD1fLKd4z .card-title{color: #000000;}.cid-rFD1fLKd4z .card-text{color: #000000;}.cid-rFCRYrDjNw{padding-top: 2rem;padding-bottom: 2rem;background-color: #ffffff;align-items: center;display: flex;}@media (max-width: 767px){.cid-rFCRYrDjNw .title-block{padding-left: 0;padding-right: 0;}}.cid-rFD1MutxkD{padding-top: 1rem;padding-bottom: 1rem;background-color: #ffffff;}.cid-rFD2djIsb5{padding-top: 2rem;padding-bottom: 2rem;background-color: #ffffff;}.cid-rFD2djIsb5 .item{margin-bottom: 2rem;cursor: pointer;}.cid-rFD2djIsb5 .item-wrapper{width: 100%;position: relative;}.cid-rFD2djIsb5 .item-sign{position: absolute;left: 0;right: 0;bottom: 0;padding: 10px;z-index: 1;text-align: center;background-color: rgba(0,0,0,0.6);color: #ffffff;}.cid-rFD2djIsb5 .item-box-img amp-img{height: auto;}.cid-rFD2djIsb5 amp-img:after{content: "";pointer-events: none;transition: 0.4s;position: absolute;top: 0;left: 0;right: 0;bottom: 0;opacity: 0;background-color: rgba(125,91,217,0.4);}.cid-rFD2djIsb5 amp-img:hover:after{opacity: 1;}.cid-rFD2djIsb5 .icon-wrap{position: absolute;left: 0;top: 0;right: 0;bottom: 0;margin: auto;opacity: 0;transition: 0.4s;height: 1.5rem;width: 1.5rem;z-index: 2;}.cid-rFD2djIsb5 .icon-wrap span{color: #ffffff;font-size: 1.5rem;}.cid-rFD2djIsb5 amp-img:hover .icon-wrap{opacity: 1;}.cid-rFD2djIsb5 .mbr-section-title,.cid-rFD2djIsb5 .mbr-section-subtitle{text-align: center;}.cid-rFD2djIsb5 .mbr-section-title{text-align: center;}[class*="-iconfont"]{display: inline-flex;}.display-same{margin:auto; padding-left:60px; padding-right:60px;}.ads-style{border-style: groove;border-right: none;border-left: none;border-color: cornsilk; padding: 6px; }
          .thickhr{border-style: groove; border-color:cornsilk; }.title-h3{color: #7d5bd9;font-size: 2.5rem;line-height: 1.2;font-weight: 700;}.mbr-bold{font-weight: 700;}.title-h4{font-size: 1.5rem;line-height: 1.2;}.pt-2{padding-top: 1rem;}
          .card-wrapper {
            position: relative;
            border: 1px solid #cccccc;
            z-index: 1;
          }
          .publisher-card {
            width: 40%;
          }
          .text-center {
            text-align: center;
          }
          .file-card {
            position: relative;
            background-color: transparent;
            border: none;
            border-radius: 0;
            width: 100%;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .file-card .card-wrapper {
              height: 100%;
          } 
          @media (max-width: 991px){.navbar .navbar-collapse{display: none;position: absolute;top: 0;right: 0;min-height: 100vh;padding: 70px 2rem 1rem;z-index: 1;}}
          @media (max-width: 991px){.navbar-nav{flex-direction: column;}}
          .nav-item {
            margin-right: 20px;
          }
          @media (max-width: 991px){.nav-item{margin-right: 0px;}.title-h3{font-size: 2rem;} .title-block h1{font-size: 2rem;} }
        `}</style>
      </Head>

      {/* AMP Sidebar */}
      {/* <amp-sidebar id="sidebar" className="cid-r1Dtil7YY5 i-amphtml-element i-amphtml-layout-nodisplay i-amphtml-overlay i-amphtml-scrollable i-amphtml-built" layout="nodisplay" side="right"> */}
      <amp-sidebar id="sidebar" layout="nodisplay" side="right">
        <div className="builder-sidebar" id="builder-sidebar">
          <button on="tap:sidebar.close" className="close-sidebar">
            <span></span>
            <span></span>
          </button>
          <ul className="navbar-nav nav-dropdown nav-right">
            <li className="nav-link mbr-bold link text-black display-7">
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
                <li className="nav-link mbr-bold link text-black display-7"><a href="/profile/edit">{user.firstname}</a></li>
                <li className="nav-link mbr-bold link text-black display-7"><a href="/logout">Logout</a></li>
              </>
            ) : (
              <li className="nav-link mbr-bold link text-black display-7"><a href="/login">Login</a></li>
            )}

          </ul>
        </div>
      </amp-sidebar>

      {/* Navbar/Header */}
      <section className="menu1 menu horizontal-menu cid-r1Dtil7YY5" id="menu1-15">
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
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav nav-dropdown nav-right">
                <li className="nav-item">
                  <a className="nav-link mbr-bold link text-black display-7" href="/amphome">Home</a>
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
                    <li><a href="/ampprofile" className="nav-link mbr-bold link text-black display-7">{user.firstname}</a></li>
                    <li><a href="/logout" className="nav-link mbr-bold link text-black display-7">Logout</a></li>
                  </>
                ) : (
                  <li><a href="/auth/login" className="nav-link mbr-bold link text-black display-7">Login</a></li>
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

      {/* Product Title/Description */}
      <section className="heading-section header1 cid-rFCR1GdfS2">
        <div className="container-fluid">
          <div className="mbr-row align-left">
            <div className="title-block">
              <h1>{title}</h1>
              <h2>{description}</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Product Image */}
      <section>
        <div className="container-fluid">
          <div className="image-block align-center">
            <amp-img
              className="placeholder-loader architect-img"
              src={imageUrl}
              alt={title}
              layout="responsive"
              width="1248"
              height="832"
            ></amp-img>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <section className="features1 align-center ads-style">
        Sponsored Links
        <hr className="thickhr" />
        <amp-ad
          width="100vw"
          height="320"
          type="adsense"
          data-ad-client="ca-pub-2488270605722778"
          data-ad-slot="4998271502"
          data-auto-format="rspv"
          data-full-width=""
        >
          <div overflow></div>
        </amp-ad>
      </section>

      {/* File Details */}
      <section className="features1 cid-rFCUSfIaax">
        <div className="container">
          <div className="title-wrap align-center mbr-pb-4">
            <h3 className="title-h3">File Details</h3>
            <h4 className="title-h4">Details about publisher and file.</h4>
          </div>
          <div className="mbr-row">
            {/* File type */}
            <div className="file-card mbr-col-sm-12 mbr-col-md-6 mbr-col-lg-3 align-center md-pb">
              <div className="card-wrapper mbr-flex mbr-column mbr-pt-3 mbr-pb-3 mbr-px-4">
                <div className="card-img align-center mbr-pb-3">
                  <div className="iconfont-wrapper">
                    <span className="amp-iconfont mbri-file"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M20.656 2.667c-0.368 0.006-0.662 0.298-0.656 0.667v2.654c0 1.103 0.91 2.013 2.013 2.013h2.654c0.894 0 0.864-1.333 0-1.333h-2.654c-0.387 0-0.68-0.292-0.68-0.68v-2.654c0.006-0.376-0.301-0.673-0.677-0.667zM6.013 0c-1.103 0-2.013 0.91-2.013 2.013v27.974c0 1.103 0.91 2.013 2.013 2.013h19.974c1.103 0 2.013-0.91 2.013-2.013v-22.654c-0-0.177-0.070-0.346-0.195-0.471l-6.667-6.667c-0.125-0.125-0.295-0.195-0.471-0.195zM6.013 1.333h14.378l6.276 6.276v22.378c0 0.387-0.292 0.68-0.68 0.68h-19.974c-0.388 0-0.68-0.292-0.68-0.68v-27.974c0-0.387 0.292-0.68 0.68-0.68zM8.667 12h14.667c0.369 0 0.667 0.297 0.667 0.667s-0.297 0.667-0.667 0.667h-14.667c-0.369 0-0.667-0.297-0.667-0.667s0.297-0.667 0.667-0.667zM8.667 16h14.667c0.369 0 0.667 0.297 0.667 0.667s-0.297 0.667-0.667 0.667h-14.667c-0.369 0-0.667-0.297-0.667-0.667s0.297-0.667 0.667-0.667zM8.667 20h14.667c0.369 0 0.667 0.297 0.667 0.667s-0.297 0.667-0.667 0.667h-14.667c-0.369 0-0.667-0.297-0.667-0.667s0.297-0.667 0.667-0.667z"></path>
                    </svg></span>
                  </div>
                </div>
                <div className="card-box">
                  <h3 className="card-title mbr-bold mbr-fonts-style display-5">File type</h3>
                  <h4 className="card-subtitle mbr-pt-3 mbr-fonts-style display-7">
                    <span className="font-normal">
                      {product.file_type || "-"}
                    </span>
                  </h4>
                </div>
              </div>
            </div>
            {/* Category */}
            <div className="file-card mbr-col-sm-12 mbr-col-md-6 mbr-col-lg-3 align-center md-pb">
              <div className="card-wrapper mbr-flex mbr-column mbr-pt-3 mbr-pb-3 mbr-px-4">
                <div className="card-img align-center mbr-pb-3">
                  {/* SVG icon */}
                  <div className="iconfont-wrapper">
                    <span className="amp-iconfont mbri-folder"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M2 2.667c-1.096 0-2 0.904-2 2v22.667c0 1.096 0.904 2 2 2h28c1.096 0 2-0.904 2-2v-18.667c-0-0.368-0.299-0.667-0.667-0.667h-15.724l-5.138-5.138c-0.121-0.121-0.287-0.195-0.471-0.195h-8zM2 4h7.724l5.138 5.138c0.121 0.121 0.287 0.195 0.471 0.195h15.333v18c0 0.381-0.286 0.667-0.667 0.667h-28c-0.381 0-0.667-0.286-0.667-0.667v-22.667c0-0.381 0.286-0.667 0.667-0.667z"></path>
                    </svg></span>
                  </div>
                </div>
                <div className="card-box">
                  <h3 className="card-title mbr-bold mbr-fonts-style display-5">Category</h3>
                  <h4 className="card-subtitle mbr-pt-3 mbr-fonts-style display-7">
                    <span className="font-normal">
                      {categoryName || "-"}
                    </span>
                  </h4>
                </div>
              </div>
            </div>
            {/* Subcategory */}
            <div className="file-card mbr-col-sm-12 mbr-col-md-6 mbr-col-lg-3 align-center">
              <div className="card-wrapper mbr-flex mbr-column mbr-pt-3 mbr-pb-3 mbr-px-4">
                <div className="card-img align-center mbr-pb-3">
                  {/* SVG icon */}
                  <div className="iconfont-wrapper">
                    <span className="amp-iconfont mbri-opened-folder"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M4.682 11.995c-0.552 0-1.052 0.254-1.38 0.612s-0.515 0.801-0.607 1.258l-2.661 13.333c-0.122 0.611 0.143 1.191 0.531 1.555s0.901 0.581 1.453 0.581h25.305c0.552 0 1.052-0.259 1.38-0.617s0.515-0.801 0.607-1.258l2.664-13.333c0.113-0.565-0.146-1.191-0.534-1.555s-0.901-0.576-1.453-0.576zM4.682 13.328h25.305c0.186 0 0.412 0.092 0.542 0.214s0.161 0.21 0.138 0.323l-2.664 13.333c-0.164 0.611-0.335 0.802-0.68 0.802h-25.305c-0.54 0-0.759-0.238-0.677-0.542l2.661-13.333c0.053-0.267 0.164-0.49 0.281-0.617s0.213-0.18 0.398-0.18zM2 2.667c-1.096 0-2 0.904-2 2v14.667c0 0.881 1.333 0.886 1.333 0v-14.667c0-0.381 0.286-0.667 0.667-0.667h6.391l5.138 5.138c0.125 0.125 0.295 0.195 0.471 0.195h14v0.667c0 0.907 1.333 0.865 1.333 0v-1.333c-0-0.368-0.299-0.667-0.667-0.667h-14.391l-5.138-5.138c-0.125-0.125-0.295-0.195-0.471-0.195z"></path>
                    </svg>
                    </span>
                  </div>
                </div>
                <div className="card-box">
                  <h3 className="card-title mbr-bold mbr-fonts-style display-5">Sub Category</h3>
                  <h4 className="card-subtitle mbr-pt-3 mbr-fonts-style display-7">
                    <span className="font-normal">
                      {subcategoryName || "-"}
                    </span>
                  </h4>
                </div>
              </div>
            </div>
            {/* File ID */}
            <div className="file-card mbr-col-sm-12 mbr-col-md-6 mbr-col-lg-3 align-center last-child">
              <div className="card-wrapper mbr-flex mbr-column mbr-pt-3 mbr-pb-3 mbr-px-4">
                <div className="card-img align-center mbr-pb-3">
                  {/* SVG icon */}
                  <div className="iconfont-wrapper">
                    <span className="amp-iconfont mbri-add-submenu"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M2.667 2.667c-1.466 0-2.667 1.201-2.667 2.667v1.333c0 1.466 1.201 2.667 2.667 2.667h21.333c1.466 0 2.667-1.201 2.667-2.667v-1.333c0-1.466-1.201-2.667-2.667-2.667h-21.333zM2.667 4h21.333c0.75 0 1.333 0.583 1.333 1.333v1.333c0 0.75-0.583 1.333-1.333 1.333h-21.333c-0.75 0-1.333-0.583-1.333-1.333v-1.333c0-0.75 0.583-1.333 1.333-1.333zM2.667 21.983v2.667c0 0.349 0.318 0.667 0.667 0.667h6.417l-1.542 1.5c-0.617 0.617 0.347 1.528 0.917 0.958l2.667-2.667c0.256-0.248 0.256-0.711 0-0.958l-2.667-2.667c-0.547-0.547-1.53 0.345-0.917 0.958l1.542 1.542h-5.75v-2c0-0.905-1.333-0.873-1.333 0zM17.333 21.333c-1.466 0-2.667 1.201-2.667 2.667v1.333c0 1.466 1.201 2.667 2.667 2.667h12c1.466 0 2.667-1.201 2.667-2.667v-1.333c0-1.466-1.201-2.667-2.667-2.667h-12zM17.333 22.667h12c0.75 0 1.333 0.583 1.333 1.333v1.333c0 0.75-0.583 1.333-1.333 1.333h-12c-0.75 0-1.333-0.583-1.333-1.333v-1.333c0-0.75 0.583-1.333 1.333-1.333zM2.667 12c-1.466 0-2.667 1.201-2.667 2.667v1.333c0 1.466 1.201 2.667 2.667 2.667h21.333c1.466 0 2.667-1.201 2.667-2.667v-1.333c0-1.466-1.201-2.667-2.667-2.667h-21.333zM2.667 13.333h21.333c0.75 0 1.333 0.583 1.333 1.333v1.333c0 0.75-0.583 1.333-1.333 1.333h-21.333c-0.75 0-1.333-0.583-1.333-1.333v-1.333c0-0.75 0.583-1.333 1.333-1.333z"></path>
                    </svg></span>
                  </div>
                </div>
                <div className="card-box">
                  <h3 className="card-title mbr-bold mbr-fonts-style display-5">File ID</h3>
                  <h4 className="card-subtitle mbr-pt-3 mbr-fonts-style display-7">
                    <span className="font-normal">
                      {product.id || "-"}
                    </span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Ad Banner */}
      <section className="features1 align-center ads-style">
        Sponsered Links
        <hr className="thickhr" />
        <amp-ad
          width="100vw"
          height="320"
          type="adsense"
          data-ad-client="ca-pub-2488270605722778"
          data-ad-slot="1984323214"
          data-auto-format="rspv"
          data-full-width=""
        >
          <div overflow></div>
        </amp-ad>
      </section>

      {/* Publisher Info */}
      <section className="team1">
        <div className="container-fluid">
          <div className="title align-center">
            <h3 className="title-h3">Publisher</h3>
          </div>
          <div className="mbr-row mbr-jc-c mbr-pt-4">
            <div className="card align-center last-child publisher-card">
              <div className="card-wrapper">
                <div className="card-img mbr-m-auto">
                  <amp-img
                    className="placeholder-loader"
                    src={profilePic}
                    layout="responsive"
                    width="387"
                    height="387"
                    alt={publisher ? `${publisher?.profile?.firstname} ${publisher?.profile?.lastname}` : "Publisher"}
                  />
                </div>
                <div className="card-box mbr-pt-3">
                  <h3>
                    {publisher
                      ? `${publisher?.profile?.firstname} ${publisher?.profile?.lastname}`
                      : "Anonymous"}
                  </h3>
                  <h4>Architect</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download/Type */}
      <section className="info3 cid-rFCRYrDjNw" id="info3-19">
        <div className="container-fluid">
          <div className="mbr-row align-center mbr-jc-c">
            <div className="title-block mbr-col-sm-12 mbr-col-md-12 mbr-col-lg-12"></div>
            <div className="mbr-section-btn mbr-col-md-12 mbr-col-sm-12 mbr-col-lg-12">
              <a className="btn btn-warning display-7 display-same">
                <span className="mobi-mbri mobi-mbri-cash mbr-iconfont mbr-iconfont-btn"></span>
                {product.type || ""} File
              </a>
              <a
                className="btn-primary btn display-7"
                href={`/download-redirect/${product.id}`}
              >
                <span className="mobi-mbri mobi-mbri-download mbr-iconfont mbr-iconfont-btn"></span>
                Download Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects (Gallery) */}
      {similar && similar.length > 0 && (
        <section className="amp-lightbox-gallery cid-rFD2djIsb5">
          <div className="container-fluid">
            <div className="title mbr-pb-4">
              <h3 className="title-h3 text-center">Related Files</h3>
              <h4 className="title-h4 text-center">Look some related files.</h4>
            </div>
            <div className="mbr-row">
              {similar.map((sim, idx) => {
                // ✅ UPDATED: Use the slug from the API data for the link
                const similarProjectSlug = sim.slug || slugify(sim.work_title);
                
                // ✅ UPDATED: Construct the image URL with the new path
                const similarImageUrl = sim.image
                  ? `https://beta-assets.cadbull.com/product_img/original/${sim.image}`
                  : "https://cadbull.com/default-img.png";

                return (
                  <div
                    className="item gallery-image mbr-col-md-6 mbr-col-sm-12 mbr-col-lg-4"
                    key={sim.id}
                  >
                    <a href={`/amp/${sim.id}/${similarProjectSlug}`}>
                      <div className="item-wrapper">
                        <amp-img
                          lightbox="item-wizard-gallery-1e"
                          src={similarImageUrl}
                          layout="responsive"
                          width="450"
                          height="300"
                          alt={sim.work_title}
                          className="placeholder-loader"
                        />
                        <p className="item-sign mbr-fonts-style display-7">{sim.work_title}</p>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="contacts7 map cid-rFD1fLKd4z">
        <div className="container-fluid">
          <div className="title mbr-pb-4 align-center">
            <h3 className="title-h3">Contact Us</h3>
          </div>
          <div className="mbr-row mbr-px-2 mbr-jc-c">
            {/* <div className="card mbr-col-sm-12 mbr-col-md-6 mbr-col-lg-3 align-center md-pb"> */}
            <div className="file-card mbr-col-sm-12 mbr-col-md-6 mbr-col-lg-3 align-center md-pb">
              <div className="card-wrapper mbr-flex mbr-column mbr-pt-3 mbr-px-4 mbr-pb-3">
                <div className="card-img align-center">
                  <div className="iconfont-wrapper">
                    <span className="amp-iconfont fa-map-marker fa"><svg width="100%" height="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M1152 640q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm256 0q0 109-33 179l-364 774q-16 33-47.5 52t-67.5 19-67.5-19-46.5-52l-365-774q-33-70-33-179 0-212 150-362t362-150 362 150 150 362z"></path></svg></span>
                  </div>
                </div>
                <div className="card-box mbr-pt-3">
                  <h4 className="card-title mbr-bold mbr-fonts-style display-5">Address</h4>
                  <p className="card-text mbr-fonts-style mbr-pt-2 display-7">403 Fortune Business Hub, Beside Science City, Sola, Ahmedabad - India</p>
                </div>
              </div>
            </div>
            <div className="file-card mbr-col-sm-12 mbr-col-md-6 mbr-col-lg-3 align-center md-pb">
              <div className="card-wrapper mbr-flex mbr-column mbr-pt-3 mbr-px-4 mbr-pb-3">
                <div className="card-img align-center">
                  <div className="iconfont-wrapper">
                    <span className="amp-iconfont fa-phone fa"><svg width="100%" height="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-53-3.5t-57.5-12.5-47-14.5-55.5-20.5-49-18q-98-35-175-83-127-79-264-216t-216-264q-48-77-83-175-3-9-18-49t-20.5-55.5-14.5-47-12.5-57.5-3.5-53q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"></path></svg></span>
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
                  <div className="iconfont-wrapper">
                    <span className="amp-iconfont fa-envelope-o fa"><svg width="100%" height="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M1664 1504v-768q-32 36-69 66-268 206-426 338-51 43-83 67t-86.5 48.5-102.5 24.5h-2q-48 0-102.5-24.5t-86.5-48.5-83-67q-158-132-426-338-37-30-69-66v768q0 13 9.5 22.5t22.5 9.5h1472q13 0 22.5-9.5t9.5-22.5zm0-1051v-24.5l-.5-13-3-12.5-5.5-9-9-7.5-14-2.5h-1472q-13 0-22.5 9.5t-9.5 22.5q0 168 147 284 193 152 401 317 6 5 35 29.5t46 37.5 44.5 31.5 50.5 27.5 43 9h2q20 0 43-9t50.5-27.5 44.5-31.5 46-37.5 35-29.5q208-165 401-317 54-43 100.5-115.5t46.5-131.5zm128-37v1088q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-1088q0-66 47-113t113-47h1472q66 0 113 47t47 113z"></path></svg></span>
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

      {/* Analytics and AMP auto-ads */}
      <amp-analytics type="googleanalytics">
        <script type="application/json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            vars: { gtag_id: "G-ESHYNTB32B" },
            triggers: {
              trackPageview: {
                on: "visible",
                request: "pageview"
              }
            }
          })
        }} />
      </amp-analytics>
      <amp-analytics type="gtag" data-credentials="include">
        <script type="application/json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            vars: {
              gtag_id: "AW-16484980681",
              config: { "AW-16484980681": { groups: "default" } }
            },
            triggers: { on: "visible", request: "pageview" }
          })
        }} />
      </amp-analytics>
      <amp-analytics
        type="facebookpixel"
        config="https://www.facebook.com/tr?id=605038071805340&ev=PageView&noscript=1"
      />
      <amp-auto-ads
        type="adsense"
        data-ad-client="ca-pub-2488270605722778"
      />
    </>
  );
}
