import styles from './about.module.css'
import Image from 'next/image';

const Home: React.FC = () => {
    return (
        <main className={styles.main}>
            <div className={styles.mainChild}>
                <div>
                    <div className={styles.homeTopPhotoDiv} >
                        <Image
                        className={styles.homeTopPhoto}
                        src="https://www.aman.com/sites/default/files/styles/full_size_large/public/2021-03/Amanjena_Wellness_1.jpg?itok=PvRNMSVU"
                        alt='about page photo'
                        />
                    </div>
                </div>
                <div>
                    <div className={styles.underPhotoTitleDiv}>
                        <h1 className={styles.underPhotoTitle}>
                            About Us
                        </h1>
                    </div>
                    <div className={styles.aboutUsDescriptionDiv}>
                        <p className={styles.aboutUsDescription}>
                            Welcome to Lucid Beauty, the personal oasis where your beauty and skin health are our top priority. Founded by a passionate esthetician with years of expertise, our practice is dedicated to providing exceptional skincare services tailored to each client&apos;s unique needs. Here, we believe in the transformative power of personal care and the art of esthetics, blending advanced techniques with a nurturing touch. Our commitment to excellence and continuous education ensures that we offer the latest in skincare innovations. At Lucid Beauty, your journey to radiant, healthy skin begins with a personalized experience, focused on enhancing your natural beauty and promoting wellness. We invite you to discover the difference at our serene haven, where every treatment is a step towards revitalization and self-confidence.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
export default Home;
