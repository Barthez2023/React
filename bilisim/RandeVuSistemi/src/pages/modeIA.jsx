import React, { useState, useRef } from 'react';
import style from './modeIA.module.css';
import OpenAI from "openai";

function ModeIAPopup({ isOpen, onClose, onSend }) {
    const [text, setText] = useState("");
    const [response, setResponse] = useState(""); // Pour stocker la réponse de l'IA
    const [isAnalyzing, setIsAnalyzing] = useState(false); // État de chargement
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

    //ici on va utiliser open IA pour integrer chat GPT a notre systeme directement intereagissable avec le medecin
    const openai = new OpenAI({
        apiKey:API_KEY,
        dangerouslyAllowBrowser: true // Uniquement pour les tests en local (React)
    });
    async function analyzeComment() {
        if (!text.trim()) return;
        
        setIsAnalyzing(true);
        setResponse(""); // On vide la réponse précédente

        try {
            const aiResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ 
                    role: "system", 
                    content: "Tu es un assistant médical expert. Analyse les commentaires de manière structurée,les symptomes et fournir un bilan clair" 
                }, { 
                    role: "user", 
                    content: `Analyse ce commentaire du patient et ces symtomes et fournir un rapport medical : ${text}` 
                }],
            });

            setResponse(aiResponse.choices[0].message.content);
            setText("");
            setSelectedFile(null);
        } catch (error) {
            console.error("Erreur OpenAI :", error);
            setResponse("Özür dileriz, analiz sırasında bir hata oluştu.");
        } finally {
            setIsAnalyzing(false);
        }
    }
    


    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const analyzeComment1 = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setResponse("ANALİZ SONUCU (Simülasyon): Hasta yorumu olumlu bulundu. Belirtilen semptomlar poliklinik takibi gerektiriyor.");
            setIsAnalyzing(false);
        }, 2000);
        setText("");
        setSelectedFile(null);
    };


    return (
        <div className={style.overlay} onClick={onClose}>
            <div className={style.popup} onClick={(e) => e.stopPropagation()}>
                <header className={style.header}>
                    <h3><i className="fa-solid fa-microscope"></i> Yapay Zeka Desteği</h3>
                    <button className={style.closeBtn} onClick={onClose}>&times;</button>
                </header>

                <div className={style.body}>
                    <textarea
                        className={style.textarea}
                        placeholder="Bugün size nasıl yardımcı olabilirim?..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isAnalyzing}
                    />
                    {selectedFile && (
                        <div className={style.filePreview}>
                            <i className="fa-solid fa-file-pdf"></i>
                            <span>{selectedFile.name}</span>
                            <button onClick={() => setSelectedFile(null)}>&times;</button>
                        </div>
                    )}
                </div>

                <footer className={style.footer}>
                    <div className={style.actionsLeft}>
                        <button 
                            className={style.iconBtn} 
                            onClick={() => fileInputRef.current.click()}
                            title="Add document"
                        >
                            <i className="fa-solid fa-paperclip"></i>
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.txt"
                        />
                    </div>

                    <button 
                        className={style.sendBtn} 
                        onClick={analyzeComment1}
                        disabled={!text.trim() && !selectedFile}
                    >
                        <span>Analiz </span>
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </footer>
                {/* Zone d'affichage du résultat */}
                {(response || isAnalyzing) && (
                    <div className={style.aiResponseArea}>
                        <strong><i className="fa-solid fa-comment-medical"></i> Analiz Sonucu:</strong>
                        <p className={style.responseText}>
                            {isAnalyzing ? "Analiz ediliyor, lütfen bekleyin..." : response}
                        </p>
                    </div>
                )}
        </div>
        </div>
    );
}

export default ModeIAPopup;