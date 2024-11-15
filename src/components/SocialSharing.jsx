import React from 'react';

import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";

function SocialSharing({ shareUrl, message }) {


    return (
    
    <div className='social-sharing-btn'>
        <FacebookShareButton url={shareUrl} quote={message}>
            <FacebookIcon size={32} round />
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} title={message}>
            <TwitterIcon size={32} round />
        </TwitterShareButton>

        <WhatsappShareButton url={shareUrl} title={message}>
            <WhatsappIcon size={32} round />
        </WhatsappShareButton>
    </div>
    );

}

export default SocialSharing;