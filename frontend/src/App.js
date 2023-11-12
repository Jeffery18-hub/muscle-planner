import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Auth from "./containers/auth"
import Home from './containers/home';
import DataDashboard from './containers/dataDashboard';
import BasicLayout from './containers/baiscLayout';
import LandingPage from './containers/landingPage';
import Youtube from './containers/youtube';
import UserCenter from './containers/userCenter';
import { useContext } from 'react';
import { AccountContext } from './contexts/accountContext';
import data from './db/workout-data.json'
import { Guest } from './containers/guest';

function App() {
  const { isLoggedIn } = useContext(AccountContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/guest" element={<Guest/>} />
        <Route path="/auth/signin" element={<Auth info = "signin"/>} />
        <Route path="/auth/signup" element={<Auth info = "signup"/>} />
        {isLoggedIn && (
          <Route path="/home" element={<BasicLayout />}>
            <Route index element={<Home />} />
            <Route path="data" element={<DataDashboard data ={data}/>} />
            <Route path="youtube" element={<Youtube />} />
            <Route path="account" element={<UserCenter />} />
          </Route>
        )}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App