import React from "react";
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router';
import AuthContext from './components/AuthProvider/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import Root from "./components/Root/Root";
import Layout from "./components/Pages/AdminAndAgentDashBoard/Admin/DashBoardLayout/Layout";
import AllUser from "./components/Pages/AdminAndAgentDashBoard/Admin/ManagerUser/AllUser";
import AllTransaction from "./components/Pages/AdminAndAgentDashBoard/Admin/ManagerUser/AllTransaction";
import Login from "./components/Pages/Authentication/Login/Login";
import AdminPrivateRoute from "./components/Pages/PrivateRoute/AdminPrivateRoute";
import CreateAgent from "./components/Pages/AdminAndAgentDashBoard/Admin/CreateAgent/CreateAgent";
import Profile from "./components/Pages/Shared/Profile";
import VerificationInformationAdd from "./components/Pages/AdminAndAgentDashBoard/Agent/verificationInformation/VerificationInformationAdd";
import NidDocument from "./components/Pages/AdminAndAgentDashBoard/Admin/ManagerUser/NidDocument";
import Dashboard from "./components/Pages/AdminAndAgentDashBoard/Admin/DashBoardLayout/Dashboard";
import Allwithdraw from "./components/Pages/AdminAndAgentDashBoard/Agent/withdraw/Allwithdraw";
import AgentPrivateRoute from "./components/Pages/PrivateRoute/AgentPrivateRoute";
import NidTransaction from "./components/Pages/AdminAndAgentDashBoard/Admin/NidTransaction/NidTransaction";
import FieldTransaction from "./components/Pages/AdminAndAgentDashBoard/Admin/FieldTransaction/FieldTransaction";
import AgentWithdrawStatus from "./components/Pages/AdminAndAgentDashBoard/Admin/AgentWIthdrawStatus/AgentWithdrawStatus";
import FieldVerificationList from "./components/Pages/AdminAndAgentDashBoard/Agent/FiledVerificatoinList/FieldVerificationList";
import PremiumTransaction from "./components/Pages/AdminAndAgentDashBoard/Admin/PremiumTransaction/PremiumTransaction";
import ContactPayment from "./components/Pages/AdminAndAgentDashBoard/Admin/ContactNumberPayment/ContactPayment";
import Meetup from "./components/Pages/AdminAndAgentDashBoard/Admin/MeetUp/Meetup";
import UserReferSection from "./components/Pages/AdminAndAgentDashBoard/Admin/userRefer/UserReferSection";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Layout></Layout>,
        children: [
          {
            element: <AdminPrivateRoute />,
            children: [
              {
                path: '/',
                element: <Dashboard></Dashboard>
              },
              {
                path: '/all-users',
                element: <AllUser></AllUser>
              },
              {
                path: '/all-refer',
                element: <UserReferSection></UserReferSection>
              },
              {
                path: '/all-transaction',
                element: <AllTransaction></AllTransaction>
              },
              {
                path: '/agent-registration',
                element: <CreateAgent></CreateAgent>
              },
              {
                path: '/field-verification',
                element: <VerificationInformationAdd></VerificationInformationAdd>
              },
              {
                path: '/all-document',
                element: <NidDocument></NidDocument>
              },
              {
                path: '/all-document-transaction',
                element: <NidTransaction></NidTransaction>
              },
              {
                path: "/field-transaction",
                element: <FieldTransaction></FieldTransaction>
              },
              {
                path: "/agent-withdraw-transaction",
                element: <AgentWithdrawStatus></AgentWithdrawStatus>
              },
              {
                path: "/premium-transaction",
                element: <PremiumTransaction></PremiumTransaction>
              },
              {
                path: "/contact-payment",
                element: <ContactPayment></ContactPayment>
              },
              {
                path: "/meetup",
                element: <Meetup></Meetup>
              },
            ]
          },
          {
            element: <AgentPrivateRoute />,
            children: [
              // {
              //   path: '/',
              //   element: <Allwithdraw></Allwithdraw>
              // },
              {
                path: '/all-withdraw',
                element: <Allwithdraw></Allwithdraw>
              },
              {
                path: "/all-field-verification",
                element: <FieldVerificationList></FieldVerificationList>
              },
            ]
          },
          {
            path: '/profile',
            element: <Profile></Profile>
          },
        ]
      }
    ]
  },
  {
    path: "/admin-login",
    element: <Login></Login>
  }
])

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AuthContext>
      <HelmetProvider>
        <React.StrictMode>
          <RouterProvider router={router}></RouterProvider>
        </React.StrictMode>
      </HelmetProvider>
    </AuthContext>
  </QueryClientProvider>
)
