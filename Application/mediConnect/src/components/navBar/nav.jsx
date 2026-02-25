import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
function Nav() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
    {/* --- BARRE DE NAVIGATION --- */}
    <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Accueil</Link>    { /*permet de diriger vers une autre page comme le fait la balise <a> a l'oppose de <a> link ne refresh pas la page */}
        <Link to="/docteurs" style={linkStyle}>Nos Médecins</Link>
        <Link to="/reservation" style={linkStyle}>Prendre RDV</Link>
    </nav>
    </div>
  );
}

// Styles de base
const navStyle = { backgroundColor: '#2c3e50', padding: '15px', display: 'flex', gap: '20px', marginBottom:'50px' };
const linkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' };

export default Nav;