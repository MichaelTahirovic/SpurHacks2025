import './AboutUs.css';

function AboutUs() {
    return (
        <div className="about-us-container">
            <div className="about-us-header">
                <h1>Why </h1><img src={process.env.PUBLIC_URL + '/assets/OrgLogo.png'} alt="VerifAI Logo" /><h1> ?</h1>
            </div>
            <div className="about-us-content">
                <p>With the rise of AI,
                    it is becoming increasingly difficult to tell 
                    if a video is real or not. Most often, these fake
                    videos are used to spread misinformation which are
                    easily misinterpreted by both the young and old.
                    This is where VerifAI comes in. Using
                    Google Gemini AI, VerifAI will analyze your uploaded
                    video and compare the content found in the video to
                    news articles online. If there are multiple news articles
                    that match the content found in the video, VerifAI will
                    return a list of sources that can be used to verify the
                    authenticity of the video.<br /><br />
                    <span style={{fontStyle: 'italic', textAlign: 'center'}}>"Fighting fire with fire" if you will.</span><br /><br />
                    Although VerifAI is not a perfect solution, we believe that
                    it is one of the first necessary steps in creating a more
                    secure, transparent, and trustworthy internet with the
                    mainstream rise of AI.<br /><br />
                    VerifAI is a free application developed by a team of four
                    developers at the 2025 SpurHacks Hackathon.
                </p>
            </div>
        </div>
    );
}

export default AboutUs;
