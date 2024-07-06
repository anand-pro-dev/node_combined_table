const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://anandprodev:CurdSimpleCluster@curdsimplecluster.rfzbvb1.mongodb.net/CombineDB?retryWrites=true&w=majority&appName=CombineDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Import routes
const userRoutes = require('./routes/user_routes.js');
app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
