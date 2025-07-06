
const express = require('express');
const cors = require('cors');
const db = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/tasks', async (req, res) => {
  try {
    const snapshot = await db.collection('tasks').get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});


app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  console.log('Updating Task ID:', id);
  console.log('Data to update:', updatedData);

  try {
    const docRef = db.collection('tasks').doc(id);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      console.log('❌ Document not found');
      return res.status(404).json({ error: 'Task not found' });
    }

    await docRef.update(updatedData);
    console.log('✅ Task updated successfully');
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('🔥 Firestore Update Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});


app.post('/tasks', async (req, res) => {
  try {
    const data = req.body;

    
    const docRef = await db.collection('tasks').add(data);

    console.log('✅ Task added with ID:', docRef.id);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    console.error('🔥 Firestore Add Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});


app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    await db.collection('tasks').doc(taskId).delete();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get('/api', (req, res) => {
  res.send('Hello from backend!');
});




