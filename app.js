const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mySql = require("mysql2");

const DB_USERNAME = "andisorsurentest"
const DB_NAME = "andisorsurenprod"
const DB_PASSWORD = "surenistesting"


const sqlConnection = mySql.createConnection({
    host: 'db4free.net', 
    port:  3306,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    connectionLimit: 5 
})

sqlConnection.connect((err) => {
    if (err) {
      console.error('Error with connecting to MySQL database:', err);
      process.exit(1); 
    }
    console.log('Connected to MySQL database');
});

app.use(bodyParser.json());

//Testing front-end (incomplete due to time constraints)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/addProduct.html');
}); 
  
// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


// ADD A PRODUCT
app.post('/products', (req, res) => {
    const { name, description, stock, quantity, category } = req.body;
    sqlConnection.query('INSERT INTO Products (name, description, stock, quantity, category) VALUES (?, ?, ?, ?, ?)', [name, description, stock, quantity, category], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while creating the product' });
        } else {
            res.json({ message: 'Product created successfully' });
        }
    });
});


// UPDATE A PRODUCT
app.put('/products/:id', (req, res) => {
    const productId = req.params.id;
    const { name, description, stock, quantity, category } = req.body;
    sqlConnection.query('UPDATE Products SET name = ?, description = ?, stock = ?, quantity = ?, category = ? WHERE id = ?', [name, description, stock, quantity, category, productId], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while updating the product' });
        } else {
            res.json({ message: 'Product updated successfully in Suren Products DB' });
        }
    });
});
  

// GET ALL PRODUCTS
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM Products';
    sqlConnection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching the list of products' });
        } else {
            res.json({ message: 'List of products on Suren Test DB', data: results });
        }
    });
});


// GET PRODUCT BY ID
app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'SELECT * FROM Products WHERE id = ?';
    
    sqlConnection.query(query, [productId], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching the product' });
        } else {
            res.json({ message: 'Product details', data: results[0] });
        }
    });
});