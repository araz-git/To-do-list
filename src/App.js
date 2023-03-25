import './App.css';
import { useState, useEffect } from 'react';
import Plus from './UI/Plus';
import Trash from './UI/Trash';
import Edit from './UI/Edit';
import Tick from './UI/Tick';
import Cancel from './UI/Cancel';
import Input from './UI/Input';

function App() {

  //Loads tasks from local storage
  const [boards, setBoards] = useState(JSON.parse(localStorage.getItem('boards')) || [
    {title: 'To Do', tasks: []}, {title: 'In Progress', tasks: []}, {title: 'Done', tasks: []}]
  )
  const [newTaskBody, setNewTaskBody] = useState(null)
  let newTasks = [...boards]

  const [currentTask, setCurrentTask] = useState(null)
  
  const [deleteIndex, setDeleteIndex] = useState(null)
  const [insertIndex, setInsertIndex] = useState(null)

  const [endBoard , setEndBoard] = useState(null)
  const [emptyBoard, setEmptyBoard] = useState(null)


  //Saves tasks to local storage
  useEffect(() => localStorage.setItem('boards', JSON.stringify(boards)), [boards])
  
  //Adds a task on plus click
  function addTask(board) {
    newTasks[newTasks.indexOf(board)].tasks.push({id: Math.round(Math.random()*10000), body: 'New task'})
    setBoards(newTasks)
  }

  //Deletes a task from a list on trash click
  function removeTask(e, board, task) {
    e.stopPropagation()
    const boardIndex = newTasks.indexOf(board)
    const taskIndex = newTasks[boardIndex].tasks.indexOf(task)
    newTasks[boardIndex].tasks.splice(taskIndex, 1)
    setBoards(newTasks)
  }

  //Task enters editing mode on edit click
  function editTaskName(e, board, task) {
    e.stopPropagation()
    const boardIndex = newTasks.indexOf(board)
    const taskIndex = newTasks[boardIndex].tasks.indexOf(task)
    newTasks.map(item => item.tasks.map(innerItem => innerItem.edit = false))
    newTasks[boardIndex].tasks[taskIndex].edit = true
    setBoards(newTasks)
    setNewTaskBody(task.body)
  }

  //Task name changes are saved on tick click
  function saveTaskName(e, board, task) {
    e.stopPropagation()
    const boardIndex = newTasks.indexOf(board)
    const taskIndex = newTasks[boardIndex].tasks.indexOf(task)
    newTasks[boardIndex].tasks[taskIndex].edit = false
    if (newTaskBody) {
      newTasks[boardIndex].tasks[taskIndex].body = newTaskBody
    }
    setBoards(newTasks)
    setNewTaskBody(null)  
  }

  //Activartes saveTaskName (Enter) and cancelChangeTaskName(Escape) on key presses
  function saveTaskNameEnter(e, board, task) {
    if (e.key === 'Enter') {
      saveTaskName(e, board, task)
    }
    if (e.key === 'Escape') {
      cancelChangeTaskName(e, board, task)
    }
  }
  
  //Task name changes in input and can be saved in another function
  function changeTaskName(e) {
    const {value} = e.target
    setNewTaskBody(value)
  }


  function cancelChangeTaskName(e, board, task) {
    e.stopPropagation()
    const boardIndex = newTasks.indexOf(board)
    const taskIndex = newTasks[boardIndex].tasks.indexOf(task)
    newTasks[boardIndex].tasks[taskIndex].edit = false
    setBoards(newTasks)
    setNewTaskBody(null)  
  }

  function cancelAll(e) {
    const {id} = e.target
    if (id === 'App') {
      newTasks.map(item => item.tasks.map(innerItem => innerItem.edit = false))
      setBoards(newTasks)
    }
  }

  function handleDragStart(e, board, task) {    
    const boardIndex = newTasks.indexOf(board)
    const taskIndex = newTasks[boardIndex].tasks.indexOf(task)
    cancelChangeTaskName(e, board, task)
    setDeleteIndex(taskIndex)
    setCurrentTask(task)
  }

  function handleDragOver(e, board, task) {
    const {style} = e.target
    const boardIndex = newTasks.indexOf(board)
    const taskIndex = newTasks[boardIndex].tasks.indexOf(task)
    setInsertIndex(taskIndex)
    setEndBoard(board)

    if (deleteIndex < insertIndex) {
      style.borderBottom = '1px solid black'
    } 
    else{
      style.borderTop = '1px solid black'
    }
  }

  function handleDragLeave(e) {
    const {style} = e.target;
    style.border=""
    style.margin=''
  }

  function overEmptyBoard(board){
    const boardIndex = newTasks.indexOf(board)
    
    newTasks[boardIndex].tasks[0] 
    ? setEmptyBoard(null)
    : setEmptyBoard(board)
  }

  
  function handleDragEnd(board) {
    const boardIndex = newTasks.indexOf(board)
    const emptyBoardIndex = newTasks.indexOf(emptyBoard)
    const endBoardIndex = newTasks.indexOf(endBoard)
    newTasks[boardIndex].tasks.splice(deleteIndex, 1)
    !emptyBoard && newTasks[endBoardIndex].tasks.splice(insertIndex, 0, currentTask);
    emptyBoard && newTasks[emptyBoardIndex].tasks.push(currentTask);
    setBoards(newTasks)
  }
  

  return (
    <div
      id='App'
      className='flex wrap center-hor'
      onClick={(e) => cancelAll(e)}
    >
      {boards.map(board => {
        return (
          <div
            key={board.title} 
            className='board'
            id={board.title}
            onDragOver={() => overEmptyBoard(board)}
          >
            <h2>{board.title}</h2>
            <Plus handleClick={() => addTask(board)}/>
            <div className='all-tasks'>
            {board.tasks.map( task => {
              return (
              <div 
                key={task.id}
                className='task flex no-wrap center-ver'
                draggable
                onDragStart={(e) => handleDragStart(e, board, task)}
                onDragOver={(e) => handleDragOver(e, board, task)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDragEnd={(e) => handleDragEnd(board)}
              >
                {task.edit && 
                  <Input 
                    placeholder=' '
                    onChange={(e) => changeTaskName(e)}
                    onKeyDown={(e) => saveTaskNameEnter(e, board, task)}
                    value={newTaskBody}
                    autoFocus 
                  />}
                {!task.edit && <span className='task-body' onClick={(e) => editTaskName(e, board, task)}>{task.body}</span>}
                <div className='actions'>
                  {task.edit && <Cancel handleClick={(e) => cancelChangeTaskName(e, board, task)}/>}
                  {task.edit && <Tick handleClick={(e) => saveTaskName(e, board, task)}/>}
                  {!task.edit && <Trash handleClick={(e) => removeTask(e, board, task)}/>}
                  {!task.edit && <Edit handleClick={(e) => editTaskName(e, board, task)}/>}
                </div>
              </div>)
            })}
            </div>
          </div>)
        })}
    </div>
  );
}

export default App;
