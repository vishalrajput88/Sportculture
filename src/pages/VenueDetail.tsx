import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './VenueDetail.module.css';

// Using a simple unicode character for the checkmark icon
const CheckmarkIcon = () => <span className={styles.amenityIcon}>✔</span>;

// The emoji icons have been removed from this list
const amenitiesList = [
  { label: 'Parking' },
  { label: 'Washroom' },
  { label: 'Lockers' },
  { label: 'Drinking Water' },
  { label: 'Flood Lights' },
];

const sportsIcons = [
  { label: 'Pickleball', icon: '🏓' },
  { label: 'Tennis', icon: '🎾' },
  { label: 'Table Tennis', icon: '🏓' },
  { label: 'Badminton', icon: '🏸' },
];

const venuesNearby = [
  {
    id: '7',
    name: 'Sports monk Pickleball - Home of Sports Ahmadabad',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60',
    sport: 'Pickleball',
    address: 'Chhipa Bakhal, Main Road Shanti Nagar Jain Colony, Indore, Madhya Pradesh - 452001',
  },
];

const VenueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [duration, setDuration] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('Venue ID is required');
        const response = await fetch(`http://localhost:3000/api/turfs/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch venue details: ${response.statusText}`);
        const data = await response.json();
        setVenue(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch venue details');
      } finally {
        setLoading(false);
      }
    };
    fetchVenueDetails();
  }, [id]);

  const handleDurationChange = (amount: number) => {
    setDuration((prev) => Math.max(1, prev + amount));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!venue) return <p>Venue not found</p>;

  const ImageGallery = () => (
    <div className={styles.section}>
      <img
        src={venue.images[currentImageIndex]}
        alt={venue.name}
        className={styles.mainImage}
      />
      <div className={styles.thumbnailContainer}>
        {venue.images.map((img: string, idx: number) => (
          <img
            key={idx}
            src={img}
            alt={venue.name + ' thumbnail'}
            className={`${styles.thumbnail} ${idx === currentImageIndex ? styles.thumbnailActive : ''}`}
            onClick={() => setCurrentImageIndex(idx)}
          />
        ))}
      </div>
    </div>
  );

  const BookingPopup = () => (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <div className={styles.popupHeader}>
          <h3 className={styles.popupTitle}>Booking at Sports Lover Court Ahmedabad</h3>
          <button onClick={() => setShowPopup(false)} className={styles.popupCloseButton}>&times;</button>
        </div>
        <div className={styles.popupBookingDetails}>
          <div>
            <p className={styles.popupBookingText}>Table Tennis</p>
            <p className={styles.popupBookingText}>13, June 2025</p>
          </div>
          <div>
            <p className={styles.popupBookingText}>04:00 PM to 05:00 PM</p>
          </div>
        </div>
        <div className={styles.popupPaymentInfo}>
          <p className={styles.popupPaymentLabel}>PAY FOR BOOK</p>
          <p className={styles.popupPrice}>INR {venue.price * duration}</p>
        </div>
        <button className={styles.bookButton}>PAY NOW & BOOK SLOT</button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{venue.name}</h1>
      <p className={styles.address}>{venue.address}</p>

      <div className={styles.layout}>
        {isBooking ? (
          <>
            <div className={styles.mainContent}>
              <form className={styles.form} onSubmit={handleBookingSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Sports</label>
                  <select className={styles.formInput}>
                    <option>Table Tennis</option>
                    <option>Badminton</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date</label>
                  <div className={styles.inputWithIcon}>
                    <input type="date" className={styles.formInput} defaultValue="2025-06-11" />
                    <span className={styles.inputIcon}>📅</span>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Start Time</label>
                  <div className={styles.inputWithIcon}>
                    <input type="time" className={styles.formInput} defaultValue="18:00" />
                    <span className={styles.inputIcon}>🕒</span>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Duration</label>
                  <div className={styles.durationControl}>
                    <button type="button" className={styles.durationButton} onClick={() => handleDurationChange(-1)}>-</button>
                    <span className={styles.durationDisplay}>{duration} hr</span>
                    <button type="button" className={styles.durationButton} onClick={() => handleDurationChange(1)}>+</button>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Court</label>
                  <select className={styles.formInput}>
                    <option>--Select Court--</option>
                  </select>
                </div>
                <button type="submit" className={styles.bookButton}>Book Your Slot Now</button>
              </form>
            </div>
            <div className={styles.sidebar}>
              <ImageGallery />
            </div>
          </>
        ) : (
          <>
            <div className={styles.mainContent}>
              <ImageGallery />
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Amenities</h2>
                <div className={styles.amenitiesList}>
                  {amenitiesList.map((item) => (
                    <div key={item.label} className={styles.amenityItem}>
                      <CheckmarkIcon />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>About Venue</h2>
                <h3 className={styles.aboutSportTitle}>Table Tennis</h3>
                <p className={styles.aboutText}>
                  Sports equipment available on rent: Rackets, Balls.<br />
                  Barefoot play is strictly prohibited.<br />
                  A maximum of 2 members per booking per TT Table is admissible.
                </p>
                <h3 className={styles.aboutSportTitle}>Badminton</h3>
                <p className={styles.aboutText}>
                  Badminton Non-Marking Shoes compulsory for Badminton. Shoes must be worn after entering the facility.<br />
                  Sports equipment available on rent: Rackets, Shoes.<br />
                  Socks are compulsory for rented shoes. Please carry your own.<br />
                  Barefoot play is strictly prohibited.<br />
                  A maximum of 4 members per booking per badminton court is admissible.
                </p>
              </div>
            </div>
            <div className={styles.sidebar}>
              <div className={styles.sidebarCard}>
                <iframe
                  title="Venue Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.123456789!2d75.8577!3d22.7196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQzJzExLjAiTiA3NcKwNTEnMjcuOSJF!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                  className={styles.map}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div>
                  <h4 className={styles.timingsTitle}>Timing</h4>
                  <p>Monday - Sunday</p>
                  <p>INR {venue.price}/hour</p>
                  <p>07:00 AM - 10:00 PM</p>
                </div>
                <button className={styles.bookButton} onClick={() => setIsBooking(true)}>
                  Book Your Slot Now
                </button>
              </div>
              <div className={styles.sidebarCard}>
                <h4 className={styles.sportsTitle}>Sports Available</h4>
                <div className={styles.sportsList}>
                  {sportsIcons.map((item) => (
                    <div key={item.label} className={styles.sportItem}>
                      <span className={styles.sportIcon}>{item.icon}</span>
                      <span className={styles.sportLabel}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.sidebarCard}>
                <h4 className={styles.nearbyTitle}>Venues nearby</h4>
                {venuesNearby.map((v) => (
                  <div key={v.id} className={styles.nearbyItem}>
                    <img src={v.image} alt={v.name} className={styles.nearbyImage} />
                    <div>
                      <p className={styles.nearbySport}>{v.sport.toUpperCase()}</p>
                      <p className={styles.nearbyName}>{v.name}</p>
                      <p className={styles.nearbyLink}>View More</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {showPopup && <BookingPopup />}
    </div>
  );
};

export default VenueDetail; 