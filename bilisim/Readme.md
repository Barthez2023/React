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

# Gestion de la base de donnees
Actuellement j'ai 6 table dans la base de donnees:table patient,docteur,admin,city,hospital,depatement.Un patient peut consulter plusieurs docteurs et un docteur peut avoir plusieurs patients.L'administrateur se charge de gerer les docteurs et les patients du system.Un hopital peut avoir plusieurs docteurs ,mais un docteur appartient juste a un hopital.Une ville peut avoir plusieurs hopitaux mais un hopital n'appartient que a une seul ville.Chaque hopital a plusieurs departement.
# Patient ↔ Docteur
Relation : Plusieurs à plusieurs (Many-to-Many)
Raisonnement : Un patient peut consulter plusieurs docteurs et un docteur peut avoir plusieurs patients.
Solution : Créer une table de liaison Patient_Doctor :
{
    Patient_Doctor
    ---------------------
    patient_id (FK → Patient.id)
    doctor_id (FK → Doctor.id)
    date_consultation
    notes
    PRIMARY KEY (patient_id, doctor_id)
}
# Hospital ↔ Docteur
Relation : Un à plusieurs (One-to-Many)
Un hôpital peut avoir plusieurs docteurs, un docteur appartient à un seul hôpital.
Doctor.hospital_id est une clé étrangère vers Hospital.id.
# City ↔ Hospital
Relation : Un à plusieurs
Une ville peut avoir plusieurs hôpitaux, un hôpital appartient à une seule ville.
Hospital.city_id est une clé étrangère vers City.id.
# Hospital ↔ Department
Relation : Un à plusieurs
Chaque hôpital peut avoir plusieurs départements.
Department.hospital_id est une clé étrangère vers Hospital.id.
# Admin ↔ Patient / Docteur
Relation implicite : Un admin gère tous les patients et docteurs.
Tu peux ajouter un champ created_by_admin_id si tu veux tracer quel admin a ajouté quel utilisateur.
# Appointment (Rendez-vous)
Pour gérer les rendez-vous patient-docteur.
{
    Appointment
    -------------------
    id
    patient_id (FK → Patient.id)
    doctor_id (FK → Doctor.id)
    date
    time
    status (confirmé, annulé, en attente)
    notes
}
# Table hastalar
  CREATE TABLE Hastalar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    birth DATE NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    city_code INT,
    district_code INT,
    neighbourhood_code INT,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    gender CHAR(1) DEFAULT 'M',
    status VARCHAR(20) DEFAULT 'Genç',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
# NB:npm install axios  vas nous permettre d'utiliser le axios pour lier notre php a notre react  et on dois l'importer apres :import axios from 'axios';.
# NB ces headers sont important pour la connection de php a react
// Headers CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

# NB on utilise awit uniquement avec des fonctioon asynchrone 
const handleLogin = async(e) => {
    e.preventDefault();
    const response =await axios.post('http://localhost/BilisimTekno/signHasta.php',formData)
    console.log(response.data)               //for debugging
  };



