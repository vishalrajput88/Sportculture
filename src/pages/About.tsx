import React, { useState } from 'react';
import styles from './About.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';

declare module "slick-carousel/slick/slick.css";
declare module "slick-carousel/slick/slick-theme.css";

const teamMembers = [
  {
    name: 'Jane Doe',
    role: 'Founder & CEO',
    desc: 'Visionary leader with a passion for sports and technology.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500'
  },
  {
    name: 'John Smith',
    role: 'Head of Operations',
    desc: 'Expert in operations and logistics, ensuring everything runs smoothly.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
  },
  {
    name: 'Emily Jones',
    role: 'Lead Developer',
    desc: 'Full stack developer passionate about building scalable web apps.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500'
  },
  {
    name: 'Michael Brown',
    role: 'Marketing Director',
    desc: 'Creative marketing strategist with a love for sports and branding.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500'
  }
];

const About = () => {
  const [ctaEmail, setCtaEmail] = useState('');

  return (
    <div className={styles.pageContainer}>
      <section className={styles.heroSection}>
      <h5 className={styles.heroSubtitle}>
        Rebuilding the Spirit of Sports.
        </h5>
        <h1 className={styles.heroTitle}>About Sports Culture</h1>
      <p>In today's fast-moving world, playing has taken a back seat. Stadiums are full, but playgrounds are empty. People watch sports — but fewer people play.
<b>Sports Culture </b>is created to change that.
We are a growing movement dedicated to bringing people back to playing — not just watching. Whether you're discovering your first sport, a former athlete missing the game or someone simply looking for a healthy and active lifestyle —<b> Sports Culture welcomes everyone</b>.
Our platform is not just about games — it's about creating accessible, inclusive, and vibrant sports communities across cities.
</p>
      </section>

      <section className={styles.contentSection}>
        <h3 className={styles.sectionTitle}>Our Vision </h3>
        <p className={styles.sectionText}>
        To reignite everyday sports culture — across age, skill and background.
        </p>
        <img 
          src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1200" 
          alt="People playing sports" 
          className={styles.sectionImage}
        />
      </section>

      <section className={styles.offerSection}>
        <h3 className={styles.offerTitle}>What We Offer</h3>
        <div className={styles.offerGrid}>
          <div className={styles.offerCard}>
            <span className={styles.iconCircle}>🎯</span>
            <div>
              <b>Sports Content</b> — helping you know the game.
            </div>
          </div>
          <div className={styles.offerCard}>
            <span className={styles.iconCircle}>🎯</span>
            <div>
              <b>Multi-Sport Awareness</b> — covering Tennis, Badminton, Table Tennis, Pickleball and much more to come.
            </div>
          </div>
          <div className={styles.offerCard}>
            <span className={styles.iconCircle}>🎯</span>
            <div>
              <b>Community Growth</b> — inspiring schools, colleges, gyms, senior citizens, women and youth to play actively.
            </div>
          </div>
          <div className={styles.offerCard}>
            <span className={styles.iconCircle}>🎯</span>
            <div>
              <b>Real-World Connection</b> — enabling access to spaces and playing opportunities through upcoming solutions.
            </div>
          </div>
        </div>
      </section>
      
      <section className={styles.whySection}>
        <h3 className={styles.whyTitle}>Why It Matters</h3>
        <p className={styles.whyText}>
          Because sport is for everyone.<br />
          We believe that true sports culture grows not in stadiums, but in everyday lives.<br />
          Let's reclaim play. Together.
        </p>
      </section>

      <section className={styles.ctaSection}>
        
        <div className={styles.ctaContent}>
          <h3 className={styles.ctaTitle}>Call To Action</h3>
          
          <p className={styles.ctaText}>
            <span role="img" aria-label="point">👉</span> Follow the journey. Join the community.
          </p>
          <div className={styles.ctaIcons}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.ctaIcon} aria-label="Instagram">
              <img src="/src/assets/social-insta.png" alt="Instagram" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.ctaIcon} aria-label="Facebook">
              <img src="/src/assets/social-fac.png" alt="Facebook" />
            </a>
          </div>
        <div className='flex'> <span role="img" aria-label="mail">📩</span> Stay updated as we build:</div> 
          <form className={styles.ctaMailForm} onSubmit={e => e.preventDefault()} style={{ position: 'relative' }}>
            <motion.input
              type="email"
              placeholder="Your email"
              required
              value={ctaEmail}
              onChange={e => setCtaEmail(e.target.value)}
              whileFocus={{ scale: 1.06, boxShadow: '0 6px 24px #6a1b9a33' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={styles.ctaInput}
              style={{ paddingRight: ctaEmail ? 48 : undefined }}
            />
            {ctaEmail && (
              <button
                type="submit"
                className={styles.ctaSendBtn}
                aria-label="Subscribe"
                style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)' }}
              >
               <i class="fa-solid fa-paper-plane"></i>
              </button>
            )}
          </form>
        </div>
        <div className={styles.ctaMemojiWrap}>
          <img src="/src/assets/ctapng.png" alt="Memoji" className={styles.ctaMemoji} />
        </div>
      </section>

    </div>
  );
};

export default About; 