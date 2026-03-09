src/
  ├── components/    # Petits éléments réutilisables (Boutons, Cartes)
  ├── context/       # Gestion de l'utilisateur (AuthContext)
  ├── hooks/         # Logique métier (useAppointments, useClinics)
  ├── layouts/       # Structures de pages (Navbar + Footer)
  ├── pages/         # Les vues complètes (Login, PatientDash, DoctorDash)
  ├── services/      # Appels vers ton backend PHP (API)
  └── utils/         # Fonctions d'aide (formatage de date, etc.)

Le système de Navigation et d'Authentification
Nous allons créer la structure de base qui sépare les Patients des Médecins. c'est la structure login qui permettra au utilisateur de de s'enreigister sur la platforme
# partir1:creation de la page d'acceuil
Création de la Page d'Accueil Authentification (AuthHome)
L'objectif ici est de créer une "Landing Page" (page d'atterrissage) qui présente le système HASTENE RENDEVU SISTEMI et propose les deux choix d'entrée.Soit un LogIn soit un Signin.
Dans page:------------------------>
#### Auth represente la premiere page qui sevira d'authentification

# partie2: misee en place de la page de sign in 
Pour le sign in on va recuperer des info telque 
    nom:string,
    prenom: string,
    dateNaissance: date,
    email: string,
    ville: (valeur d'un select:string),
    quartier(il): (valeur d'un select:string),
    rue(ilce): (valeur d'un select:string),
    situation: (valeur d'u3 select:string)
    sexe: string,
    telephone: string,
    password: string,
    confirmPassword: string
ici on utilise une Api pour recuperer les dosnnes liees au il,ilce et mahalle    
API il:https://beterali.com/api/v1/cities
API ilce:https://beterali.com/api/v1/districts?city_code=6
API mahalle:https://beterali.com/api/v1/neighbourhoods?districts_code=1747
Lorsque l'tutilisateur se connecte il a deux choix soit il est dirriger vers le menu sign ou login.
Dans le menu sign in il remplir ces infos et si tout est valide un popup apparais pour confirmed son inscription et disparait apres 3 seconde et dirige automatiquement le user vers la page de login




/*const data = {
    Istanbul:{
      Kadikoy:["Rue1","Rue2","Rue3","Rue4"],
      Besiktas:["Rue4","Rue5","Rue6","Rue7"],
      Uskudar:["Rue8","Rue9","Rue10","Rue11"]
    },
    Ankara:{
      Cankaya:["Rue12","Rue22","Rue32","Rue42"],
      Kecioren:["Rue13","Rue23","Rue33","Rue43"],
      Mamak:["Rue14","Rue24","Rue34","Rue44"]
    },
    Konya:{
      Selcuklu:["Rue15","Rue25","Rue35","Rue45"],
      Meram:["Rue16","Rue26","Rue36","Rue46"],
      Karatay:["Rue17","Rue27","Rue37","Rue47"]
    }
  };

  const [sehir, setsehir] = useState("");
  const [iller, setiller] = useState([]);
  const [il, setil] = useState("");
  const [ilce, setilce] = useState([]);

  // sehier degismesi   --> change the city
  const handleSehirChange = (e) => {
    const selectedsehir= e.target.value;
    setsehir(selectedsehir);

    const IllerList = Object.keys(data[selectedsehir] || {});  //Object.keys(data) récupère les clés de l'objet 
    setiller(IllerList);
    setil("");
    setilce([]);
  };

  
  // iller degismesi -->
  const handleIlChange = (e) => {
    const selectedIl = e.target.value;
    setil(selectedIl);

    const ilceList = data[sehir][selectedIl] || [];
    setilce(ilceList);
  };*/


<select onChange={handleSehirChange} value={sehir}>
    <option value="">Choisir une ville</option>
    {Object.keys(data).map((v) => (                       //récupère les clés de l'objet :["Istanbul", "Ankara", "Konya"]
    <option key={v} value={v}>{v}</option>
    ))}
</select>

<select value={il} onChange={handleIlChange} disabled={!sehir}>
              <option value="">Choisir un quartier</option>
              {iller.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
              
</select>
 <select  disabled={!il}>
              <option value="">hoisir une rue</option>
              {ilce.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
</select>

import Select from "react-select";
isSearchable={true}   // active la recherche  using with 