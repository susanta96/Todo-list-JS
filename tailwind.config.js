module.exports = {
  purge: {
    content: ['./src/*.html'],
    options: {
      safelist: ['todo-item','round-box', 'todo-task', 'todo-time', 'check-icon', 'check-box', 'line-through', 'delete-icon', 'opacity-50']
    }
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
