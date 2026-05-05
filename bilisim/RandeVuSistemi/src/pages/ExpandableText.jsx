import React, { useState } from 'react';
const ExpandableText = ({ text, maxWords = 200 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    if (!text) return <span>-</span>;

    // Découpage du texte par les espaces pour compter les mots
    const words = text.trim().split(/\s+/);
    // Si le texte est plus court que la limite, on l'affiche en entier
    if (words.length <= maxWords) {
        return <span>{text}</span>;
    }

    // Troncature du texte au nombre de mots max
    const truncatedText = words.slice(0, maxWords).join(' ') + '...';
    return (
        <span>
            {isExpanded ? text : truncatedText}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb', /* Bleu médical */
                    cursor: 'pointer',
                    padding: 0,
                    marginLeft: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    textDecoration: 'underline'
                }}
            >
                {isExpanded ? 'azaltmak' : 'devamını oku'}
            </button>
        </span>
    );
};
export default ExpandableText;