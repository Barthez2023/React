import { useState } from 'react'
import './App.css'
import AuthHomeHasta from './pages/Auth/AuthHomehasta'
import React from 'react'
import { BrowserRouter, Routes, Route,useNavigate } from "react-router-dom";
import SignInPatient from './pages/signin/signinhasta';
import LoginHasta from './pages/login/loginhasta';
import Klinik from './pages/klinik/klinik';
import Home from './pages/home/home';
import AuthHomeDoktor from './pages/Auth/AuthHomedoktor';
import SignInDoktor from './pages/signin/signdoktor';
import LoginDoktor from './pages/login/logindoktor';
import LoginAdmin from './pages/login/loginadlin';
import KlinikList from './pages/klinik/ClinicList';
import AdminHomePage from './pages/administration/homePage';
import KlinikAdmin from './pages/administration/klinikadmin';
import UzmanlikList from './pages/administration/uzmanlik/uzmanlik';
import Doktorlar from './pages/administration/doktorlar/doktorlar';
import WelcomeDoktor from './pages/doktorlar/DoktorHomePage';
import WelcomeHasta from './pages/hastalar/HastaHomePage';
import KliniklerHasta from './pages/hastalar/klinikler';
import RandevularimHasta from './pages/hastalar/randevularim';
import DoctorBugunkuRandevu from './pages/doktorlar/bugunRandevu';
import DoctorGecmisRandevu from './pages/doktorlar/gecmisRandevu';
import HastaGecmisRandevularim from './pages/hastalar/gecmisRendevular';
import Hastalar from './pages/administration/hastalar/hastalarList';
import AdminStats from './pages/administration/home1';
import DoktorStats from './pages/administration/home1';

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/hasta" element={<AuthHomeHasta/>} />
      <Route path="/doctor" element={<AuthHomeDoktor/>} />
      <Route path="/signinhasta" element={<SignInPatient/>} />
      <Route path="/loginhasta" element={<LoginHasta/>} />
      <Route path="/signindoktor" element={<SignInDoktor/>} />
      <Route path="/logindoktor" element={<LoginDoktor/>} />
      <Route path="/loginadmin" element={<LoginAdmin/>} />
      <Route path="/klinikList" element={<KlinikList/>} />
      <Route path="/adminhomepage" element={<AdminHomePage/>} />
      <Route path="/klinikadmin" element={<KlinikAdmin/>} />
      <Route path="/uzmanliklist" element={<UzmanlikList/>} />
      <Route path="/doktorlar" element={<Doktorlar/>} />
       <Route path="/hastalar" element={<Hastalar/>} />
      <Route path="/doktor/welcome" element={<WelcomeDoktor/>} />
      <Route path="/hasta/welcome" element={<WelcomeHasta/>} />
      <Route path="/hasta/klinik" element={<KliniklerHasta/>} />
      <Route path="/hasta/randevularim" element={<RandevularimHasta/>} />
      <Route path="/hasta/gecmisrandevular" element={<HastaGecmisRandevularim/>} />
      <Route path="/doktor/bugunkurandevular" element={<DoctorBugunkuRandevu/>} />
      <Route path="/doktor/gecmisrandevular" element={<DoctorGecmisRandevu/>} />
      <Route path="/admin/doktor/DoktorStats/:id" element={<DoktorStats/>} />
      <Route path="/klinik" element={<Klinik/>} />
      <Route path="/adminStats" element={<AdminStats/>} />

    </Routes>
    </>
  )
}

export default App
