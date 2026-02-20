import { useState } from "react"
import  style from "./taskinput.module.css"

export const TaskInput=({addTask,clearListe})=>{
    const[tasktitle,setTaskTitle]=useState("")
    const handlerInputChange=(e)=>{
        setTaskTitle(e.target.value)
    }
    const handlerAddTask=(e)=>{
        e.preventDefault()
        if (tasktitle.trim()) {
            addTask(tasktitle)
            setTaskTitle(" ")
        }
        else{
            alert("Vouz devez entrer une tache a enreigistrez")
        }
    }
    return(
        <div className={`box ${style.element}`}>
            <h2 className={style.title}>🎯 Ajoute ta prochaine tache</h2>
            <form action="" className={style.container} onSubmit={handlerAddTask}>
                <input type="text" className={style.input}
                    placeholder="Indiquez un titre de tache explicite " 
                    onChange={handlerInputChange}
                    value={tasktitle}
                />
                <button className="button-primary" type="submit">
                    Ajouter
                </button>
                <button className="button-primary" type="button" onClick={clearListe}>
                    Videz
                </button>
            </form>
          
        </div>
    )
}