import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './HastaHomePage.module.css'
import NavbarHasta from './navbar';



function WelcomeHasta() {
    
    return (
        <div style={{padding: '100px 40px 40px'}}>
            <NavbarHasta/>
            <p>Welcom patient x</p>
        </div>
    );
}

export default WelcomeHasta;