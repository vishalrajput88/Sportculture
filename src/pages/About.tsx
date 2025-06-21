import React from 'react';
import styles from './About.module.css';

const teamMembers = [
  {
    name: 'Jane Doe',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500'
  },
  {
    name: 'John Smith',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
  },
  {
    name: 'Emily Jones',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500'
  },
  {
    name: 'Michael Brown',
    role: 'Marketing Director',
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
        <div className={styles.teamGrid}>
          {teamMembers.map(member => (
            <div key={member.name} className={styles.teamMember}>
              <img src={member.image} alt={member.name} className={styles.teamImage} />
              <h3 className={styles.teamName}>{member.name}</h3>
              <p className={styles.teamRole}>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About; 