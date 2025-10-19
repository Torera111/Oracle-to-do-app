const express = require('express');
const router = express.Router();
const { getTodos, 
    addTodo, 
    updateTodo, 
    deleteTodo } = require('../controllers/todoController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getTodos);
router.post('/', authenticateToken, addTodo);
router.put('/:id', authenticateToken, updateTodo);
router.delete('/:id', authenticateToken, deleteTodo);

console.log('Todo routes module loaded');
// log registered route methods/paths for quick debugging
if (router.stack && Array.isArray(router.stack)) {
    router.stack.forEach((r) => {
        if (r.route && r.route.path) {
            const methods = Object.keys(r.route.methods).join(',');
            console.log(`Registered todo route: [${methods}] /todos${r.route.path}`);
        }
    });
}

module.exports = router;