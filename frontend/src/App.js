import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Auth from "./components/auth"
import Home from './components/home';
import WorkoutData from './components/workoutData';
import BasicLayout from './components/baiscLayout';
import LandingPage from './components/landingPage';
import Youtube from './components/youtube';
import UserCenter from './components/userCenter';
import { useContext } from 'react';
import { AccountContext } from './contexts/accountContext';
import data from './db/workout-data.json'

function App() {
  const { isLoggedIn } = useContext(AccountContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/signin" element={<Auth info = "signin"/>} />
        <Route path="/auth/signup" element={<Auth info = "signup"/>} />
        {isLoggedIn && (
          <Route path="/home" element={<BasicLayout />}>
            <Route index element={<Home />} />
            <Route path="data" element={<WorkoutData data ={data}/>} />
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