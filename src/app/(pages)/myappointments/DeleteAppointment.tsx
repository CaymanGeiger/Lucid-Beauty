"use client"
import React, { useEffect, useState, Suspense } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import "./deleteappointment.css"
import emailjs from 'emailjs-com';
import Cookies from 'js-cookie';
import { useLoading } from '@/(extras)/(loading)/LoadingContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { useToast } from '@/(extras)/(toast)/useToastContext';

const StaticDateTimePicker = React.lazy(() => import('@reuse_appointment/StaticDateTimePickerWrapper'));


type DeleteMessageProps = {
    appointmentId: any;
    fetchAppointments: (userId?: string) => void;
}


function formatDate(dateString: any) {
    return dayjs(dateString).format("dddd, MMMM YYYY");
}

function formatTime(timeString: any) {
    return dayjs(timeString, 'HH:mm:ss').format("h:mmA");
}


const DeleteMessage: React.FC<DeleteMessageProps> = ({ appointmentId, fetchAppointments }) => {
    const [alertOpened, setAlertOpened] = useState(false);
    const [isDatePickerOpen, setDatePickerOpen] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");
    const [selectedDateTime, setSelectedDateTime] = useState<any>(dayjs());
    const [userFirstName, setUserFirstName] = useState<string>("");
    const [contactNumber, setContactNumber] = useState(0);
    const triggerToast = useToast();
    const [id, setId] = useState(0);
    const { toggleIsLoading } = useLoading();


    useEffect(() => {
        emailjs.init("mgv81uDPxrbQztIAg");
        const userIdFromCookie = Cookies.get('user_id');
        const userFirstNameFromCookie = Cookies.get('user_first_name');
        if (userIdFromCookie) {
            setUserId(userIdFromCookie)
        }
        if (userFirstNameFromCookie) {
            setUserFirstName(userFirstNameFromCookie)
        }
    }, []);


    const emailParams = {
        user_email: "caymangeiger@gmail.com",
        to_name: "Cayman Geiger",
        service_name: "Lashes",
        appointment_date: "10/10/2021",
        appointment_time: "10:00 AM",
    };


    const sendEmail = async (e:any) => {
        toggleIsLoading();
        e.preventDefault();

        setContactNumber(Math.floor(Math.random() * 100000));

        emailjs.send('service_ip0a9ps', 'template_uqkdchg', emailParams, 'mgv81uDPxrbQztIAg')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                toggleIsLoading();
                setAlertOpened(false)
            }, (error) => {
                toggleIsLoading();
                setAlertOpened(false)
                console.log('FAILED...', error);
            });

        try {
            const response = await fetch(`http://localhost:8080/api/appointments/${id}/`, {
                method: 'DELETE'
            });
            console.log('Delete successful:', response);
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            fetchAppointments(userId)
        }
    };


    const handleSubmit = async () => {
        const updatedFormData = {
            appointment_date: selectedDateTime ? selectedDateTime.format("YYYY-MM-DD") : "",
            appointment_time: selectedDateTime ? selectedDateTime.format("HH:mm:ss") : "",
        };

        const appointmentUrl = `http://localhost:8080/api/appointments/${id}/`;
        const fetchConfig = {
            method: "PATCH",
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
            triggerToast(`Appointment rescheduled for ${formattedDate} at, ${formattedTime}!`, "success")
            fetchAppointments(userId)
        }
    }


    const openDatePickerModal = () => {
        setAlertOpened(false)
        setDatePickerOpen(true);
    };

    const closeDatePickerModal = () => {
        setDatePickerOpen(false);
    };

    const handleDateTimeChange = (newDate: any) => {
        setSelectedDateTime(newDate)
    };

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
        <>
            <AlertDialog.Root
                open={alertOpened}
            >
                <AlertDialog.Trigger asChild>
                    <button
                        onClick={() => { setAlertOpened(true), setId(appointmentId.id)}}
                        className="Button violet"
                    >
                        Edit Appointment
                    </button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                    <AlertDialog.Content className="AlertDialogContent">
                        <AlertDialog.Title className="AlertDialogTitle">Are you absolutely sure?</AlertDialog.Title>
                        <AlertDialog.Description className="AlertDialogDescription">
                            You will receive an email confirming your appointment has been cancelled.
                        </AlertDialog.Description>
                        <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
                            <AlertDialog.Cancel asChild>
                                <button
                                    onClick={() => setAlertOpened(false)}
                                    className="Button mauve"
                                >
                                    Close
                                </button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button
                                onClick={openDatePickerModal}
                                className="Button violet reschedule">
                                    Reschedule
                                </button>
                            </AlertDialog.Action>
                            <AlertDialog.Action asChild>
                                <button
                                    className="Button red"
                                    onClick={sendEmail}
                                >
                                    Cancel Appointment
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
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
                                        style={{ position: "relative" }}
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
        </>
    );
}

export default DeleteMessage;
