import MainLayout from "@/layouts/MainLayout";
import { getTermsPrivacyAndFaqData } from "@/service/api";
import logo from "@/assets/images/logo.png";
import { Fragment } from "react";
import Head from "next/head";

const TermsPrivacyFaq = ({termsData}) => {
    // console.log('terms data',termsData)
  return (
    <Fragment>
        <Head>
            <title>Cadbull Terms & Conditions | DWG File Usage & User Policies</title>
            <meta name="description" content="Explore CADBull’s Terms & Conditions covering user rights, DWG file usage, account policies, intellectual property, and content sharing rules for a safe and fair experience." />
            <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/terms-conditions`} />

            <meta property="og:title" content="Cadbull Terms & Conditions | DWG File Usage & User Policies" />
            <meta property="og:description" content="Explore CADBull’s Terms & Conditions covering user rights, DWG file usage, account policies, intellectual property, and content sharing rules for a safe and fair experience." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_FRONT_URL}/terms-conditions`} />
            <meta property="og:image" content={logo} />
            <meta name="twitter:title" content="Cadbull Terms & Conditions | DWG File Usage & User Policies" />
            <meta name="twitter:description" content="Explore CADBull’s Terms & Conditions covering user rights, DWG file usage, account policies, intellectual property, and content sharing rules for a safe and fair experience." />
            <meta name="twitter:image" content={logo} />
            <meta name="keywords" content="autocad,autocad file,dwg file,dwg.,autocad files dwg,architecture plan,home plan, modern building,plan,hotel plan,architecture blocks,interior design blocks, autocad blocks,dwg blocks, modern architecture plan in dwg , modern architecture plan dwg, dwg files, architecture projects in autocad, dwg file download, download free dwg, 3ds, autocad, dwg, block, cad, 2d cad library, cad library dwg, cad model library, cad detail library, online cad library, cad symbol library, cad symbol library, cad parts library, cad furniture" />
        </Head>

    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {/* <img src="https://img.freepik.com/free-photo/business-concept-with-team-close-up_23-2149151159.jpg?w=996&t=st=1689992075~exp=1689992675~hmac=d498ed8f133f12b3b6905ffbbdd7427865feecb214c682a44a27a208f09d1695" className="w-100 rounded-2 mb-3 mb-md-4 object-fit-cover" alt="cover" height={350} /> */}
            <div>
                <h1>Terms of Use</h1>
                <p style={{ marginBottom: '1em' }}>
                    The terms 'Cadbull' and 'Cadbull.com' are used in this document (or Agreement) to refer to the Web site itself and to Cadbull.com, the company which owns and operates the Cadbull website.
                </p>
                <ul>
                    <li>Cadbull.com, or Cadbull, is an online networking community that connects its members through the services that it provides to its members. This document covers the terms and conditions under which these services are provided and the privacy policy of the site.</li>
                    <li>Your registration as a member of Cadbull or the use of any of the features and services on Cadbull either as a registered member or as an unregistered visitor constitutes acceptance of these terms and conditions and the privacy policy defined. These terms and conditions apply automatically to any new services or features introduced on Cadbull.com.</li>
                    <li>If you do not agree with any of the terms and conditions or with the privacy policy of Cadbull, you are NOT granted rights to use Cadbull services and must not register as a member of Cadbull or use any of its services.</li>
                    <li>Cadbull reserves the right to update the terms, conditions, and notices of this agreement without notice to you. It is your responsibility to periodically review the most current version of this Agreement as your continued use of Cadbull signifies your acceptance of any changed terms.</li>
                    <li>This Agreement constitutes the entire agreement between you and Cadbull and governs your use of the Cadbull Service, superseding any prior agreements between you and Cadbull.</li>
                </ul>
            
              <h1>Acceptance</h1>
              <p style={{ marginBottom: '1em' }}>
                  For the purpose of the Terms, which shall mean any person who uses the Websites or the Services in any manner, including creating the profile and downloading layouts on the Websites thereby means they agree to comply with these Terms.
              </p>
              <ul>
                  <li>
                      The remainder of this document covers the specific terms and conditions under which each major service category of Cadbull is provided for your use. It is your responsibility to make sure you read and understand this document before using any Cadbull service.
                  </li>
                  <li>
                      Please do not contribute to Cadbull in any manner unless you have carefully read and agree with all of these terms.
                  </li>
              </ul>
              <h1>Accessing Content</h1>
              <p style={{ marginBottom: '1em' }}>
                  All the content available for public access on Cadbull is protected by copyright. Your use of this material must adhere to the following terms, unless you are the original contributor of the content to Cadbull, in which case your use is governed by the terms governing Cadbull's relationship with its contributors as covered below.
              </p>
              <p style={{ marginBottom: '1em' }}>
                  Cadbull.com has full authority to change these terms of use from time to time. Your continued access or use of the site constitutes your acceptance of such changes. Your regular presence will show us that you accept the terms of use and policies. We request you to regularly check the changes related to terms of use in order to be up to date. In case of any breach of the terms of use, your license to access or use this site shall automatically terminate.
              </p>
              <ul>
                  <li>You may download and print a single copy of any content item for your personal, non-commercial use. Content items include, but are not restricted to, articles, columns, photographs, complete Coffeehouse posts, and reader comments on articles.</li>
                  <li>You may not modify any content you download or print from Cadbull. You must retain all copyright notices and logos on any content item you download or print.</li>
                  <li>You may not make any content item originating from Cadbull available for public access by any means whatsoever without obtaining prior written permission from Cadbull.</li>
                  <li>You may forward Internet URLs (Uniform Resource Locators) to third parties for private, non-commercial use, along with brief extracts that do not violate Fair Use guidelines.</li>
                  <li>You can download 20 files daily. Gold account purchased users can get 100 files daily download.</li>
              </ul>
              <h1>Intellectual Property</h1>
              <p style={{ marginBottom: '1em' }}>
                  Subject to your compliance with these Terms of Use, any applicable license agreement with Cadbull.com, and the law, you may access and use the site. Cadbull.com remains the sole owner of all rights, title, and interest in the site and reserves all rights not expressly granted under these Terms of Use. Cadbull.com may replace, modify, or discontinue the site or any part thereof at any time, for any reason, with or without notice, in Cadbull.com's sole discretion.
              </p>
              <p style={{ marginBottom: '1em' }}>
                  All content on this site, including but not limited to CAD files and related metadata (collectively referred to as Cadbull.com Content), as well as the selection and arrangement of Cadbull.com content, are protected by copyright, trademark, patent, trade secret, and other intellectual property laws and treaties. Any unauthorized use of any Cadbull.com content violates such laws and these Terms of Use. Except as expressly provided herein or in a separate license agreement between you and Cadbull.com, Cadbull.com does not grant any express or implied permission to use the site or any Cadbull.com Content.
              </p>
              <p>
                  You agree not to copy, republish, frame, link to, download, transmit, modify, adapt, create derivative works based on, rent, lease, loan, sell, assign, distribute, display, perform, license, sublicense, or reverse engineer the Site or any Cadbull.com Content. In addition, you agree not to use any data mining, robots, or similar data and/or image gathering and extraction methods in connection with the Site and Cadbull.com Content.
              </p>
              <p>
                  Unless you enter into a license agreement with Cadbull.com, you may not distribute, display, and/or copy any Cadbull.com Content.
              </p>
              <p>
                  You may not remove any watermarks or copyright notices contained in the Cadbull.com content.
              </p>
              <h1>Cadbull.com Trademark</h1>
              <p style={{ marginBottom: '1em' }}>
                  For the purpose of these Terms of Use, the term "Trademark" means all common law or registered trademarks, logos, service marks, trade names, Internet domain names, or other indications of origin now or in the future used by Cadbull.com.
              </p>
              <ul style={{ marginBottom: '1em' }}>
                  <li>Nothing contained herein grants or shall be construed to grant you any rights to use any Cadbull.com Trademark unless expressly conferred by these Terms of Use.</li>
                  <li>You agree that you will not use Cadbull.com Trademarks in any manner that might tarnish, disparage, or reflect adversely on such Trademarks or Cadbull.com.</li>
                  <li>You agree that you will not contest or otherwise challenge, or assist or encourage any other person or entity to contest or challenge, the validity of any of Cadbull.com Trademarks or the Trademarks rights claimed by Cadbull.com.</li>
                  <li>You agree that you will not use any Cadbull.com Trademark or any variant thereof (including misspellings) as a domain name or as part of a domain name regardless of the top-level domain, or as a metatag, keyword, or any other type of programming code or data.</li>
                  <li>You may not, at any time, adopt or use, without Cadbull.com's prior written consent, any word or mark which is similar to or likely to be confused with Cadbull.com.</li>
                  <li>The look and feel of the Cadbull.com website, including page headers, custom graphics, button icons, and scripts, is the trade dress and/or trademark or service mark of Cadbull.com and may not be copied, imitated, or used, in whole or in part, without the prior written consent of Cadbull.com.</li>
                  <li>All other trademarks, product names, and company names or logos used or appearing on the Cadbull.com website are the property of their respective owners. Reference to any products, services, processes, or other information, by trade name, trademark, manufacturer, supplier, or otherwise does not constitute or imply endorsement, sponsorship, or recommendation thereof by Cadbull.com, unless expressly so stated.</li>
                  <li>You may not use a Cadbull.com trademark, logo, image, or other proprietary graphic of Cadbull.com to link to the Cadbull.com website without the prior written consent of Cadbull.com.</li>
                  <li>You may not frame or hotlink to the Cadbull.com website or any image without the prior written consent of Cadbull.com.</li>
              </ul>
              <h1>Contribution</h1>
              <p style={{ marginBottom: '1em' }}>
                  Cadbull also provides a variety of forums for its members to express themselves in the form of services, layouts that can be downloaded for free or by using a gold account. Cadbull provides value to its contributors by making available to them its vast global audience reach. The terms in this section apply to all the content contributed to Cadbull in any of its various services and forums.
              </p>
              <ul>
                  <li>You truthfully assert that the content being contributed is your creation and that you own the copyright to the content. Unless you have deliberately assigned the copyright to someone else, you automatically own the copyright to all of your original creations.</li>
                  <li>For any CAD file, text, or any other content you upload or post to the Site (“Your Content”), you represent and warrant that:
                      <ol type="i">
                          <li>You have all necessary rights to submit Your content to the site and grant the license set forth herein.</li>
                          <li>Cadbull.com will not need to obtain licenses from any third party or pay royalties to any third party with respect to your content.</li>
                          <li>Your content does not infringe any third party’s rights, including intellectual property rights.</li>
                          <li>Your content complies with these Terms of Use and all applicable laws.</li>
                      </ol>
                  </li>
                  <li>By uploading Your Content, you grant Cadbull.com a limited, worldwide, non-exclusive, royalty-free license and right to copy, transmit, distribute, publicly perform and display (through all media now known or hereafter created), and make derivative works from Your Content for the purpose of allowing you to edit and display Your Content using the site and archiving or presenting Your Content for disputes, legal proceedings, or investigations. The above licenses will continue unless and until you remove Your Content from the site, in which case the licenses will terminate within a commercially reasonable period of time. Notwithstanding the foregoing, the license for legal archival/preservation purposes will continue indefinitely.</li>
                  <li>You may not upload, post or transmit any video, image, text, audio recording, or other content that:
                      <ul>
                          <li>Infringes any third party’s copyrights or other intellectual property rights of publicity or privacy.</li>
                          <li>Contains any pornographic, defamatory, or otherwise unlawful or immoral content.</li>
                          <li>Exploits minors.</li>
                          <li>Depicts unlawful or violent acts.</li>
                          <li>Depicts animal cruelty or violence towards animals.</li>
                          <li>Promotes fraudulent schemes or gives rise to claim of deceptive advertising or unfair competition; or</li>
                          <li>Violates any law, statute, or regulation.</li>
                      </ul>
                  </li>
                  <li>You may not use any Cadbull.com Content for any purpose without first obtaining a license to use such Cadbull.com Content. Any use of Cadbull.com Content by you shall be governed by the applicable license agreement separately entered into between you and Cadbull.com. Displaying and/or distributing to the public any watermarked or unlicensed Cadbull.com Content (Whether incorporated into a derivative work or alone) constitutes copyright infringement.</li>
                  <li>We are not responsible or liable for loss if visitors to the site violate your copyright and distribute your copyrighted content without your permission.</li>
                  <li>If you get more people start downloading the content you uploaded on the website by gold account your credits increase.</li>
                  <li>Once granted and your content is published, the distribution rights cannot be revoked. In other words, once your contribution is published on Cadbull it automatically becomes a permanent part of the publicly-accessible Cadbull archives. You may, however, subject to our approval, update or revise your contributions on Cadbull.</li>
                  <li>You grant us the right to organize, categorize, collate your contributed content and present it on the website in any manner we see fit. We may remove or edit your contribution at our discretion without having to secure your permission. We will, however, make reasonable efforts to inform you of the changes.</li>
              </ul>
              <h1>Termination</h1>
              <p style={{ marginBottom: '1em' }}>
                  We generally do not object to our contributors posting their Cadbull contributions on other, freely accessible non-commercial Internet locations, so long as Cadbull is clearly cited as the original publisher, and a link to <a href="https://cadbull.com">https://cadbull.com</a> is provided.
              </p>
              <p >
                  While you are on the site and engaged in any form of communication on any of the forums, you agree NOT to:
              </p>
              <ul>
                  <li>Upload or post or otherwise make available any Content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libellous, promotes violence, is invasive of another's privacy, hateful, or racially, ethnically or otherwise objectionable; impersonate any person or entity, including, but not limited to, a Cadbull official, forum leader, guide or host, or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
                  <li>Upload or post otherwise make available any content that you do not have a right to make available, under any law or under contractual or fiduciary relationships.</li>
                  <li>Upload or post or otherwise make available any Content that infringes any patent, trademark, trade secret, copyright or other proprietary rights of any party. You may, however, post excerpts of copyrighted material so long as they adhere to Fair Use guidelines.</li>
                  <li>Upload or post or otherwise make available any material that contains software viruses or any other computer code, files or programs designed to interrupt, destroy or limit the functionality of any computer software or hardware or telecommunications equipment.</li>
                  <li>Disrupt the normal flow of dialogue by repeatedly posting the same or similar material, or otherwise acting in a manner that negatively affects other users.</li>
                  <li>Post layouts that contain untruthful representations, deceptive practices, inducements to commit any illegal activity.</li>
              </ul>
              <h1>Access to our service</h1>
              <p>
                  This Section covers the terms under which various Cadbull services, including, but not limited to, link forwarding services, event information, and any information available on Cadbull, are made available to you.
              </p>
              <p>
                  You agree that:
              </p>
              <ul>
                  <li>Cadbull may electronically block or otherwise deny access to the Cadbull Web site, to any user deemed to be in violation of any of the terms in this document.</li>
                  <li>Cadbull is not obliged to ensure that the Web site is available to all users at all times. While we make all attempts to deny access only to those individuals who violate Cadbull regulations, we are occasionally forced to use access denial methods that cause a disruption in access for other users.</li>
                  <li>Cadbull is not responsible for a loss of access to Cadbull services due to the failure of networks connected to the Internet, or any other temporary hardware or software failure.</li>
                  <li>Cadbull reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.</li>
                  <li>A possibility exists that the Site could include inaccuracies or errors. Additionally, a possibility exists that unauthorized additions, deletions, and alterations could be made by third parties to the Site. Although Cadbull attempts to ensure the integrity and the accuracy of the Site, it makes no guarantees whatsoever as to the correctness or accuracy of the Site.</li>
              </ul>

              <h1>Visitor Responsibility</h1>
              <p style={{ marginBottom: '1em' }}>
                  Cadbull has not reviewed, and cannot review, all of the material, including computer software, posted to the Website, and cannot therefore be responsible for that material’s content, use or effects. By operating the Website, Cadbull does not represent or imply that it endorses the material there posted, or that it believes such material to be accurate, useful or non-harmful.
              </p>
              <p style={{ marginBottom: '1em' }}>
                  You are responsible for taking precautions as necessary to protect yourself and your computer systems from viruses, worms, Trojan horses, and other harmful or destructive content. The Website may contain content that is offensive, indecent, or otherwise objectionable, as well as content containing technical inaccuracies, typographical mistakes, and other errors. The Website may also contain material that violates the privacy or publicity rights, or infringes the intellectual property and other proprietary rights, of third parties, or the downloading, copying or use of which is subject to additional terms and conditions, stated or unstated.
              </p>
              <p>
                  Cadbull disclaims any responsibility for any harm resulting from the use by visitors of the Website, or from any downloading by those visitors of content there posted. If you believe that material located on or linked to by Cadbull.com is offensive, indecent, violates your copyright, or is otherwise objectionable, you are encouraged to notify our team via the report abuse link or via email. In the case of a visitor who may infringe or repeatedly infringes the copyrights or other intellectual property rights of Cadbull or others, Cadbull may, in its discretion, terminate or deny access to and use of the Website.
              </p>

              <h1>Member Registration</h1>
              <p>
                  Cadbull requires registration for those who participate in a variety of its services. When you register as a Cadbull member, you accept the following terms and conditions:
              </p>
              <ul>
                  <li>You agree to provide true, accurate, current and complete information as required in the registration form.</li>
                  <li>You agree to maintain and promptly update the Registration Data as necessary to keep it true, accurate, current and complete.</li>
                  <li>If, after investigation, Cadbull has reasonable grounds to suspect that any user's information is untrue, inaccurate, not current or incomplete, Cadbull may suspend or terminate that user's account and prohibit any and all current or future use of the Cadbull Sites (or any portion thereof) by that user other than as expressly provided.</li>
                  <li>Each user is wholly responsible for maintaining the confidentiality of account login and password information and for all activities occurring thereunder.</li>
                  <li>You agree that Cadbull reserves the right to publish any and all information provided as part of Cadbull registration, except email address and password to authenticate the user.</li>
                  <li>By using Cadbull.com services and providing us your email address, you agree to receive mails from our employees/customers.</li>
              </ul>

              <h1>DMCA & Copyright Infringement</h1>
              <p>
                  If you believe that any CAD file or other material made available by Cadbull.com infringes upon any copyright that you own or control, you may notify Cadbull.com in the manner set forth in our DMCA Copyright Infringement Notice Policy.
              </p>

              <h1>Refund Policy</h1>
              <p>
                  As per our policy and our claim for the free download of CAD files for General Users, you will get the free copy listed in the free option. You can cancel your subscription at any time but we have a NO refund policy. Our goods are digital (DWG files, PDF files, .3ds files and files in other design file formats) and once a user has downloaded them, the user has full access to our digital work. We would encourage you to create a free account on cadbull.com and download a few free files before purchasing. All subscription plans provided on cadbull.com are auto-renewed at defined intervals and you'll be automatically charged by our Payment Processor "Stripe" at each billing cycle unless you've cancelled your subscription. To cancel your subscription please click on "Manage Billing" option on Cadbull.com Profile Page. Please reach out to support@cadbull.com if you need more help or facing any errors. You can contact support@cadbull.com if you're facing any issues with downloading files and we'll respond within 48 hours.
              </p>

              <h1>Indemnification</h1>
              <p>
                  You agree to defend, indemnify and hold harmless Cadbull.com, its affiliates, licensors, employees, agents, third party information providers, Submitters and Independent contractors against any claims, damages, costs, liabilities, and expense ( including, but not limited to, reasonable attorneys’ fees) arising out of or related to your conduct, your use or inability to use the site, your breach or alleged breach of the website Terms of Use or of any representation or warranty contained herein, your unauthorized use of the Cadbull.com Content, or your violation of any rights of another.
              </p>

              <h1>Disclaimer</h1>
              <p style={{ marginBottom: '1em' }}>
                  YOUR USE OF CADBULL IS AT YOUR OWN RISK. THIS WEBSITE IS PROVIDED BY CADBULL.COM, ON AN "AS IS" AND "AS AVAILABLE" BASIS. WEBSITES DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                  CADBULL.COM, MAKES NO REPRESENTATIONS OR ASSURANCE OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE WEBSITE OR THE INFORMATION, CONTENT, MATERIALS, OR PRODUCTS ON THE WEBSITE, INCLUDING THAT
              </p>
              <ul>
                  <li>CADBULL AND ITS SERVICES WILL MEET YOUR REQUIREMENTS,</li>
                  <li>CADBULL WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE,</li>
                  <li>THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION OR OTHER MATERIAL PURCHASED OR OBTAINED BY YOU THROUGH CADBULL WILL MEET YOUR EXPECTATIONS, BE RELIABLE OR ACCURATE.</li>
              </ul>
              <p>
                  ANY MATERIAL DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF CADBULL IS DONE AT YOUR OWN DISCRETION AND RISK, AND YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD.
              </p>

              <h1>Declaration</h1>
              <p>
                  YOU ACKNOWLEDGE THAT YOU HAVE READ THIS AGREEMENT AND AGREE TO ALL ITS TERMS AND CONDITIONS. YOU HAVE INDEPENDENTLY EVALUATED THE DESIRABILITY OF PARTICIPATING IN CADBULL FOR POSTING YOUR WORK AND DOWNLOADING CONTENT AND ARE NOT RELYING ON ANY REPRESENTATION, GUARANTEE, OR STATEMENTS OTHER THAN AS SET FORTH IN THIS AGREEMENT.
              </p>
            </div>
              {/* {parse(termsData)} */}
          </div>
        </div>
      </div>
    </section>
    </Fragment>
  );
}

TermsPrivacyFaq.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}

export default TermsPrivacyFaq;

// Convert to SSG for cost savings - Terms don't change frequently
export async function getStaticProps(){
    try {
        const  response = await getTermsPrivacyAndFaqData();
         const termsData= response.data?.terms?.term_condition;
         return {
            props:{
                termsData
            },
            revalidate: 86400, // 24 hours - terms rarely change
         }
        
    } catch (error) {
        return {
            props:{
                termsData:null
            }
        }
        
    }
}