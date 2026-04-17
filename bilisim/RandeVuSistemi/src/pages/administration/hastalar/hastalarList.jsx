import React, { useState, useEffect,useMemo,useNavigate} from 'react';
import axios from 'axios';
import style from './hastalarList.module.css';
import NavbarAmin from '../navBarAdmin';

const Hastalar = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [cities, setCities] = useState([]); // On stocke toute la liste des villes
    //pour filtrer les patient selon le sexe et ou le nom et la ville
    const [genre, setGenre] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. On récupère les deux sources de données en parallèle pour gagner du temps
                const [resPatients, resCities] = await Promise.all([
                    axios.get("http://localhost/BilisimTekno/getAllPatients.php"),
                    fetch("https://beterali.com/api/v1/cities").then(res => res.json())
                ]);
                // 2. Mise à jour des patients
                if (resPatients.data.success) {
                    setPatients(resPatients.data.data);
                }
                // 3. Mise à jour des villes
                setCities(resCities.data.cities);
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

   // Fonction utilitaire pour trouver le nom de la ville par son code
    const getCityName = (cityCode) => {
        // On s'assure que cityCode est comparé au même format (string ou nombre)
        const cityObj = cities.find(c => String(c.city_code) === String(cityCode));
        return cityObj ? cityObj.city_name : "Chargement..."; 
    };

    const filteredPatients = useMemo(() => {
        return patients.filter((p) => {
            // 1. Recherche textuelle (Nom + Prénom + Ville)
            const fullName = `${p.ad} ${p.soyad} ${p.sehir}`.toLowerCase();
            const matchQuery = fullName.includes(searchTerm.toLowerCase());

            // 2. Filtre par Genre (Cinsiyet)
            // Si 'genre' est vide (Tüm cinsiyetler), on laisse tout passer
            const matchGenre = !genre || p.cinsiyet === genre;

            return matchQuery && matchGenre;
        });
    }, [patients, searchTerm, genre]);

    return (
        <div className={style.adminContainer}>
            <NavbarAmin/>
            <header className={style.pageHeader}>
                <div className={style.headerLeft}>
                    <h1><i className="fa-solid fa-users-medical"></i> Hasta Yönetimi</h1>
                    <p>Sistemde kayıtlı tüm hastaları görüntüleyin ve yönetin.</p>
                </div>
                <div className={style.statsBadge}>
                    <span>Total: <strong>{patients.length}</strong> Hasta</span>
                </div>
            </header>

            <div className={style.actionToolbar}>
                {/* Barre de recherche */}
                <div className={style.searchWrapper}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input 
                        type="text" 
                        placeholder="Hasta adı, soyadı veya şehir ara..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Sélecteur de Sexe */}
                <div className={style.filterWrapper}>
                    <select
                        className={style.genderFilter}
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    >
                        <option value="">Tüm Cinsiyetler (Hepsi)</option>
                        <option value="erkek">Erkek ♂</option>
                        <option value="kadin">Kadın ♀</option>
                    </select>
                    <span className={style.countBadge}>{filteredPatients.length} Hasta bulundu</span>
                </div>
            </div>
            <div className={style.tableWrapper}>
                {loading ? (
                    <div className={style.loader}>Yükleniyor...</div>
                ) : (
                    <table className={style.patientTable}>
                        <thead>
                            <tr>
                                <th>Ad & Soyad</th>
                                <th>Şehir</th>
                                <th>Telefon</th>
                                <th>Cinsiyet</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id}>
                                    <td className={style.patientName}>
                                        <div className={style.avatar}>
                                            {patient?.ad.charAt(0)}{patient?.soyad.charAt(0)}
                                        </div>
                                        {patient.ad} {patient.soyad}
                                    </td>
                                    <td>{getCityName(patient.sehir)}</td>
                                    <td>{patient.telefon}</td>
                                    <td>
                                        <span className={`${style.genderBadge} ${patient.cinsiyet === 'erkek' ? style.male : style.female}`}>
                                            {patient.cinsiyet}
                                        </span>
                                    </td>
                                    <td className={style.actions}>
                                        <button title="Düzenle"><i className="fa-solid fa-pen-to-square"></i></button>
                                        <button title="Sil" className={style.deleteIcon}><i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Hastalar;