#lorque un doktor s'enreigistre , il fournir son nom ,prenom,date de naissance ,specialite ,numero de travailleur.Une fois valider il est diriger vers la page de login.
# creation de la table doktor
CREATE TABLE doktorlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Surname VARCHAR(100) NOT NULL,
    Birth DATE NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    city VARCHAR(100),
    worknumber VARCHAR(50),
    speciality VARCHAR(100),
    telephone VARCHAR(50),
    hash_password VARCHAR(255) NOT NULL,
    hasta_id INT,
    FOREIGN KEY (hasta_id) REFERENCES hastalar(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# creation de la table admin
;'admin n'aura pas besoins de faire un sign in ces elemnts sont drectement stocker en db il fait juste un sign in.
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL ,
    Surname VARCHAR(100) NOT NULL,
    Birth DATE NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telephone VARCHAR(50) ',
    hash_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO admin (Name, Surname, Birth, email, telephone, hash_password) VALUES ('Ahmet', 'Demir', '1985-03-21', 'mehmet@gmail.com', '05086358941', '123456789');
une fois l'utilisatur enreigister il est diriger vers l'espace qui contient tous les  clinique qui se trouve dans la memem ville que lui .Seul le admina le droit de voir toute les clinique presnte dans le hastane db ou api
# Etapes suivante:
-gerer le boutton recherche
-integrer l'api pour la gestion des clinique ou une database
Le patient a la possiblite de filtrer les clinique en utilisant la boutton recheche
# creation de la db klinik
cette base de donnees permettra de stocker des infos en rapport avec le clinique etant donner que l'on ne peut pas cherger tous les clique de l'API dans notre programme
CREATE TABLE klinik (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    description TEXT,
    horaire VARCHAR(100),
    branches VARCHAR(255),
    doctors INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Overpass API
     ↓
React (axios)
     ↓
PHP API (saveHospitals.php)
     ↓
MySQL (table klinik)

-konya :(37.8300,32.4000,38.0500,32.7000)
-Istanbul :(40.8,28.5,41.3,29.5)
-izmir :(38.35,26.95,38.55,27.25)
-Antalya:(36.80,30.60,36.95,30.85)
-Ankara:(39.85,32.75,40.05,33.05)
-Bursa:(40.15,28.90,40.25,29.05)
-Trabzon:(39.65,39.60,41.05,39.85)
-Kayseri:(38.65, 35.35, 38.80, 35.65)

# choix du departemant
Lorsque un hasta choisir son hopital un popup apparait et lui demande de choisir la specialite dans laquelle il veut prendre rendezvous
# creation de la table bolumler
CREATE TABLE Uzmanlık (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    icon VARCHAR(100) NOT NULL
);
# Not:klinik?.id 
On appelle cela l'Optional Chaining (le chaînage optionnel).
Le ?. dit à JavaScript : "Regarde si l'objet devant moi existe. S'il existe, donne-moi son ID. S'il est nul ou indéfini, arrête-toi là et renvoie simplement undefined au lieu de faire planter tout le site.""Utilisez le ?. dès que vous manipulez des données qui viennent d'une base de données ou d'une API. C'est une assurance vie pour votre code. Cela montre que vous êtes un développeur qui prévoit les erreurs au lieu de les subir."

# 18-03-2026
creation et configuration de l'espace admin 
l'admin a la possibilite d'ajouter une clinique  et ,de voir la iste de tout les cliniques presnete dans le systeme.Il peut aussi consulter la liste de toutes les specialite pour chaque specialite on voir les clinique qui propose cette specialite,les medecins qui ont les capacite de consulter sur cette specialite .Pour le admin on aura un navbar avec :Home-clinique-doktors-specialites-patients. 
L'admin peut ajouter plusieurs clinique correspondant a une zone geographique defini et il peut aussi juste ajouter une clinque tous ces boutton sont controler par le boutton principale clinique.L'ajout des clinique est directement ajouter a la db

# 19-03-2026  
Nous allons travailler sur uzmanlik de meme que clinique l'admin aura la possiblite d'ajouter de nouvelles branche de medecines .Dans l'onglet uzmanlik la premier page presente toute des clinique sous forme de block et la liste deroulante de uzmanlik contient un boutton 'Uzmanlik ekle' qui permet d'ajouter une nouvelle discipline et 'Uzmanlik sil' permet de suprimer une discipline.
Chaque bloc contient le nom de l'uzmanlik ,les klinik qui propose cette specialite ,le nombre total de docteurs et le nom des docteurs qui consulte sur cette discipline.
# NB 
Souviens-toi : Tout ce qui est utilisé à l'intérieur d'un useMemo ou d'un useEffect et qui peut changer au cours du temps DOIT être listé dans les dépendances.
useMemo est le "pense-bête" de React. C'est un Hook qui sert à optimiser les performances en mettant en cache (on dit "mémoriser") le résultat d'un calcul coûteux.
Imagine que tu as une fonction qui prend 2 secondes à s'exécuter. Sans useMemo, React relancerait ce calcul de 2 secondes à chaque fois que ton composant se met à jour (même pour un petit changement d'état qui n'a rien à voir). Avec useMemo, React dit : "Attends, les ingrédients n'ont pas changé, je te redonne le résultat que j'avais déjà calculé la dernière fois !"
useMemo prend deux arguments :
  Une fonction qui effectue le calcul.
  Un tableau de dépendances (comme useEffect).

# ici on va lier les table doktor et uzmanmlik
-- 1. On ajoute la colonne dans la table doktor (si elle n'existe pas déjà)
ALTER TABLE doktor ADD COLUMN specialite_id INT;
-- 2. On définit cette colonne comme une Clé Étrangère (Foreign Key)
ALTER TABLE doktor 
ADD CONSTRAINT fk_doktor_specialite 
FOREIGN KEY (specialite_id) 
REFERENCES uzmanlik(id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

# 23-03-2026
ici on va travailler sur la partir doktor .Lorsque un doktor s'enreigistre il est visible sur l'interface doktorlar d∈adlin et c'est l'admin qui lui associe un optital .Nous allons mettre en place cela.
# 24-03-2026
Avant de continuer sur la gestion des boutton "klinik ver" de l'interface doktorlar de l'admin qui va permettre a l'admin d'assigner un clinique a un doktor ,nous allons d'abors essayer de definier pour chaque clinique une nombre de specilite specifique.
CREATE TABLE klinik_uzmanlik (
    klinik_id INT,
    uzmanlik_id INT,
    -- On définit une clé primaire composée pour éviter les doublons
    PRIMARY KEY (klinik_id, uzmanlik_id),
    -- On lie les IDs aux tables parentes
    FOREIGN KEY (klinik_id) REFERENCES klinik(id) ON DELETE CASCADE,
    FOREIGN KEY (uzmanlik_id) REFERENCES Uzmanlık(id) ON DELETE CASCADE
);
# Not:ON DELETE CASCADE. Cela signifie que si tu supprimes une clinique, les liens vers ses spécialités sont automatiquement nettoyés. 
On va se penche sur l'ajout d'une clinique pour ajouter une clinique l'admin dois devoir choisir les differentes brances de cette clinique et nous allons mettre au fur et a mesure la table klinik_uzmanlik a jour.
# 26-03-2026
on va modifier le boutton ajout d'une clinique de telle facon que lorsque l'admin ajoute une clinique il peut directement choisir les differentes specialites que propose la clinique.

# error_log("new_clinic_id: " . $new_clinic_id);
error_log("uzmanlik_ids: " . json_encode($uzmanlik_ids));
error_log("empty check: " . (empty($uzmanlik_ids) ? "VIDE" : "NON VIDE"));
echo json_encode([
    "success"        => true,
    "debug_id"       => $new_clinic_id,
    "debug_uzmanlik" => $uzmanlik_ids,
    "debug_empty"    => empty($uzmanlik_ids),
]);
# exit(); // ← stoppe ici pour voir le debug   permet de debuger

On vas maintenant compter le nombre de clinique qui propose les differentes specilite et on va ajouter a chaque specialite le nombre de clinique qui propose cette sepcialite.On va gerer le boutton "Klinik Ver" pour permettre a l'admin d'attribuer des clinique aux doktors.


# 28-03-2026
recuperer le doctor_id,l'envoyer   dans un .php et  stocker l'id de la clinique correspondante dans la db doktor  ,changer le durum en mettant le nom de la clinique ,stocker et mettre a jour el nombre de specilite et de docteurs de chaque clinique dans la db.
# 29-03-2026
on va travailler sur le cadre qui s'affiche lorsque on lcique sur le boutton "prendre rendezvous" dans klinik.Si dans cet hopital seulement les specialites ayant un dokteur seront cliquable le reste sera disable.Lorsque on clique sur la specialite ,la liste des docteurs qui consulte sur cette specialite dans cet hopital s'ouvre sous forme de popup.

# 30-03-2026
ici on va travailler sur l'interface  de docteur.Une fois le docteur login il est dirriger vers l'interface propre a un docteur.
En utilisant localStorage.setItem, le nom du docteur reste affiché même s'il actualise la page (F5).
` Note importante :`
# Quand on envoir les donnes avec la methode GET dans le axios comme:
const result = await axios.get("http://localhost/BilisimTekno/getDoktorInfo.php",{idDoktor});
pour recuperer dans le php on fait:$idDoktor = isset($_GET['idDoktor']) ? intval($_GET['idDoktor']) : 0;   //ici  intval:permet juste de convertir en nombre 

# Quand on envoir les donnes avec la methode POST  dans le axios comme:
const result = await axios.post("http://localhost/BilisimTekno/getDoktorInfo.php",{idDoktor:id});
pour recuperer dans le php on fait:
//Lire le JSON envoyé par Axios
$json = file_get_contents('php://input');
$data_input = json_decode($json, true);
//lire la donnes proprement dit
$idDoktor = isset($data_input['idDoktor']) ? intval($data_input['idDoktor']) : 0;

// Gérer le preflight OPTIONS (indispensable pour Axios)  se met dans le php GET comme POST
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}
# "new Date()" récupère automatiquement l'heure réglée sur l'ordinateur (ou le téléphone) du docteur. S'il est à Istanbul ou à Paris, l'heure sera juste.
Internationalisation : Intl.DateTimeFormat est géré nativement par tous les navigateurs modernes. C'est beaucoup plus léger que d'installer une bibliothèque comme moment.js ou date-fns.
# 31-03-2026
on a travailler l'interface docteur lorsau un medecin ce connecte s'il a deja ete assigner a une clinique les information de la clinique s'affiche te l'utilisateur peut aussi voir ces propres infos.L'utilisateur a la possibilite de definir une plage de temps dans lequel est sera disponible pour des rendez-vous.Pour definir les plages de rendez-vous  il dois choisir le jour ,l'heure de bedut et l'heure de fin.
# 01-04-2026
On va afficher les plage entrer par le docteur dans le cadre au dessus du boutton "Randevu programımı düzenle" et ensuite on vas liee les palges de temps au cliniques pour permettre au patient de consulter les palges de temps et de prendres rendez-vous.
# 02-04-2026
Nous allons nous attaquer sur l'interface patient pour cela nuos devons creer un table randevular qui va regrouper les patient ayant pris rendevous chez x docteur.
CREATE TABLE randevular (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doktor_id INT NOT NULL,
    patient_id INT NOT NULL,
    randevu_date DATE NOT NULL,      -- Le jour du RDV
    baslangic_saat TIME NOT NULL,    -- L'heure choisie (ex: 09:00)
    bitis_saat TIME NOT NULL,       -- L'heure de fin (ex: 10:00)
    status ENUM('en_attente', 'confirme', 'annule') DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes d'intégrité (Clés étrangères)
    FOREIGN KEY (doktor_id) REFERENCES doktorlar(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES hastalar(id) ON DELETE CASCADE
);
# 04-04-2026
Gestion de la prise de rendez-vous par le patient et afficahge de ces rendevous sur son interface.
-Compter et afficher les rendevous du patient.
-Creer l'interface de visualisation des rendevous chez le medcins.
-Lorsque le client choisir un medecins les jour de la semaines dois s'afficher en fonction du jour choisir les haoraires du docteurs vont s'afficher .
-Lorsqu'une heure est choisir elle reste innaccessible car deux personnes ne peuvent pas etre  consulter par un meme docreur en meme temsps.

# Note
CORS (Cross-Origin Resource Sharing).
Pourquoi as-tu cette erreur ?
Ton frontend tourne sur http://localhost:5173 (Vite) et ton backend sur http://localhost (Apache/WAMP). Pour le navigateur, ce sont deux "origines" différentes à cause des ports (5173 vs 80). Par sécurité, le navigateur bloque la communication sauf si le serveur PHP dit explicitement : "J'autorise le port 5173 à me parler".

# 09-04-2026 
Gestion des boutton pour confrimer le rendevous par le docteur.
lorsque le rendevous est terminer ,la plage de l'heure est liberer.On ne peut pas prendre un rendevous a une heure ne correspondant pas a notre fuseaux horaire.
Gerer les boutton uzatmak qui va juste consuiste a cchanger de plages de temps.


on vas continuer avec le syteme lorsque l'admin clique sur le boutton klinik ver la liste de des clinique dois s'afficher sous forme de popup seul les clinique qui ont la disciplene du docteur doivent s'afficher sue le popup et l'admis dois assigner une clinique ou le doctrue dois aller travailler

# 14-04-2026
Gestion du boutton Fazla Goster pour gerer les cas ou on a plus de 4 rendezvous que ce sooir sur l'interface dokteur ou l'interface patient

---Gestion du boutton "Randevu programımı düzenle"  du home page du docteur.Ajout du bouton "Zaman Araligi" qui permet au medecin pour un jour precis de creer une plage de temps ou les heure sont espace de 1h30 .
--- Gestion de l'onglet hastalar du profil de l'administrateurs avec gestion des boutton de filtages.
# 17-04-2026
Gestion et conception de l'interface statistique qui va permettre a l'administrateur d'avoir un vue d'ensemble sur l'evolution du systeme et de mieux gerer les ressources.
SUM(CASE WHEN  status='Onaylandı'THEN 1 ELSE 0 END):agrégation conditionnelle.
. Le test : CASE WHEN status = 'Onaylandı':C'est une structure de type "Si... Alors...". SQL regarde la colonne status de la ligne actuelle.Si le texte est exactement 'Onaylandı' (Confirmé)...Alors (THEN), il génère le chiffre 1.Sinon (ELSE), il génère le chiffre 0.La fin du test : END
L'addition : SUM(...):QL va additionner tous les 1 et tous les 0 qu'il a générés.Chaque rendez-vous confirmé ajoute +1 au total.

---creation des graphique de visuakisation de l'evolution des rendezvous dans un mois.
//ICD10


# Note
usort : Cette fonction permet de trier un tableau avec une logique personnalisée.
strcmp($a, $b) : C'est la fonction idéale pour comparer des chaînes de caractères représentant des heures (ex: "13:30").
--Gestion de l'interface staistique l'administrateur a la possibilite de voir les patient qui sont en cour ce qui on deja ete consulte et ceux qui sont en cour de consultation.
on vas ajouter l'option qui permet de visualiser les docteur en cour de consultation et les cliniques ou il travailles
### Les ajouts 
--- Gestion de l'interface statistique des docteurs
--- Gestion de l'interface de prise de rendevous ou le patient peut decrire sa maladie et le docteru donne 

# 28 - 04- 2026
Gestion du boutton permettant de visualiser les stats du systemes sur une journee ou sur une periode definir.


















// ── 1. Consultation en cours / suivant / précédent ────────────────────────
$cond = $doctor_id ? "AND r.doktor_id = $doctor_id" : "";
$cons = $conn->query("
    SELECT p.name AS pnom, p.surname AS psur, r.baslangic_saat, r.bitis_saat,
           u.nom AS spec, r.status, d.Name AS dnom
    FROM randevular r
    JOIN hastalar p ON r.patient_id = p.id
    JOIN doktorlar d ON r.doktor_id = d.id
    LEFT JOIN uzmanlik u ON d.specialite_id = u.id
    WHERE DATE(r.randevu_date) = '$today' $cond
    ORDER BY r.baslangic_saat
");
$rdv_today = $cons->fetch_all(MYSQLI_ASSOC);
$en_cours  = null; $suivant = null; $precedent = null;
foreach ($rdv_today as $r) {
    if ($r['status'] === 'en_cours')   $en_cours  = $r;
    if ($r['status'] === 'bekliyor' && !$suivant)  $suivant   = $r;
    if ($r['status'] === 'consulte')   $precedent = $r;
}

// ── 2. Stats patients ─────────────────────────────────────────────────────
$total_p   = $conn->query("SELECT COUNT(*) FROM hastalar")->fetch_row()[0];
$new_month = $conn->query("SELECT COUNT(*) FROM hastalar WHERE DATE_FORMAT(created_at,'%Y-%m')='$month'")->fetch_row()[0];
$consul_d  = $conn->query("SELECT COUNT(*) FROM randevular WHERE DATE(randevu_date)='$today' AND status='consulte' $cond")->fetch_row()[0];

// ── 3. Stats rendez-vous ──────────────────────────────────────────────────
$rdv_d  = $conn->query("SELECT COUNT(*) FROM randevular WHERE DATE(randevu_date)='$today' $cond")->fetch_row()[0];
$rdv_m  = $conn->query("SELECT COUNT(*) FROM randevular WHERE DATE_FORMAT(randevu_date,'%Y-%m')='$month' $cond")->fetch_row()[0];
$rdv_y  = $conn->query("SELECT COUNT(*) FROM randevular WHERE YEAR(randevu_date)='$year' $cond")->fetch_row()[0];

// ── 4. File d'attente ─────────────────────────────────────────────────────
$att = $conn->query("
    SELECT p.name AS nom, p.surname AS sur,
           TIMESTAMPDIFF(MINUTE, r.baslangic_saat, NOW()) AS attente_min
    FROM randevular r
    JOIN hastalar p ON r.patient_id = p.id
    WHERE DATE(r.randevu_date)='$today' AND r.status='bekliyor' $cond
    ORDER BY r.baslangic_saat
");
$attente_list = [];
while ($row = $att->fetch_assoc()) {
    $attente_list[] = [
        "nom"         => $row['nom'].' '.$row['sur'],
        "attente_min" => max(0, (int)$row['attente_min']),
    ];
}

// ── 5. RDV du jour détaillé ───────────────────────────────────────────────
$rdvj = $conn->query("
    SELECT p.name AS pnom, p.surname AS psur,
           d.Name AS dnom, d.Surname AS dsur,
           u.nom AS spec, r.baslangic_saat AS heure, r.status
    FROM randevular r
    JOIN hastalar p   ON r.patient_id      = p.id
    JOIN doktorlar d  ON r.doktor_id     = d.id
    LEFT JOIN uzmanlik u ON d.specialite_id = u.id
    WHERE DATE(r.randevu_date)='$today' $cond
    ORDER BY r.baslangic_saat
    LIMIT 10
");
$rdv_jour = [];
while ($row = $rdvj->fetch_assoc()) {
    $rdv_jour[] = [
        "patient"    => $row['pnom'].' '.$row['psur'],
        "doc_nom"    => $row['dnom'],
        "doc_prenom" => $row['dsur'],
        "specialite" => $row['spec'],
        "heure"      => substr($row['heure'], 0, 5),
        "status"     => $row['status'],
    ];
}

// ── 6. RDV par médecin ce mois ────────────────────────────────────────────
$drdv = $conn->query("
    SELECT d.Name AS nom, d.Surname AS prenom, COUNT(*) AS nb_rdv
    FROM randevular r
    JOIN doktorlar d ON r.doktor_id = d.id
    WHERE DATE_FORMAT(r.randevu_date,'%Y-%m')='$month'
    GROUP BY d.id ORDER BY nb_rdv DESC LIMIT 5
");
$doctors_rdv = $drdv->fetch_all(MYSQLI_ASSOC);

// ── 7. Statuts (%) ────────────────────────────────────────────────────────
$total_rdv = max(1, (int)$rdv_m);
$con_pct   = round($conn->query("SELECT COUNT(*) FROM randevular WHERE DATE_FORMAT(randevu_date,'%Y-%m')='$month' AND status='consulte' $cond")->fetch_row()[0] / $total_rdv * 100);
$bek_pct   = round($conn->query("SELECT COUNT(*) FROM randevular WHERE DATE_FORMAT(randevu_date,'%Y-%m')='$month' AND status='bekliyor' $cond")->fetch_row()[0] / $total_rdv * 100);
$ipt_pct   = 100 - $con_pct - $bek_pct;

// ── 8. Liste médecins (filtre select) ─────────────────────────────────────
$dl = $conn->query("SELECT id, Name AS nom, Surname AS prenom FROM doktorlar ORDER BY Name");
$doctors_list = $dl->fetch_all(MYSQLI_ASSOC);

// ── 9. Cliniques actives ──────────────────────────────────────────────────
$clin_count = $conn->query("SELECT COUNT(*) FROM klinik")->fetch_row()[0];

// ── 10. Alertes système ───────────────────────────────────────────────────
$alertes = [
    ["type" => "success", "message" => "Nouveau patient inscrit", "ago" => "Il y a 5 min"],
    ["type" => "warning", "message" => "RDV annulé — vérifiez la file", "ago" => "Il y a 22 min"],
    ["type" => "info",    "message" => "Disponibilités mises à jour", "ago" => "Il y a 1h"],
];

echo json_encode([
    "consultation" => [
        "en_cours"       => $en_cours  ? $en_cours['pnom'].' '.$en_cours['psur']   : null,
        "suivant"        => $suivant   ? $suivant['pnom'].' '.$suivant['psur']     : null,
        "precedent"      => $precedent ? $precedent['pnom'].' '.$precedent['psur'] : null,
        "specialite"     => $en_cours['spec']        ?? null,
        "heure_debut"    => $en_cours  ? substr($en_cours['baslangic_saat'],0,5)   : null,
        "heure_suivant"  => $suivant   ? substr($suivant['baslangic_saat'],0,5)    : null,
        "heure_precedent"=> $precedent ? substr($precedent['bitis_saat'],0,5)      : null,
        "attente_min"    => 12,
    ],
    "patients"          => ["total"=>$total_p,"nouveaux_mois"=>$new_month,"consultes_auj"=>$consul_d],
    "rdv"               => ["aujourd_hui"=>$rdv_d,"ce_mois"=>$rdv_m,"cette_annee"=>$rdv_y],
    "attente"           => ["nombre"=>count($attente_list),"liste"=>$attente_list],
    "rdv_jour"          => $rdv_jour,
    "doctors_rdv"       => $doctors_rdv,
    "doctors_list"      => $doctors_list,
    "statuts"           => ["consulte_pct"=>$con_pct,"bekliyor_pct"=>$bek_pct,"iptal_pct"=>$ipt_pct],
    "cliniques_actives" => (int)$clin_count,
    "alertes"           => $alertes,
]);
$conn->close();




















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


fetch("http://localhost/bilisim1/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(res => res.text())
      .then(data => {
        console.log(data);
      });






import React from 'react';
import  style from './klinik.module.css'

// Ce composant reçoit un objet "clinic" via les PROPS
function ClinicCard({ clinic }) {
  return (
    <div className={style.clinic_card}>
      <div className={style.clinic_image}>🏥</div>
      <div className={style.clinic_info}>
        <h3 className={style.clinic_name}>{clinic.name}</h3>
        <span className={style.clinic_city}>📍 {clinic.city}</span>
        <p className={style.clinic_description}>{clinic.description}</p>
        <span className={style.clinic_horaire}><i className="fa-solid fa-clock"></i> {clinic.horaire}</span>
        <button className={style.clinic_btn}>Voir les branches</button>
      </div>
    </div>
  );
}

export default ClinicCard;



import React, { useState } from 'react';
import ClinicCard from './ClinicCard';
import  style from './klinik.module.css'

function KlinikList() {
  // Simulation de données qui viendront plus tard de ta base de données PHP
  const [clinics] = useState([
    {
      id: 1,
      name: "Hôpital Central d'Istanbul",
      city: "Istanbul",
      description: "L'un des plus grands centres hospitaliers du pays, spécialisé dans toutes les branches médicales.",
      horaire:"ouvert de Lun-sam 08h-18h30"
    },
    {
      id: 2,
      name: "Clinique Santé Ankara",
      city: "Ankara",
      description: "Une clinique moderne axée sur la pédiatrie et la cardiologie avec des technologies de pointe.",
      horaire:"ouvert de Lun-sam 08h-18h30"
    },
    {
      id: 3,
      name: "Hôpital Médical Izmir",
      city: "Izmir",
      description: "Expertise reconnue en chirurgie générale et soins intensifs depuis plus de 20 ans.",
      horaire:"ouvert de Lun-sam 08h-18h30"
    }
  ]);

  return (
    <div className={style.clinic_explorer}>
      <header className={style.explorer_header}>
        <h2>Découvrez nos Cliniques</h2>
        <p>Sélectionnez un établissement pour voir les disponibilités.</p>
      </header>

      {/* C'est ici que la magie du Mapping opère */}
      <div className={style.clinic_grid}>
        {clinics.map((item) => (
          /* On passe l'objet 'item' à notre composant ClinicCard */
          /* 'key' est obligatoire pour que React sache quel élément modifier si besoin */
          <ClinicCard key={item.id} clinic={item} />
        ))}
      </div>
    </div>
  );
}

export default KlinikList;





.clinic_explorer {
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
}

.explorer_header {
    margin-bottom: 40px;
    text-align: center;
}

.explorer_header h2 {
    color: #2c3e50;
    font-size: 2rem;
}

/* Grille de Cliniques */
.clinic_grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
}

/* Carte Individuelle */
.clinic_card {
    background: white;
    border-radius: 12px;
    overflow: hidden; /* Pour que l'image ne dépasse pas des bords arrondis */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    border: 1px solid #edf2f7;
}

.clinic_card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
}

.clinic_image{
    background-color: #ebf4ff;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4rem;
}

.clinic_info {
    padding: 20px;
    flex-grow: 1; /* Pour que les boutons soient tous alignés en bas */
    display: flex;
    flex-direction: column;
}

.clinic_name {
    margin: 0 0 10px 0;
    color: #0056b3;
    font-size: 1.25rem;
}

.clinic_city,.clinic_horaire {
    color: #718096;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 12px;
}

.clinic_description {
    color: #4a5568;
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 20px;
}

.clinic_btn {
    margin-top: auto; /* Aligne le bouton en bas */
    padding: 12px;
    background-color: #0056b3;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s;
}

.clinic_btn:hover {
    background-color: #004494;
}



    useEffect(() => {
        const fetchUzmanlik = async () => {
        try {
            // IMPORTANT : On envoie l'ID de l'hôpital au PHP
            const response = await axios.post('http://localhost/BilisimTekno/uzmanlik.php');
            
            // On vérifie que les données existent avant de les stocker
            if (response.data && response.data.data) {
            setUzmanlik(response.data.data);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des spécialités:", error);
        } finally {
            setLoading(false);
        }
        };

        if (klinik?.id) {
        fetchUzmanlik();
        }
    }, []); // On relance si l'ID de l'hôpital change





    useEffect(() => {
        const uzmanliksec=async(e)=>{
            const response =await axios.post('http://localhost/BilisimTekno/uzmanlik.php',uzmanlik)
            console.log(response.data)               //for debugging
            setUzmanlik(response.data.data)
        }
        uzmanliksec();

    }, []);

        <Link to="/klinikadmin" className={`${style.link} ${isActive('/klinikadmin') ? style.linkActive : ''}`}>Klinikler</Link>























import { useState, useMemo,useEffect } from 'react';
import style from './uzmanlikelement.module.css';
import axios from 'axios';

// ─────creation du cardre qui va contenir des uzmanlik
function SpecialiteCard({ spec }) {
    const [clinics,setClinics]=useState(['Medicana Rize', 'Kuzey Sağlık']);
    const [doctors,setDoctors]=useState(['Dr. Tarık Doğan', 'Dr. Sibel Aydın', 'Dr. Cem Başar']);
  return (
    <div className={style.card}>
      {/* Header */}
      <div className={style.cardHeader}>
        <span className={style.icon}>{spec.icon}</span>
        <span className={style.specName}>{spec.nom}</span>
      </div>

      {/* Body */}
      <div className={style.cardBody}>
        {/* Cliniques */}
        <p className={style.sectionLabel}>Klinikler</p>
        <ul className={style.clinicList}>
          {clinics.map((c) => (
            <li key={c} className={style.clinicItem}>
              <span className={style.clinicDot} />
              {c}
            </li>
          ))}
        </ul>

        {/* Médecins */}
        <p className={style.sectionLabel}>Doktorlar</p>
        <div className={style.doctorPills}>
          {doctors.map((d) => (
            <span key={d} className={style.pill}>{d}</span>
          ))}
        </div>
      </div>

      {/* Footer — statistiques */}
      <div className={style.cardFooter}>
        <div className={style.stat}>
          <span className={style.statNum}>{clinics.length}</span>
          <span className={style.statLabel}>klinik</span>
        </div>
        <div className={style.stat}>
          <span className={style.statNum}>{doctors.length}</span>
          <span className={style.statLabel}>doktor</span>
        </div>
      </div>
    </div>
  );
}

function UzmanlikElement() {
    const [specialites, setSpecialites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost/BilisimTekno/uzmanliklist.php');
            setSpecialites(response.data.data);
            console.log(response.data)
        } catch (error) {
            console.error("Yükleme hatası:", error);
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, []);
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      specialites.filter((s) =>
        s.nom.toLowerCase().includes(query.toLowerCase())
      ),
    [query,specialites]
  );
  if (loading) return <div className={style.loader}>Uzmanlik yükleniyor......</div>;
  return (
    <div className={style.page}>
        <p className={style.presentation}>Randevu sistemimizde bulduğumuz farklı uzmanlık alanları</p>
      {/* Barre de recherche */}
      <input
        type="text"
        className={style.search}
        placeholder="Uzmanlık ara..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Grille de cartes */}
      {filtered.length === 0 ? (
        <p className={style.empty}>Sonuç bulunamadı.</p>
      ) : (
        <div className={style.grid}>
          {filtered.map((s) => (
            <SpecialiteCard key={s.id} spec={s} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UzmanlikElement;





<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    // Gérer la requête preflight
    if($_SERVER['REQUEST_METHOD'] !== 'POST'){
        echo json_encode([
            "success"=>false,
            "message"=>"Méthode non autorisée"
        ]);
        exit();
    }

    // Connexion à la base de données
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "hastane";

    $conn = new mysqli($servername, $username, $password, $dbname);
    // Vérifier la connexion
    if ($conn->connect_error) {
        echo json_encode([
            "success" => false, 
            "message" => "Erreur de connexion: " . $conn->connect_error
        ]);
        exit();
    }


    // 1. On récupère l'ID envoyé par React via $_GET['id']
    // On utilise intval() pour être sûr que c'est un nombre (sécurité)
    $id_recu = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    $query = $conn->prepare("SELECT u.id,u.nom,u.icon 
    FROM uzmanlik u
    INNER JOIN klinik_uzmanlik ku ON u.id = ku.uzmanlik_id
    WHERE ku.klinik_id =?");
    $query->bind_param("i", $id_recu);
    $query->execute();
    $result = $query->get_result();

    $uzmanlik = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $uzmanlik[] = $row;
        }
    }
    echo json_encode([
        "success" => true,
        "data" => $uzmanlik
    ]);

    $conn->close();

?>




























import React from 'react';
import style from './navbar.module.css';

const NavbarDoktor = ({ onLogout }) => {
  return (
    <nav className={style.navbar}>
      <div className={style.navbar_container}>
        {/* Logo / Nom de l'application */}
        <div className={style.navbar_logo}>
          <a href="/">Hastane<span>Panel</span></a>
        </div>

        {/* Liens de navigation principaux */}
        <ul className={style.navbar_menu}>
          <li>
            <a href="/home" className={style.nav_link}>Home</a>
          </li>
          <li>
            <a href="/today" className={style.nav_link}>Rendez-vous d'aujourd'hui</a>
          </li>
          <li>
            <a href="/history" className={style.nav_link}>Rendez-vous passés</a>
          </li>
        </ul>

        {/* Zone utilisateur (Profil & Déconnexion) */}
        <div className={style.navbar_user_actions}>
          <a href="/profile" className={style.profile_btn}>Mon Profil</a>
          <button onClick={onLogout} className={style.logout_btn}>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDoktor;





/* Configuration de base */
.navbar {
    background-color: #ffffff;
    height: 70px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 0 2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.navbar_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}

/* Style du Logo */
.navbar_logo a {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
}

.navbar_logo span {
    color: #3498db; /* Couleur d'accentuation */
}

/* Menu de navigation */
.navbar_menu {
    display: flex;
    list-style: none;
    gap: 20px;
    margin: 0;
    padding: 0;
}

.nav_link {
    text-decoration: none;
    color: #555;
    font-weight: 500;
    transition: color 0.3s ease;
    padding: 8px 12px;
    border-radius: 4px;
}

.nav_link:hover {
    color: #3498db;
    background-color: #f0f7ff;
}

/* Actions utilisateur */
.navbar_user_actions {
    display: flex;
    align-items: center;
    gap: 15px;
}

.profile_btn {
    text-decoration: none;
    color: #2c3e50;
    font-weight: 600;
    font-size: 0.9rem;
}

.logout_btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s ease;
}

.logout_btn:hover {
    background-color: #c0392b;
}

/* Responsive : simple ajustement pour mobile */
@media (max-width: 768px) {
    .navbar_menu {
        display: none; /* À remplacer par un menu burger plus tard */
    }
}






