import { useState, useEffect } from 'react'
import TodoList from '@/components/TodoList'
import TodoForm from '@/components/TodoForm'
import type { Todo } from '@/types/todo'

const STORAGE_KEY = 'todos'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])

  // Load todos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setTodos(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse todos from storage', e)
      }
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTodos([newTodo, ...todos])
  }

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const completedCount = todos.filter((todo) => todo.completed).length
  const activeCount = todos.length - completedCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">✓ Todo App</h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Form Section */}
          <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600">
            <TodoForm onAdd={addTodo} />
          </div>

          {/* Content Section */}
          <div className="p-6">
            {todos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No todos yet. Add one to get started!</p>
              </div>
            ) : (
              <>
                <TodoList
                  todos={todos}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
                {/* Stats Footer */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex gap-4">
                    <span><strong>{activeCount}</strong> active</span>
                    <span><strong>{completedCount}</strong> completed</span>
                  </div>
                  {completedCount > 0 && (
                    <button
                      onClick={clearCompleted}
                      className="text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Clear completed
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
