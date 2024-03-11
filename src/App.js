import React, { useState, useEffect } from 'react';
import './App.css'; // Import CSS file
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa';

function TodoApp() {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Retrieve todos from local storage when component mounts
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodos);
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = () => {
    const todoText = inputValue.replace(/\d+/g, '').trim(); // Extract text from input
    const count = parseInt(inputValue.match(/\d+/) || '1'); // Extract count from input
    const newTodos = [...todos];
    let previousCount = 0;

    if (newTodos.length > 0) {
      previousCount = newTodos[newTodos.length - 1].count || 0;
    }

    if (count === 1) {
      // Add individual todo items with individual count
      newTodos.push({ text: todoText, completed: false, count: previousCount + 1, editedCount: 0 });
    } else {
      // Add bulk todo items with shared count
      for (let i = 0; i < count; i++) {
        newTodos.push({ text: todoText, completed: false, count: previousCount + 1, editedCount: 0 });
      }
    }

    setTodos(newTodos);
    setInputValue('');
  };

  const handleDeleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const handleEditStart = (index) => {
    const newTodos = [...todos];
    newTodos[index].editing = true;
    newTodos[index].editText = newTodos[index].text; // Store the current text for editing
    setTodos(newTodos);
  };



  const handleEditSubmit = (index, newText) => {
    const newTodos = [...todos];
    newTodos[index].text = newText.trim(); // Trim the text
    newTodos[index].editing = false;
    newTodos[index].editedCount++; // Increment edited count
    setTodos(newTodos);
  };

  const handleKeyDown = (event, index, newText) => {
    if (event.key === 'Enter') {
      handleEditSubmit(index, newText);
    }
  };

  const handleSaveToLocalStorage = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  return (
    <div className="todo-app">
      <h1>Day Goals!</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="write code 3"
          className='add_field'
        />
        <button className="button add-button" onClick={handleAddTodo}> Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={index} className="todo-item">
            {todo.editing ? (
              <div className='todo-item-details'>
                <input className="edit-input"
                  type="text"
                  value={todo.editText}
                  onChange={(event) => {
                    const newTodos = [...todos];
                    newTodos[index].editText = event.target.value;
                    setTodos(newTodos);

                  }}
                  
                  onKeyDown={(event) => handleKeyDown(event, index, event.target.value)}
                />
                <div>
                  <FaSave className="save" onClick={() => handleEditSubmit(index, todo.editText)} />
                  <FaTrash className="delete" onClick={() => handleDeleteTodo(index)} />
                </div>

              </div>
            ) : (
              <div className="todo-item-details">
                {todo.text} ({todo.editedCount ? `Edited ${todo.editedCount - 1} times` : `Uploaded ${todo.count - 1} times`})
                <div>
                  <FaEdit className="edit" onClick={() => handleEditStart(index)} />
                  <FaTrash className="delete" onClick={() => handleDeleteTodo(index)} />
                </div>

              </div>
            )}
          </li>
        ))}
        <button className="save-button" onClick={handleSaveToLocalStorage}>Save</button>
      </ul>

    </div>
  );
}

export default TodoApp;
