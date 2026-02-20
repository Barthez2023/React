//utilise pour affiche la liste des taches
import { TaskItem } from '../taskitem/taskitem'
import style from './tasklist.module.css'
export const TaskList=(
    {taskList,
    editTask,
    deleteTask,
    incompletedTask}
)=>{
    const taskListe=taskList.map((task)=>(
        <TaskItem key={task.id} task={task} editTask={editTask} deleteTask={deleteTask}/>
    ))

if (taskList && taskList.length>0) {
    return(
        <div className="box">
            {incompletedTask>0 && (
                 <h2 className={style.title}>💡 Il te reste <span className='important'>{incompletedTask}</span> tache a accomplir!</h2>
            )}
             {incompletedTask===0 && (
                 <h2 className={style.title}>👌 Bravo tu as accomplir toutes tes taches !!!</h2>
            )}
            {taskList && taskList.length >0 && (
                <ul className={style.container}>
                    {taskListe}

                </ul>
            )} 
        </div>
    )
}
return(
    <div className="box">
        <h2 className={style.title}>
            👋 Salut ,tu n'as rien a faire! Profite de ton temps libre pour planifier tes taches
        </h2>
    </div>
)


}