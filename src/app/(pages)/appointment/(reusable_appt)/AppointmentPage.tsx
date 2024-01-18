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
    appointment_date: string;
    appointment_time: string;
    service: number;
    additional_services?: AdditionalService[];
    guest_first_name?: string;
    guest_last_name?: string;
    guest_email?: string;
    guest_phone_number?: string;
};

type MissingFieldsType = {
    service: boolean
    guest_first_name: boolean
    guest_last_name: boolean
    guest_email: boolean
    guest_phone_number: boolean
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
        guest_first_name: false,
        guest_last_name: false,
        guest_email: false,
        guest_phone_number: false,
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
        appointment_date: "",
        appointment_time: "",
        service: 0,
        additional_services: [],
        guest_first_name: "",
        guest_last_name: "",
        guest_email: "",
        guest_phone_number: "",
    });


    useEffect(() => {
        const userId = Cookies.get('user_id');
        setUserId(userId)

    }, []);

    // FORM CHANGES
    const handleFormChange = (e: any) => {
        const value = e.target.value;
        const inputName = e.target.name;

        if (inputName === "additional_services" && value && value.value === 0)  {
            return;0
        }

        setFormData(prevFormData => {
            if (inputName === "additional_services") {
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
                additional_services: formData.additional_services,
                appointment_date: selectedDateTime ? selectedDateTime.format("YYYY-MM-DD") : "",
                appointment_time: selectedDateTime ? selectedDateTime.format("HH:mm:ss") : "",
                account: parseInt(userId)
            };

        } else {
            updatedFormData = {
                ...formData,
                appointment_date: selectedDateTime ? selectedDateTime.format("YYYY-MM-DD") : "",
                appointment_time: selectedDateTime ? selectedDateTime.format("HH:mm:ss") : ""
            };
        }

        const appointmentUrl = "http://localhost:8080/api/appointments/";
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
            const formattedDate = formatDate(updatedFormData.appointment_date)
            const formattedTime = formatTime(updatedFormData.appointment_time)
            triggerToast(`Appointment Made For ${formattedDate} at, ${formattedTime}!`, "success")
            setFormData({
                appointment_date: "",
                appointment_time: "",
                service: 0,
                additional_services: [],
                guest_first_name: "",
                guest_last_name: "",
                guest_email: "",
                guest_phone_number: "",
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
        const selectedOption = e.target.value;
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
                                            <label className={styles.labels} htmlFor="guest_first_name">First Name</label>
                                            <input
                                                value={formData.guest_first_name}
                                                onChange={handleFormChange}
                                                className={styles.input}
                                                type="text"
                                                name="guest_first_name"
                                                id="guest_first_name"
                                            />
                                        </div>
                                        <div className={styles.inputDiv}>
                                            <label className={styles.labels} htmlFor="guest_last_name">Last Name</label>
                                            <input
                                                value={formData.guest_last_name}
                                                onChange={handleFormChange}
                                                className={styles.input}
                                                type="text"
                                                name="guest_last_name"
                                                id="guest_last_name"
                                            />
                                        </div>
                                        <div className={styles.inputDiv}>
                                            <label className={styles.labels} htmlFor="guest_email">Email</label>
                                            <input
                                                value={formData.guest_email}
                                                onChange={handleFormChange}
                                                className={styles.input}
                                                type="email"
                                                name="guest_email"
                                                id="guest_email"
                                            />
                                        </div>
                                        <div className={styles.inputDiv}>
                                            <label className={styles.labels} htmlFor="guest_phone_number">Phone Number</label>
                                            <input
                                                value={formData.guest_phone_number}
                                                onChange={handleFormChange}
                                                className={styles.input}
                                                type="text"
                                                name="guest_phone_number"
                                                id="guest_phone_number"
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
                                href="./additional_services"
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
