import React from 'react';
import style from './uzmanlik.module.css'
import NavbarAmin from '../navBarAdmin';
import UzmanlikElement from './uzmanlikelement';
function UzmanlikList() {
  return (
    <div className={style.dashboard}>
        <NavbarAmin/>
        <UzmanlikElement/>
    </div>
  );
}

export default UzmanlikList;

