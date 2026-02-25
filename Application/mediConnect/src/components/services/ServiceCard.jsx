import style from   "./servicesCard.module.css"
const  ServiceCard=(props)=> {
  // props est un objet qui contient tout ce qu'on a envoyé au composant
  return (
    <div className={style.card}>
      <h3 className={style.doctorname}>{props.name}</h3>
      <p className={style.doctorspeciality}>Spécialiste : {props.doctor}</p>
    </div>
  );
}

export default ServiceCard;