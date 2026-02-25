import { useState } from 'react'
import './App.css'
import Header from './components/Header/header'
import ServiceCard from './components/services/ServiceCard'
import  Clinique  from './components/clinique/clinique'
import Formulaire from './components/formulaire/formulaire'
import DoctorList from './components/docteur/DoctorList'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Nav from './components/navBar/nav'
import Confirmation from './components/formulaire/confirmation'
import DoctorListFiltre from './components/docteur/DocteurListeFiltre'
import style from "./components/formulaire/formulaire.module.css"

function App() {
  const navigate=useNavigate()
  const [count, setCount] = useState(0)
  // 1. L'état "Source de vérité" est ici
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  // 2. La fonction que le parent va donner à l'enfant
  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor); // On enregistre le docteur choisi
    navigate('/reservation')
  };
  const rendevous=()=>{
    navigate('/reservation')
  }
  console.log(selectedDoctor)
  //ce state permet de  recuperer la  une spacialite selectionner dans le form
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  //permet de recuperer le temps du rendez-vous 
  const [rendevoustime, setRendeVousTime] = useState("");
  // 3. On crée un State pour le nom du patient
  const [patientName, setPatientName] = useState("");


  // 2. Le composant principal qui assemble tout
  return (
    <div>
    {/*Router (souvent BrowserRouter) est le contexte global qui permet à l'application de gérer les URLs
    sans lui Les <Route> Les <Link>  Les <Routes> ne fonctionne pas. Il doit être utilisé une seule fois, généralement dans App.jsx ou main.jsx.*/}
        <Nav/>
        <Routes>
          {/*Route définit : "Si l’URL correspond à ce chemin, affiche ce composant."
          Routes est juste un conteneur de plusieurs Route.
          path="chemin permet de definir le chemin de la page que l'on souhaite afficher
          element={conposnat} c'est le composant qui dois s'afficher quand on clique sur le chemin entree dans le path*/}
          <Route path='/' element={
            <>
              <Header/>
              <main>
                <h2>Bienvenue sur votre portail de santé</h2>
                <button style={{backgroundColor:'#3498db', color:'white', border:'none'}} onClick={rendevous}>Prendre un premier rendez-vous</button>
              </main>
              <Clinique/>
            </>
          }/>
          <Route path='/docteurs' element={
            <>
              <div className='docteur'>
                <ServiceCard name="Cardiologie" doctor="Dr. Dupont" />
                <ServiceCard name="Dentisterie" doctor="Dr. Martin" />
                <ServiceCard name="Petiatrie" doctor="Dr. Lucas" />
                <ServiceCard name="Petiatrie" doctor="Dr. Lucas" />
                <ServiceCard name="Petiatrie" doctor="Dr. Lucas" />
              </div>
              <DoctorList handleSelectDoctor={handleSelectDoctor} 
                selectedSpecialty={selectedSpecialty}
                rendevoustime={rendevoustime}
                setRendeVousTime={setRendeVousTime}/>
            </>

          }/>
          <Route path='/reservation' element={
            <>
              <Formulaire handleSelectDoctor={handleSelectDoctor} selectedDoctor={selectedDoctor}
              selectedSpecialty={selectedSpecialty}  setSelectedSpecialty={setSelectedSpecialty}
              rendevoustime={rendevoustime} patientName={patientName} setPatientName={setPatientName}/>
              <DoctorListFiltre handleSelectDoctor={handleSelectDoctor} 
                selectedSpecialty={selectedSpecialty}
                rendevoustime={rendevoustime}
                setRendeVousTime={setRendeVousTime}/>
            </>
          }/>
          <Route path='/confirmation' element={
            <>
              <Confirmation selectedSpecialty={selectedSpecialty}  selectedDoctor={selectedDoctor}
              rendevoustime={rendevoustime} patientName={patientName}/>
            </>
          }/>
          
        </Routes>
      
  
      {/* <Nav/>
      <Header/>
      <main>
        <h2>Bienvenue sur votre portail de santé</h2>
        <button>Prendre un premier rendez-vous</button>
      </main>
      <div className='docteur'>
              <ServiceCard name="Cardiologie" doctor="Dr. Dupont" />
              <ServiceCard name="Dentisterie" doctor="Dr. Martin" />
              <ServiceCard name="Petiatrie" doctor="Dr. Lucas" />
              <ServiceCard name="Petiatrie" doctor="Dr. Lucas" />
              <ServiceCard name="Petiatrie" doctor="Dr. Lucas" />
      </div>
      <Clinique/>
      <Formulaire handleSelectDoctor={handleSelectDoctor} selectedDoctor={selectedDoctor}
      selectedSpecialty={selectedSpecialty}  setSelectedSpecialty={setSelectedSpecialty}
      rendevoustime={rendevoustime}/>
      <DoctorList handleSelectDoctor={handleSelectDoctor} 
      selectedSpecialty={selectedSpecialty}
      rendevoustime={rendevoustime}
      setRendeVousTime={setRendeVousTime}/> */}
     
    </div>
  )
}

export default App
