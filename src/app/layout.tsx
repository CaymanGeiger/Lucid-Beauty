import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from "./(extras)/(nav)/navbar"
import { AuthProvider } from './(auth)/authcontext';
import { ModalProvider } from './(accounts)/loginmodal';
import { ToastContainer } from "react-toastify";
import { DarkModeProvider } from './(extras)/(darkmode)/DarkModeContextProvider';
import { LoadingProvider } from './(extras)/(loading)/LoadingContext';
import { ToastProvider } from './(extras)/(toast)/ToastContextProvider';
import AppointmentCart from './(onscreen)/(cart)/AppointmentCart';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import './globals.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hannahs Website',
  description: "yay"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <body className={inter.className}>
        <DarkModeProvider>
          <ToastProvider>
            <AuthProvider>
              <LoadingProvider>
                <ModalProvider>
                  <Navbar />
                  {children}
                  <AppointmentCart />
                  <ToastContainer />
                </ModalProvider>
              </LoadingProvider>
            </AuthProvider>
          </ToastProvider>
        </DarkModeProvider>
      </body>
    </html>
  )
}
