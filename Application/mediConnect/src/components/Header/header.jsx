// 1. Définition du composant Header
// Un composant commence TOUJOURS par une majuscule
import style from "./header.module.css"
const  Header=()=> {
  return (
    <header className={style.head}>
      <h1>MediConnect - Clinique Centrale</h1>
      <p>Votre santé, notre priorité</p>
    </header>
  );
}
export default Header