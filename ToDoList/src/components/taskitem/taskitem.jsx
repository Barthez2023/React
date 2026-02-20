//uitliser pour afficher un module dans l'appli
import formatDate from "../../utilitaire"
import style from "./taskitem.module.css"
export const TaskItem=({task,editTask,deleteTask})=>{
   return(
        <div>
            <li className={`${style.container} ${task.completed ? style.success : style.default}`}
                onClick={()=>editTask(task.id,!task.completed)}
            >
                <div className={style.item}>
                    <div className={`${style.id} ${task.completed ? style.idsuccess : style.iddefault}`}>
                        {task.id}
                    </div>
                    <div className={style.contentBlock}>
                        <div className={task.completed ? style.contentsuccess : style.contentdefault}>
                            {task.title}
                        </div>
                        <div className={style.date}>{formatDate(task.date)}</div>
                    </div>
                </div>
                <button className="button-primary"
                        onClick={(e)=>{
                            e.stopPropagation()
                            deleteTask(task.id)
                        }
                        }>
                   <i className={task.completed ? `${"fa-solid fa-trash-can "} ${style.corbeille}`:"fa-solid fa-trash-can "}></i>

                </button>
            </li>
        </div>
   )
}