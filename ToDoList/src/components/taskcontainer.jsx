import { useState ,useEffect} from "react"
import { Footer } from "./footer/footer"
import { Header } from "./header/header"
import { TaskInput } from "./taskinput/taskinput"
import { TaskList } from "./tasklist/tasklist"

export const TaskContainer=()=>{
    
    const[taskList,setTaskList]=useState([])
    useEffect(()=>{
        const storedTasks=localStorage.getItem("taskList")      //recupere les infos stocke sur le localstored
        console.log(storedTasks)                                    //utilile pour debuger
        if (storedTasks) {
            setTaskList(JSON.parse(storedTasks))
        }
    },[])
    console.log(taskList)                           //utilile pour debuger

    //cette methode permet de sauvegarder dans le local storage
    const saveTasksToLocalStorage=(tasks)=>{
        localStorage.setItem("taskList",JSON.stringify(tasks))

    }
    //cette methode permet de vider la liste du localStorage
    const clearListe=()=>{
        const storedTasks=localStorage.getItem("taskList")  //recupere les infos stocke sur le localstored
        if (storedTasks) {
            localStorage.removeItem("taskList")
            setTaskList([])
        }
    }


    const addTask=(title)=>{
        const newTask={
            id:taskList.length?taskList[taskList.length-1].id+1:1,
            title:title,
            completed:false,
            date:new Date().toISOString()
        }
        const updateTask=[...taskList,newTask]
        setTaskList(updateTask)
        saveTasksToLocalStorage(updateTask)  //on sauvegarde dans le localStorage la valeur du taskList update
    }
    const editTask=(id,completedValue)=>{
        const updateTask=taskList.map((task)=>
                task.id===id?{...task,completed:completedValue} : task
            )
        setTaskList(updateTask)
        saveTasksToLocalStorage(updateTask)  //on sauvegarde dans le localStorage la valeur du taskList update avec les taches accomplir
    }

    const deleteTask=(id)=>{
        const updateTasks=taskList.filter((task)=>
                task.id!==id
            )
        setTaskList(updateTasks)
        saveTasksToLocalStorage(updateTasks) //on sauvegarde dans le localStorage la valeur du taskList update avec les taches supprimer
    }

    const getTaskCount=()=>{
        const completedTasks=taskList.filter((task)=>task.completed).length
        const incompletedTask=taskList.length-completedTasks
        return{
            completedTasks,
            incompletedTask
            
        }
    }

    const {completedTasks,incompletedTask}=getTaskCount()
    console.log(completedTasks,incompletedTask)


    return(
        <main>
            <Header/>
            <TaskInput addTask={addTask} clearListe={clearListe}/>
            <TaskList taskList={taskList} 
            editTask={editTask} 
            deleteTask={deleteTask}
            incompletedTask={incompletedTask}/>
            <Footer completedTasks={completedTasks}/>
        </main>
    )
}
