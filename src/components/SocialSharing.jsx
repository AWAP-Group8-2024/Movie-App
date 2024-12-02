import React, { useState } from 'react';

import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import ShareToGroup from './ShareToGroup';
import ShareAsPost from './ShareAsPost';

function SocialSharing({ shareUrl, message, movie }) {

    const [showCreatePost, setShowCreatePost] = useState(false);
    const [group, setGroup] = useState(null);
    console.log(shareUrl)

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

        <ShareToGroup setShowCreatePost={setShowCreatePost} setGroup={setGroup}/>

        <ShareAsPost group={group} show={showCreatePost} setShow={setShowCreatePost} movie={movie}/>
    </div>
    );

}

export default SocialSharing;