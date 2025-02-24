// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const postsFilePath = path.join(__dirname, 'posts.json');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Helper function to read posts
const readPosts = () => {
    try {
        const data = fs.readFileSync(postsFilePath);
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Routes

// Get all posts
app.get('/posts', (req, res) => {
    const posts = readPosts();
    res.render('home', { posts });
});

// Get a single post by ID
app.get('/post', (req, res) => {
    const { id } = req.query;
    const posts = readPosts();
    const post = posts.find(p => p.id === parseInt(id));

    if (post) {
        res.render('post', { post });
    } else {
        res.status(404).send('Post not found');
    }
});

// Add a new post with image and date support
app.post('/add-post', (req, res) => {
    const { title, content, image } = req.body;
    if (!title || !content) {
        return res.status(400).send('Title and content are required');
    }

    const posts = readPosts();
    const newPost = { 
        id: posts.length + 1, 
        title, 
        content, 
        image: image && image.trim() !== '' ? image : '/public/images/default.jpg',
        date: new Date().toLocaleString() 
    };
    posts.push(newPost);

    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
    res.redirect('/posts');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// Let me know if you want me to add more features or refine anything else! 🚀
