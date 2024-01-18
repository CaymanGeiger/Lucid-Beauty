"use client"
import styles from './page.module.css'
import useWindowSize from './(extras)/(functions)/WindowSize';
import Image from 'next/image';

export default function Home() {
  const { width } = useWindowSize()

  if (width > 0) {
    return (
      <main className={styles.main}>
        <div className={styles.mainChild}>
          <div className={width > 700 ? styles.mainChildDivOne : styles.mainChildDivOneSmall}>
            <div className={styles.homeTopPhotoDiv}>
              <Image
              className={styles.homeTopPhoto}
              src="homePagePhoto2.jpg"
              alt='home page photo 2'
              width={300}
              height={300}
              />
            </div>
            <div>
              <div
                style={width < 700 ?
                  { flexDirection: "column", maxHeight: "100px", minHeight: "200px" }
                  : { maxHeight: "1000px", minHeight: "300px" }}
                className={styles.underPhotoTitleDiv}
              >
                <h1 className={styles.underPhotoTitleOne}>Your&nbsp;</h1>
                <h1 className={styles.underPhotoTitleOne}>Journey&nbsp;</h1>
                <h1 className={styles.underPhotoTitleOne}>Starts&nbsp;</h1>
                <h1 className={styles.underPhotoTitleOne}>Here</h1>
              </div>
            </div>
          </div>
          <div className={width > 700 ? styles.mainChildDivTwo : styles.mainChildDivTwoSmall}>
            {width < 700 && (
              <div className={styles.homeTopPhotoDiv}>
                <Image
                className={styles.homeTopPhoto}
                src="homePagePhoto3.jpg"
                alt='home page photo 3'
                width={300}
                height={300}
                />
              </div>
            )}
            <div>
              <div
                className={styles.underPhotoTitleDiv}
                style={width < 700 ?
                  { flexDirection: "column", maxHeight: "150px", minHeight: "200px" }
                  : { flexDirection: "column", maxHeight: "1000px", minHeight: "300px" }}>
                <div className={styles.underPhotoTitleDivChildOne}>
                  <h1 className={styles.underPhotoPersonTitle}>-Amelia Anderson</h1>
                </div>
                <div
                  className={styles.underPhotoTitleDivChildTwo}
                >
                  <h1 className={styles.underPhotoTitle}>&quot;I&nbsp;</h1>
                  <h1 className={styles.underPhotoTitle}>Have&nbsp;</h1>
                  <h1 className={styles.underPhotoTitle}>Never&nbsp;</h1>
                  <h1 className={styles.underPhotoTitle}>Felt&nbsp;</h1>
                  <h1 className={styles.underPhotoTitle}>Better&quot;</h1>
                </div>
              </div>
            </div>
            {width > 700 && (
              <div className={styles.homeTopPhotoDiv}>
                <Image
                className={styles.homeTopPhoto}
                src="homePagePhoto3.jpg"
                alt='home page photo 4'
                width={300}
                height={300}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    )
  } else {
    // <Image src="hannahSpinner.svg" alt='spinner'/>
  }
}
