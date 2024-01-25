"use client"
import React, { useState, useEffect, Suspense } from 'react';
import styles from "./appointment.module.css"
import Link from "next/link";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { blue } from '@mui/material/colors';
import { useModal } from '@/(accounts)/loginmodal';
import Cookies from 'js-cookie';
import { useToast } from '@/(extras)/(toast)/useToastContext';
import { useLoading } from '@/(extras)/(loading)/LoadingContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../(auth)/authcontext';
const ServiceSelect = React.lazy(() => import('@reuse_appointment/(selects)/ServiceSelect'));
const AdditionalServicesSelect = React.lazy(() => import('@reuse_appointment/(selects)/AdditionalServicesSelect'));
const WelcomeMessage = React.lazy(() => import('@reuse_appointment/(popups)/WelcomeMessage'));
const Benefits = React.lazy(() => import('@reuse_appointment/(popups)/Benefits'));

const StaticDateTimePicker = React.lazy(() => import('./StaticDateTimePickerWrapper'));


interface AppointmentPageProps {
    serviceId?: number;
    serviceType?: string;
}

type AdditionalService = {
    value: number
}

type AppointmentFormType = {
    appointmentDate: string;
    appointmentTime: string;
    service: number;
    additionalServices?: AdditionalService[];
    guestFirstName?: string;
    guestLastName?: string;
    guestEmail?: string;
    guestPhoneNumber?: string;
};

type MissingFieldsType = {
    service: boolean
    guestFirstName: boolean
    guestLastName: boolean
    guestEmail: boolean
    guestPhoneNumber: boolean
}

function formatDate(dateString: any) {
    return dayjs(dateString).format("dddd, MMMM YYYY");
}

function formatTime(timeString: any) {
    return dayjs(timeString, 'HH:mm:ss').format("h:mmA");
}

