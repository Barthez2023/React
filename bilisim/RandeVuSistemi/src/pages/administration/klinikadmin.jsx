import React from 'react';
import style from './klinikadmin.module.css'
import NavbarAmin from './navBarAdmin';
import KlinikList from '../klinik/ClinicList';

function KlinikAdmin() {
  return (
    <div className={style.dashboard}>
        <NavbarAmin/>
        <KlinikList/>
        
    </div>
  );
}

export default KlinikAdmin;

