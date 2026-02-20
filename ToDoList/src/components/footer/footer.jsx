import style from "./footer.module.css"
export const Footer=({completedTasks})=>{
    if (completedTasks) {
        return (
            <footer>
                <code className={style.footer}>
                    Avec To Do List tu as eleimine {completedTasks} tache{completedTasks> 1 ? "s":""} du jour
                </code>
            </footer>
        )
    }
    return null
    
}