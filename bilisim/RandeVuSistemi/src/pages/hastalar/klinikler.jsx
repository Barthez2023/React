import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarHasta from './navbar';
import KlinikList from '../klinik/ClinicList';

function KliniklerHasta() {
    
    return (
        <div >
            <NavbarHasta/>
            <KlinikList/>
        </div>
    );
}
export default KliniklerHasta;