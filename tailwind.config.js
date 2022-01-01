module.exports = {
  purge: {
    content: ['./src/*.html'],
    options: {
      safelist: ['todo-item','round-box', 'todo-task', 'todo-time']
    }
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
