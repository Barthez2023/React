import React from 'react';
import style from './doktorList.module.css'
import NavbarAmin from '../navBarAdmin';
import DoktorList from './doktorList';
function Doktorlar() {
  return (
    <div className={style.dashboard}>
        <NavbarAmin/>
        <DoktorList/>
    </div>
  );
}

export default Doktorlar;
