import React from 'react';
import styles from './About.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

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
  return (
    <div className={styles.pageContainer}>
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Connecting Communities Through Sports.</h1>
        <p className={styles.heroSubtitle}>
          We believe in the power of play to bring people together. That's why we built a platform
          that makes it easier than ever to discover and book sports facilities in your community.
        </p>
      </section>

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Our Mission</h2>
        <p className={styles.sectionText}>
          Our mission is simple: to foster a culture of health, activity, and community engagement. 
          We want to break down the barriers to accessing sports facilities, making it seamless for 
          individuals, families, and teams to get active and connect with one another.
        </p>
        <img 
          src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1200" 
          alt="People playing sports" 
          className={styles.sectionImage}
        />
      </section>
      
      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Meet the Team</h2>
        <p className={styles.sectionText}>
          We are a passionate group of developers, designers, and sports enthusiasts dedicated
          to making a difference.
        </p>
        <Swiper
          modules={[Autoplay, Pagination]}
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          centeredSlides={true}  // <-- Add this line
          breakpoints={{
            0: { slidesPerView: 1 },        // Mobile
            640: { slidesPerView: 2 },      // Tablet
            1024: { slidesPerView: 3 },     // Desktop (3 cards)
          }}
          style={{ maxWidth: 800, margin: '0 auto 48px auto' }}
        >
          {teamMembers.map((member) => (
            <SwiperSlide key={member.name}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: 24,
                  boxShadow: '0 4px 24px #0001',
                  backdropFilter: 'blur(8px)',
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: 340,
                  margin: '0 auto',
                }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    marginBottom: 16,
                    objectFit: 'cover',
                    background: '#fff',
                    boxShadow: '0 2px 12px #f1a50133',
                  }}
                />
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#f1a501', marginBottom: 4 }}>{member.name}</div>
                <div style={{ color: '#6a1b9a', fontSize: '1rem', marginBottom: 10 }}>{member.role}</div>
                <div style={{ color: '#444', fontSize: '1rem', textAlign: 'center' }}>{member.desc}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
};

export default About; 