const AppointmentPage: React.FC<AppointmentPageProps> = ({ serviceId, serviceType }) => {
    const [selectedService, setSelectedService] = useState<any>(null);
    const [selectedAdditionalServices, setSelectedAdditionalServices] = useState([]);
    const [isDatePickerOpen, setDatePickerOpen] = useState<boolean>(false);
    const [selectedDateTime, setSelectedDateTime] = useState<any>(dayjs());
    const [showWelcomeMessage, setShowWelcomeMessage] = useState<boolean>(true);
    const [missingFields, setMissingFields] = useState<MissingFieldsType>({
        service: false,
        guestFirstName: false,
        guestLastName: false,
        guestEmail: false,
        guestPhoneNumber: false,
    });

    const [userId, setUserId] = useState<any>(0);
    const { isLoggedIn } = useAuth();
    const [errorMessage, setErrorMessage] = useState({
        submitForm: "",
        guestClick: "",
    });
    const [showBenfits, setShowBenefits] = useState(false);
    const [userChoice, setUserChoice] = useState<any>('account');
    const [totalPrice, setTotalPrice] = useState(0);
    const { openModal } = useModal();
    const triggerToast = useToast()
    const router = useRouter();
    const [formData, setFormData] = useState<AppointmentFormType>({
        appointmentDate: "",
        appointmentTime: "",
        service: 0,
        additionalServices: [],
        guestFirstName: "",
        guestLastName: "",
        guestEmail: "",
        guestPhoneNumber: "",
    });
    const url = process.env.WEBSITE_URL ? process.env.WEBSITE_URL : process.env.NEXT_PUBLIC_WEBSITE_URL;



    useEffect(() => {
        const userId = Cookies.get('userId');
        setUserId(userId)

    }, []);

    // FORM CHANGES
    const handleFormChange = (e: any) => {
        const value = e.target.value;
        let inputName = e.target.name;

        if (inputName === "additionalServices" && value && value.value === 0)  {
            return;0
        }

        setFormData(prevFormData => {
            if (inputName === "additionalServices") {
                const serviceIds = value.map((service: any) => service.value.id);
                // let totalAdditionalPrice = value.reduce((total: number, service: any) => {
                //     return total + parseFloat(service.value.price);
                // }, 0);
                // setTotalPrice(prevTotalPrice => prevTotalPrice + totalAdditionalPrice);
                return { ...prevFormData, [inputName]: serviceIds };

            } else if (inputName === "service") {
                let servicePrice = value && value.value.price ? parseFloat(value.value.price) : 0;
                if (value && value.value.id > 0) {
                    return { ...prevFormData, [inputName]: value.value.id };
                } else {
                    return prevFormData;
                }
            } else {
                return { ...prevFormData, [inputName]: value };
            }
        });
    }


    const handleSubmit = async () => {

        if (formData.service === 0) {
            setMissingFields({ ...missingFields, ['service']: true })
            triggerToast(`Missing Selected Service!`, "error")
            closeDatePickerModal()
            return;
        }
        let updatedFormData;
        if (isLoggedIn) {
            updatedFormData = {
                service: formData.service,
                additionalServices: formData.additionalServices,
                appointmentDate: selectedDateTime,
                appointmentTime: selectedDateTime,
                accountId: parseInt(userId)
            };

        } else {
            updatedFormData = {
                ...formData,
                appointmentDate: selectedDateTime,
                appointmentTime: selectedDateTime
            };
        }

        const appointmentUrl = `${url}/api/appointment/create`;
        const fetchConfig = {
            method: "post",
            body: JSON.stringify(updatedFormData),
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(appointmentUrl, fetchConfig);
        if (response.ok) {
            closeDatePickerModal()
            const formattedDate = formatDate(updatedFormData.appointmentDate)
            const formattedTime = formatTime(updatedFormData.appointmentTime)
            triggerToast(`Appointment Made For ${formattedDate} at, ${formattedTime}!`, "success")
            setFormData({
                appointmentDate: "",
                appointmentTime: "",
                service: 0,
                additionalServices: [],
                guestFirstName: "",
                guestLastName: "",
                guestEmail: "",
                guestPhoneNumber: "",
            });
            if (isLoggedIn) {
                router.push('/myappointments')
            } else {
                router.push('/')
            }
        }
    }
    // ------------------------------------------------------------------------



    // SERVICE CHANGES
    const handleAdditionalServiceChange = (e: any) => {
        const selectedOptions = e.target.value;
        setSelectedAdditionalServices(selectedOptions);
        handleFormChange(e);
    };

    const handleServiceChange = (e: any) => {
        const selectedOption = e.target.value
        setSelectedService(selectedOption);
        handleFormChange(e);
    };
    // ---------------------------------------



    // ERROR MESSAGE
    function clearErrors() {
        setErrorMessage({
            submitForm: "",
            guestClick: "",
        });
    }
    // ---------------------------------------



    // DATE AND TIME PICKER MODAL
    const openDatePickerModal = (field: string) => {
        if (!isLoggedIn && userChoice === 'account') {
            setErrorMessage({ ...errorMessage, [field]: "Please Log In!" });
            openModal()
        } else {
            setDatePickerOpen(true);
        }
    };

    const closeDatePickerModal = () => {
        setDatePickerOpen(false);
    };

    const handleDateTimeChange = (newDate: any) => {
        setSelectedDateTime(newDate)
    };
    // ---------------------------------------




    // PROCEED AS GUEST OR ACCOUNT
    const handleGuestClick = () => {
        clearErrors()
        setShowWelcomeMessage(false);
        if (!isLoggedIn) {
            setUserChoice("guest")
        } else {
            // setErrorMessage('You Are Logged In');
        }
    };

    const handleAccountClick = () => {
        clearErrors()
        setShowWelcomeMessage(false);
        setUserChoice('account')
        if (!isLoggedIn) {
            openModal()
        }
    };
    const handleWelcomeModalClose = () => {
        setShowWelcomeMessage(false);
    };

    const handleWelcomeModalOpen = () => {
        setShowWelcomeMessage(true);
    };
    function handleUseAccount() {
        setUserChoice('account')
        if (!isLoggedIn) {
            openModal()
        }
    }
    // ---------------------------------------

    const theme = createTheme({
        palette: {
            primary: {
                main: blue[700],
                contrastText: '#ffffff',

            },
            secondary: {
                main: blue[600],
            },
        },
    });

    return (
        <div className={styles.appointmentDiv}>
            {showWelcomeMessage && !isLoggedIn ? (
                <Modal
                    open={showWelcomeMessage}
                    onClose={handleWelcomeModalClose}
                >
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <WelcomeMessage
                                onGuestClick={handleGuestClick}
                                onAccountClick={handleAccountClick}
                            />
                        </Suspense>
                    </Box>
                </Modal>
            ) : (
                <div className={styles.appointmentDivChild}>
                    <div className={styles.appointmentGridOne}>
                        <div className={styles.appointmentHeaderDiv}>
                            <h1 className={styles.appointmentHeader}>Make Your Appointment!</h1>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formChild}>
                                {userChoice === 'guest' && (
                                    <div className={styles.inputDivParent}>
                                        <div className={styles.inputDiv}>
                                            <label className={styles.labels} htmlFor="guestFirstName">First Name</label>
                                            <input
                                                value={formData.guestFirstName}
                                                onChange={handleFormChange}
                                                className={styles.input}
                                                type="text"
                                                name="guestFirstName"
                                                id="guestFirstName"
                                            />
                                        </div>
                                        <div className={styles.inputDiv}>
                                            <label className={styles.labels} htmlFor="guestLastName">Last Name</label>
                                            <input
                                                value={formData.guestLastName}
                                                onChange={handleFormChange}
                                                className={styles.input}
                                                type="text"
                                                name="guestLastName"
                                                id="guestLastName"
                                            />
                                        </div>
                                        <div className={styles.inputDiv}>
                                            <label className={styles.labels} htmlFor="guestEmail">Email</label>
                                            <input
                                                value={formData.guestEmail}
                                                onChange={handleFormChange}
                                                className={styles.input}
                                                type="email"
                                                name="guestEmail"
                                                id="guestEmail"
                                            />
                                        </div>
                                        <div className={styles.inputDiv}>
                                            <label className={styles.labels} htmlFor="guestPhoneNumber">Phone Number</label>
                                            <input
                                                value={formData.guestPhoneNumber}
                                                onChange={handleFormChange}
                                                className={styles.input}
                                                type="text"
                                                name="guestPhoneNumber"
                                                id="guestPhoneNumber"
                                            />
                                        </div>
                                    </div>
                                )}
                                <Suspense fallback={<div>Loading...</div>}>
                                    <ServiceSelect
                                        onServiceChange={handleServiceChange}
                                        serviceId={serviceId}
                                        serviceType={serviceType}
                                        isMissing={missingFields.service}
                                    />
                                </Suspense>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <AdditionalServicesSelect
                                        onAdditionalServiceChange={handleAdditionalServiceChange}
                                        serviceId={serviceId}
                                        serviceType={serviceType}
                                    />
                                </Suspense>
                                <div className={styles.submitButtonDiv}>
                                    <button
                                        className={styles.submitButton}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            openDatePickerModal('submitForm');
                                        }}
                                        type='submit'
                                    >
                                        Submit
                                    </button>
                                    {errorMessage && <div className={styles.errorMessageSubmit}>{errorMessage['submitForm']}</div>}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className={styles.appointmentGridTwo}>
                        {userChoice === 'account' && (
                            <div className={styles.appointmentGridTwoChildTwoAccount}>
                                <h4 onClick={handleGuestClick} className={styles.formLinkHeaderAccount}>Use Guest</h4>
                                {/* {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>} */}
                            </div>
                        )}
                        {userChoice === 'guest' && (
                            <div className={styles.appointmentGridTwoChildTwoAccount}>
                                <h4 onClick={handleUseAccount} className={styles.formLinkHeaderAccount}>Use Account</h4>
                                <Link className={styles.formLink} onClick={() => setShowBenefits(true)} href="">Benefits</Link>
                                <Modal
                                    open={showBenfits}
                                    onClose={() => setShowBenefits(false)}
                                >
                                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <Benefits />
                                        </Suspense>
                                    </Box>
                                </Modal>
                            </div>
                        )}
                        <div className={styles.appointmentGridTwoChildOne}>
                            <h4 className={styles.formLinkHeader}>Learn More</h4>
                            <Link className={styles.formLink} href="./services">
                                Services
                            </Link>
                            <Link
                                className={styles.formLink}
                                href="./additionalservices"
                            >
                                Additional Services
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            <Modal
                open={isDatePickerOpen}
                onClose={closeDatePickerModal}
                aria-labelledby="date-picker-modal"
                aria-describedby="static-date-time-picker-modal"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div className="custom-date-picker">
                        <ThemeProvider theme={theme}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <style jsx global>{`
                                    .MuiDialogActions-root > button:first-child {
                                        display: none;
                                    }
                                    .MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.css-1e6y48t-MuiButtonBase-root-MuiButton-root {
                                        color: transparent;
                                        position: relative;
                                        padding: 0;
                                        margin: 0;
                                        text-transform: none;
                                    }
                                    .MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.css-1e6y48t-MuiButtonBase-root-MuiButton-root:hover {
                                        background: none
                                    }
                                    .MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.css-1e6y48t-MuiButtonBase-root-MuiButton-root::after {
                                        content: 'Book';
                                        color: #1976D2; /* Make new text visible */
                                        position: absolute;
                                        text-transform: none;
                                        top: -6.5px;
                                        left: 10px;
                                        padding: 0;
                                        margin: 0;
                                        font-size: 15px;
                                        }`
                                }</style>
                                <Suspense fallback={<CircularProgress />}>
                                    <StaticDateTimePicker
                                        orientation="landscape"
                                        value={selectedDateTime}
                                        onChange={handleDateTimeChange}
                                        open={isDatePickerOpen}
                                        onAccept={handleSubmit}
                                        Cancel={() => alert("ss")}
                                        style={{ position: "relative"}}
                                    />
                                    <button style={{
                                        position: "absolute",
                                        right: "80px",
                                        bottom: "18px",
                                        backgroundColor: "transparent",
                                        outline: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "15px",
                                        color: "red",
                                        opacity: ".8"
                                    }}
                                        onClick={closeDatePickerModal}
                                    >
                                        Close
                                    </button>
                                </Suspense>
                            </LocalizationProvider>
                        </ThemeProvider>
                        <div className="custom-action-bar">
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
export default AppointmentPage;
