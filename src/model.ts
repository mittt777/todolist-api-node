import { Database } from 'sqlite3';

const db = new Database('db.sqlite');

db.exec(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT DEFAULT NULL,
  completed BOOLEAN DEFAULT FALSE
)`)

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export const getTasks = (): Promise<Task[] | Error> => new Promise((resolve, reject) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      reject(err)
    }
    resolve(rows as Task[])
  })
})

export const createTask = (task: Task): Promise<Task | Error> => new Promise((resolve, reject) => {
  db.run('INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)', [task.title, task.description, task.completed], function (err) {
    if (err) {
      reject(err)
    }
    resolve({ ...task, id: this.lastID })
  })
})

export const getTask = (id: number): Promise<Task | Error> => new Promise((resolve, reject) => {
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      reject(err)
    }
    resolve(row as Task)
  })
})

export const updateTask = (id: number, task: Omit<Task, 'id'>): Promise<boolean> => new Promise((resolve, reject) => {
  db.run('UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?', [task.title, task.description, task.completed, id], function (err) {
    if (err) {
      reject(err)
    }
    resolve(this.changes > 0)
  })
})

export const deleteTask = (id: number): Promise<boolean> => new Promise((resolve, reject) => {
  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) {
      reject(err)
    }
    resolve(this.changes > 0)
  })
})


