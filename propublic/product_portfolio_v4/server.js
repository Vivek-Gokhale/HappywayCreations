import express from 'express';
import bodyParser from 'body-parser';
import Razorpay from 'razorpay';
import cors from 'cors';
import mysql from 'mysql';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import multer from 'multer';
import fs from 'fs';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';

const app = express();
const port = 3000;

// Replace these with your Razorpay key and secret
const razorpay = new Razorpay({
    key_id: 'rzp_test_s2VG2G2HwcOQd6',
    key_secret: '13wTYUM144Kv98GujKu6kkB6'
});

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Generate a random session secret key
const generateSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Use the generated secret key here
app.use(session({
    secret: generateSecretKey(), // Replace with your own secret key
    resave: false,
    saveUninitialized: false, // Set to false to prevent creating sessions until something is stored
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'product_portfolio_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Database connected');
});



// Subscribe Route
app.post('/subscribe', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Check if the email already exists in the database
    const checkEmailQuery = 'SELECT * FROM registered_newsletter WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(202).json({ error: 'Email already registered' }); // 202 Accepted (already registered)
        }

        // Insert the new email into the database
        const insertEmailQuery = 'INSERT INTO registered_newsletter (email) VALUES (?)';
        db.query(insertEmailQuery, [email], (err, results) => {
            if (err) {
                console.error('Error inserting into the database:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(201).json({ message: 'Subscription successful' }); // 201 Created
        });
    });
});

app.post('/checkEmail', (req, res) => {
  const { email } = req.body;

  // Query to check if email exists in database
  const query = 'SELECT COUNT(*) AS count FROM user_register_details WHERE user_email = ?';
  db.query(query, [email], (err, results) => {
      if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      const count = results[0].count;

      if (count > 0) {
          // Email exists
          return res.json({ exists: true });
      } else {
          // Email does not exist
          return res.json({ exists: false });
      }
  });
});

// Function to send email using Nodemailer
const sendEmail = (email, otp) => {
  return new Promise((resolve, reject) => {
      // Configure transporter with your SMTP settings
      let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'vivekgokhale23@gmail.com', // replace with your email
            pass: 'jnqq qzwt yrrs crqq' // replace with your password or app-specific password
          }
      });

      // Email message options
      let mailOptions = {
          from: 'vivekgokhale23@gmail.com',
          to: email,
          subject: 'Your OTP for password reset',
          text: `Your OTP is ${otp}. Please use this OTP to reset your password.`
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error('Error sending email:', error);
              reject(error);
          } else {
              console.log('Email sent:', info.response);
              resolve();
          }
      });
  });
};

// Route to send OTP
app.post('/sendotp', (req, res) => {
  const { email } = req.body;

  // Generate OTP
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

  // Store OTP in session
  req.session.otp = otp;
  console.log('Generated OTP:', otp); // Debugging statement
  console.log('Session after setting OTP:', req.session); // Debugging statement

  // Send OTP via email
  sendEmail(email, otp)
      .then(() => {
          res.status(200).json({ message: 'OTP sent successfully', otp});
      })
      .catch((error) => {
          console.error('Error sending OTP:', error);
          res.status(500).json({ error: 'Failed to send OTP' });
      });
});




// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Replace this with your actual database query
    const query = 'SELECT user_id, user_password FROM user_register_details WHERE user_email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            const user = results[0];
            
            if (bcrypt.compareSync(password, user.user_password)) {
                req.session.userId = user.user_id;
                const redirectTo = req.session.redirectTo || '/';
                delete req.session.redirectTo;
                return res.json({ message: 'Login successful', redirectTo });
            } else {
                return res.status(401).json({ error: 'Invalid password' });
            }
        } else {
            return res.status(401).json({ error: 'No user found with this email' });
        }
    });
});

app.post('/signup', (req, res) => {
  const { email, password, firstName, lastName, phoneNo } = req.body;

  // Check if the user_email already exists
  const checkQuery = 'SELECT user_email FROM user_register_details WHERE user_email = ?';
  db.query(checkQuery, [email], (err, results) => {
      if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
          return res.status(400).json({ error: 'Email already registered' });
      } else {
          // Hash the password
          bcrypt.hash(password, 10, (err, hashedPassword) => {
              if (err) {
                  console.error('Error hashing the password:', err);
                  return res.status(500).json({ error: 'Error hashing the password' });
              }

              // Insert the new user into the database
              const insertQuery = 'INSERT INTO user_register_details (user_email, user_password, first_name, last_name, user_phone_no) VALUES (?, ?, ?, ?, ?)';
              db.query(insertQuery, [email, hashedPassword, firstName, lastName, phoneNo], (err, result) => {
                  if (err) {
                      console.error('Error inserting into the database:', err);
                      return res.status(500).json({ error: 'Database error' });
                  }
                  return res.json({ message: 'Sign up successful' });
              });
          });
      }
  });
});

app.post('/resetPassword', (req, res) => {
  const { email, newPassword } = req.body;

  // Check if the user_email exists
  const checkQuery = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
  db.query(checkQuery, [email], (err, results) => {
      if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
          return res.status(400).json({ error: 'Email not registered' });
      } else {
          // Hash the new password
          bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
              if (err) {
                  console.error('Error hashing the password:', err);
                  return res.status(500).json({ error: 'Error hashing the password' });
              }

              // Update the user's password in the database
              const updateQuery = 'UPDATE user_register_details SET user_password = ? WHERE user_email = ?';
              db.query(updateQuery, [hashedPassword, email], (err, result) => {
                  if (err) {
                      console.error('Error updating the database:', err);
                      return res.status(500).json({ error: 'Database error' });
                  }
                  return res.json({ success: true, message: 'Password reset successful' });
              });
          });
      }
  });
});


app.get('/user-details', (req, res) => {
  const email = req.query.email;

  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  const query = 'SELECT user_id, user_email, first_name, last_name, user_phone_no FROM user_register_details WHERE user_email = ?';
  db.query(query, [email], (err, results) => {
      if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
          const userDetails = results[0];
          return res.json(userDetails);
      } else {
          return res.status(404).json({ error: 'No user found with this email' });
      }
  });
});

app.post('/getUserDetails', (req, res) => {
  const { email } = req.body;

  const query = 'SELECT first_name, last_name, user_email, user_phone_no FROM user_register_details WHERE user_email = ?';
  db.query(query, [email], (err, results) => {
      if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
          const userDetails = results[0];
          const fullName = `${userDetails.first_name} ${userDetails.last_name}`;
          return res.json({
              name: fullName,
              email: userDetails.user_email,
              contact: userDetails.user_phone_no
          });
      } else {
          return res.status(404).json({ error: 'No user found with this email' });
      }
  });
});


// Register Route
app.post('/add-to-cart', (req, res) => {
    const { userEmail, productId, quantity } = req.body;
    
    // Step 1: Fetch user_id from user_register_details based on userEmail
    const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
    db.query(queryUser, [userEmail], (err, userRows) => {
        if (err) {
            console.error('Error querying user ID:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (userRows.length === 0) {
            console.log("User not found for email:", userEmail);
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].user_id;
        console.log("User ID:", userId);

        // Step 2: Check if product exists in cart for the user
        const queryCheck = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';
        db.query(queryCheck, [userId, productId], (err, checkRows) => {
            if (err) {
                console.error('Error checking product in cart:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (checkRows.length > 0) {
                // Product already exists, update quantity
                const updateQty = 'UPDATE cart SET product_qty = product_qty + ? WHERE user_id = ? AND product_id = ?';
                db.query(updateQty, [quantity, userId, productId], (err, _) => {
                    if (err) {
                        console.error('Error updating product quantity:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    console.log("Quantity updated for product ID:", productId);
                    res.send('Item added to cart successfully');
                });
            } else {
                // Product doesn't exist, insert into cart
                const insertQuery = 'INSERT INTO cart (user_id, product_id, product_qty) VALUES (?, ?, ?)';
                db.query(insertQuery, [userId, productId, quantity], (err, _) => {
                    if (err) {
                        console.error('Error inserting product into cart:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    console.log("New product added to cart. Product ID:", productId);
                    res.send('Item added to cart successfully');
                });
            }
        });
    });
});

app.post('/update-user-details', (req, res) => {
  const { user_email, first_name, last_name, user_phone_no } = req.body;

  const query = 'UPDATE user_register_details SET first_name = ?, last_name = ?, user_phone_no = ? WHERE user_email = ?';
  db.query(query, [first_name, last_name, user_phone_no, user_email], (err, result) => {
      if (err) {
          console.error('Error updating the database:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      return res.json({ message: 'User details updated successfully' });
  });
});

app.post('/add-to-wishlist', (req, res) => {
    const { userEmail, productId, quantity } = req.body;
    
    // Step 1: Fetch user_id from user_register_details based on userEmail
    const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
    db.query(queryUser, [userEmail], (err, userRows) => {
        if (err) {
            console.error('Error querying user ID:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (userRows.length === 0) {
            console.log("User not found for email:", userEmail);
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].user_id;
        console.log("User ID:", userId);

        // Step 2: Check if product exists in cart for the user
        const queryCheck = 'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?';
        db.query(queryCheck, [userId, productId], (err, checkRows) => {
            if (err) {
                console.error('Error checking product in cart:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (checkRows.length > 0) {
                // Product already exists, update quantity
                const updateQty = 'UPDATE wishlist SET product_qty = product_qty + ? WHERE user_id = ? AND product_id = ?';
                db.query(updateQty, [quantity, userId, productId], (err, _) => {
                    if (err) {
                        console.error('Error updating product quantity:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    console.log("Quantity updated for product ID:", productId);
                    res.send('Item added to cart successfully');
                });
            } else {
                // Product doesn't exist, insert into cart
                const insertQuery = 'INSERT INTO wishlist (user_id, product_id, product_qty) VALUES (?, ?, ?)';
                db.query(insertQuery, [userId, productId, quantity], (err, _) => {
                    if (err) {
                        console.error('Error inserting product into cart:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    console.log("New product added to cart. Product ID:", productId);
                    res.send('Item added to cart successfully');
                });
            }
        });
    });
});


// Fetch Featured Products Route

app.get('/featured-products', (req, res) => {
    const query = 'SELECT product_id, product_image FROM product WHERE isFeatured = 1';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        // Base path for the product images
        const basePath = 'http://localhost/project_setup/admin-template/docs/product-uploads/';

        // Format the results to include the full path for the images
        const products = results.map(product => {
            const images = JSON.parse(product.product_image);
            const fullImageUrls = images.map(image => basePath + image);

            return {
                ...product,
                product_image: fullImageUrls
            };
        });
      
        res.json(products);
    });
});

const basePath = 'http://localhost/project_setup/admin-template/docs/product-uploads/';

app.post('/getUserOrders', (req, res) => {
  const { email } = req.body;
  console.log(email);
  
  if (!email) {
      console.error('Email is required');
      return res.status(400).json({ error: 'Email is required' });
  }

  const getUserQuery = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
  db.query(getUserQuery, [email], (err, userResults) => {
      if (err) {
          console.error('Error querying the database for user:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      if (userResults.length === 0) {
          console.error('User not found for email:', email);
          return res.status(404).json({ error: 'User not found' });
      }

      const userId = userResults[0].user_id;
      
      const getOrdersQuery = 'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC';
      db.query(getOrdersQuery, [userId], (err, orderResults) => {
          if (err) {
              console.error('Error querying orders for user ID:', userId, err);
              return res.status(500).json({ error: 'Database error' });
          }

          if (orderResults.length === 0) {
              console.error('No orders found for user ID:', userId);
              return res.status(404).json({ error: 'No orders found for this user' });
          }

          const productIds = [...new Set(orderResults.flatMap(order => JSON.parse(order.product_ids)))];
          console.log('Product IDs:', productIds);

          const getProductsQuery = 'SELECT * FROM product WHERE product_id IN (?)';
          db.query(getProductsQuery, [productIds], (err, productResults) => {
              if (err) {
                  console.error('Error querying products for product IDs:', productIds, err);
                  return res.status(500).json({ error: 'Database error' });
              }

              const formattedProducts = productResults.map(product => {
                  const images = JSON.parse(product.product_image);
                  const fullImageUrls = images.map(image => basePath + image);
                  return {
                      ...product,
                      product_image: fullImageUrls
                  };
              });

              const formattedOrders = orderResults.map(order => {
                  const productQtys = JSON.parse(order.product_qtys);
                  return {
                      ...order,
                      product_qtys: productQtys
                  };
              });

              res.json({
                  orders: formattedOrders,
                  products: formattedProducts
              });
          });
      });
  });
});






// Fetch Product Details by ID Route
app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  
  const query = `
      SELECT p.*, c.category_name
      FROM product p
      JOIN category c ON p.category_id = c.category_id
      WHERE p.product_id = ?
  `;

  db.query(query, [productId], (err, results) => {
      if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'Product not found' });
      }

      const product = results[0];

      // Base path for the product images
      const basePath = 'http://localhost/project_setup/admin-template/docs/product-uploads/';
      const images = JSON.parse(product.product_image);
      const fullImageUrls = images.map(image => basePath + image);

      let colors = [];
      try {
          colors = JSON.parse(product.product_color);
      } catch (e) {
          console.warn(`Invalid or missing product_color for product_id ${product.product_id}`);
      }

      product.product_image = fullImageUrls;
      product.product_color = colors;

      res.json(product);
  });
});


app.get('/productsCate', (req, res) => {
    const categoryName = req.query.category;

    const query = `
        SELECT p.*, c.category_name
        FROM product p
        JOIN category c ON p.category_id = c.category_id
        WHERE c.category_name = ?
    `;

    db.query(query, [categoryName], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No products found for the specified category' });
        }

        // Base path for the product images
        const basePath = 'http://localhost/project_setup/admin-template/docs/product-uploads/';

        const products = results.map(product => {
            const images = JSON.parse(product.product_image);
            const fullImageUrls = images.map(image => basePath + image);

            let colors = [];
            try {
                colors = JSON.parse(product.product_color);
            } catch (e) {
                console.warn(`Invalid or missing product_color for product_id ${product.product_id}`);
            }

            return {
                ...product,
                product_image: fullImageUrls,
                product_color: colors
            };
        });

        res.json(products);
    });
});

app.post('/colors', (req, res) => {
  const { category } = req.body;

  let query = `
      SELECT product_color
      FROM product
  `;
  let queryParams = [];

  if (category !== 'All') {
      query += `
          JOIN category c ON product.category_id = c.category_id
          WHERE c.category_name = ?
      `;
      queryParams.push(category);
  }

  db.query(query, queryParams, (err, results) => {
      if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'No colors found' });
      }

      let colors = [];
      results.forEach(result => {
          try {
              const productColors = JSON.parse(result.product_color);
              colors = colors.concat(productColors);
          } catch (e) {
              console.warn(`Invalid product_color: ${result.product_color}`);
          }
      });

      // Remove duplicates
      const uniqueColors = [...new Set(colors)];

      res.json(uniqueColors);
  });
});



app.get('/productsAll', (req, res) => {
  const query = `
    SELECT p.*, c.category_name
    FROM product p
    JOIN category c ON p.category_id = c.category_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No products found' });
    }

    const basePath = 'http://localhost/project_setup/admin-template/docs/product-uploads/';
    const products = results.map(product => {
      const images = JSON.parse(product.product_image);
      const fullImageUrls = images.map(image => basePath + image);

      let colors = [];
      try {
        colors = JSON.parse(product.product_color);
      } catch (e) {
        console.warn(`Invalid or missing product_color for product_id ${product.product_id}`);
      }

      return {
        ...product,
        product_image: fullImageUrls,
        product_color: colors
      };
    });

    res.json(products);
  });
});

  
  app.get('/productsByCategoryAndPrice', (req, res) => {
    const { category, price } = req.query;

    let query = `
      SELECT p.*, c.category_name
      FROM product p
      JOIN category c ON p.category_id = c.category_id
      WHERE p.product_mrp <= ?
    `;
    let queryParams = [price];

    if (category && category !== 'All') {
      query += ' AND c.category_name = ?';
      queryParams.push(category);
    }

    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'No products found' });
      }

      const basePath = 'http://localhost/project_setup/admin-template/docs/product-uploads/';
      const products = results.map(product => {
        const images = JSON.parse(product.product_image);
        const fullImageUrls = images.map(image => basePath + image);

        let colors = [];
        try {
          colors = JSON.parse(product.product_color);
        } catch (e) {
          console.warn(`Invalid or missing product_color for product_id ${product.product_id}`);
        }

        return {
          ...product,
          product_image: fullImageUrls,
          product_color: colors
        };
      });

      res.json(products);
    });
  });



  
// Protected Routes
// POST endpoint to add item to cart
app.post('/add-to-cart', async (req, res) => {
    const { userEmail, productId, quantity } = req.body;
    
    try {
        // Step 1: Fetch user_id from user_register_details based on userEmail
        const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
        const [userRows, _] = await db.query(queryUser, [userEmail]);

        if (userRows.length === 0) {
            console.log("User not found for email:", userEmail);
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].user_id;
        console.log("User ID:", userId);

        // Step 2: Check if product exists in cart for the user
        const queryCheck = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';
        const [checkRows, __] = await db.query(queryCheck, [userId, productId]);

        if (checkRows.length > 0) {
            // Product already exists, update quantity
            const updateQty = 'UPDATE cart SET product_qty = product_qty + ? WHERE user_id = ? AND product_id = ?';
            await db.query(updateQty, [quantity, userId, productId]);
            console.log("Quantity updated for product ID:", productId);
        } else {
            // Product doesn't exist, insert into cart
            const insertQuery = 'INSERT INTO cart (user_id, product_id, product_qty) VALUES (?, ?, ?)';
            await db.query(insertQuery, [userId, productId, quantity]);
            console.log("New product added to cart. Product ID:", productId);
        }

        res.send('Item added to cart successfully');
    } catch (error) {
        console.error('Error adding item to cart:', error.message);
        res.status(500).json({ error: 'Failed to add item to cart', details: error.message });
    }
});


app.post('/productsByColor', (req, res) => {
  const { color, category } = req.body;

  let query = `
      SELECT p.*, c.category_name
      FROM product p
      JOIN category c ON p.category_id = c.category_id
      WHERE JSON_CONTAINS(p.product_color, '"${color}"')
  `;

  if (category !== 'All') {
      query += ` AND c.category_name = ?`;
  }

  const queryParams = category !== 'All' ? [category] : [];

  db.query(query, queryParams, (err, results) => {
      if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'No products found for the specified color and category' });
      }

      // Base path for the product images
      const basePath = 'http://localhost/project_setup/admin-template/docs/product-uploads/';

      const products = results.map(product => {
          const images = JSON.parse(product.product_image);
          const fullImageUrls = images.map(image => basePath + image);

          let colors = [];
          try {
              colors = JSON.parse(product.product_color);
          } catch (e) {
              console.warn(`Invalid or missing product_color for product_id ${product.product_id}`);
          }

          return {
              ...product,
              product_image: fullImageUrls,
              product_color: colors
          };
      });

      res.json(products);
  });
});





app.post('/get-cart-products', (req, res) => {
    const { userEmail } = req.body;

    // Step 1: Fetch user_id from user_register_details based on userEmail
    const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
    db.query(queryUser, [userEmail], (err, userRows) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].user_id;

        // Step 2: Fetch products from cart table based on user_id
        const queryCart = 'SELECT * FROM cart WHERE user_id = ?';
        db.query(queryCart, [userId], (err, cartRows) => {
            if (err) {
                console.error('Error querying the database:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.json(cartRows); // Return the cart products as a JSON response
        });
    });
});



app.post('/get-wishlist-products', (req, res) => {
    const { userEmail } = req.body;

    // Step 1: Fetch user_id from user_register_details based on userEmail
    const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
    db.query(queryUser, [userEmail], (err, userRows) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].user_id;

        // Step 2: Fetch products from cart table based on user_id
        const queryCart = 'SELECT * FROM wishlist WHERE user_id = ?';
        db.query(queryCart, [userId], (err, cartRows) => {
            if (err) {
                console.error('Error querying the database:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.json(cartRows); // Return the cart products as a JSON response
        });
    });
});

app.post('/get-product-details', (req, res) => {
    const { productIds } = req.body;

    const queryProducts = 'SELECT * FROM product WHERE product_id IN (?)';
    db.query(queryProducts, [productIds], (err, productRows) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const basePath = 'http://localhost/project_setup/admin-template/docs/product-uploads/';
        const products = productRows.map(product => {
            const images = JSON.parse(product.product_image);
            const fullImageUrls = images.map(image => basePath + image);
            return {
                ...product,
                product_image: fullImageUrls
            };
        });

        res.json(products);
    });
});

app.post('/remove-from-wishlist', (req, res) => {
    const { productId, userEmail } = req.body;
    console.log(productId, userEmail);
    const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';

    db.query(queryUser, [userEmail], (err, userRows) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].user_id;
        console.log(userId, productId);

        const deleteQuery = 'DELETE FROM wishlist WHERE product_id = ? AND user_id = ?';
        db.query(deleteQuery, [productId, userId], (err, result) => {
            if (err) {
                console.error('Error deleting the wishlist item:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Wishlist item not found' });
            }

            res.json({ success: true });
        });
    });
});

app.post('/update-wishlist-quantity', (req, res) => {
    const { productId, userEmail, quantity } = req.body;

    const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
    db.query(queryUser, [userEmail], (err, userRows) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].user_id;

        const updateQuery = 'UPDATE wishlist SET product_qty = ? WHERE product_id = ? AND user_id = ?';
        db.query(updateQuery, [quantity, productId, userId], (err, result) => {
            if (err) {
                console.error('Error updating the wishlist item:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Wishlist item not found' });
            }

            res.json({ success: true });
        });
    });
});

app.post('/update-cart-quantity', (req, res) => {
    const { productId, userEmail, quantity } = req.body;

    const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
    db.query(queryUser, [userEmail], (err, userRows) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].user_id;

        const updateQuery = 'UPDATE cart SET product_qty = ? WHERE product_id = ? AND user_id = ?';
        db.query(updateQuery, [quantity, productId, userId], (err, result) => {
            if (err) {
                console.error('Error updating the cart item:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'cart item not found' });
            }

            res.json({ success: true });
        });
    });
});


app.post('/remove-from-cart', (req, res) => {
    const { productId, userEmail } = req.body;

    const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
    db.query(queryUser, [userEmail], (err, userRows) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].user_id;

        const deleteQuery = 'DELETE FROM cart WHERE product_id = ? AND user_id = ?';
        db.query(deleteQuery, [productId, userId], (err, result) => {
            if (err) {
                console.error('Error deleting the cart item:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cart item not found' });
            }

            res.json({ success: true });
        });
    });
});



app.post('/get-applied-coupons', (req, res) => {
  const { userEmail } = req.body;

  const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
  db.query(queryUser, [userEmail], (err, userRows) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].user_id;

    const queryCoupons = 'SELECT coupon_code FROM applied_coupons WHERE user_id = ?';
    db.query(queryCoupons, [userId], (err, appliedCoupons) => {
      if (err) {
        console.error('Error fetching applied coupons:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (appliedCoupons.length === 0) {
        return res.json({ couponCodes: [] });  // No applied coupons
      }

      const couponCodesApplied = appliedCoupons.map(row => row.coupon_code);

      const queryOrders = 'SELECT coupon_code FROM orders WHERE user_id = ?';
      db.query(queryOrders, [userId], (err, orderCoupons) => {
        if (err) {
          console.error('Error fetching order coupons:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        let couponCodesOrdered = [];
        orderCoupons.forEach(row => {
          if (row.coupon_code) {
            try {
              const coupons = JSON.parse(row.coupon_code);
              couponCodesOrdered = couponCodesOrdered.concat(coupons);
            } catch (error) {
              console.error('Error parsing coupon code:', error);
            }
          }
        });

        const filteredCoupons = couponCodesApplied.filter(coupon => !couponCodesOrdered.includes(coupon));

        res.json({ couponCodes: filteredCoupons });
      });
    });
  });
});

app.post('/get-applied-coupons-temp', (req, res) => {
  const { userEmail } = req.body;

  const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
  db.query(queryUser, [userEmail], (err, userRows) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].user_id;

    const queryCoupons = 'SELECT coupon_code FROM applied_coupons WHERE user_id = ?';
    db.query(queryCoupons, [userId], (err, appliedCoupons) => {
      if (err) {
        console.error('Error fetching applied coupons:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const couponCodes = appliedCoupons.map(row => row.coupon_code);
      res.json({ couponCodes });
    });
  });
});

  app.get('/get-coupons', (req, res) => {
    db.query('SELECT coupon_code, coupon_percentage FROM coupons', (error, results) => {
      if (error) {
        console.error('Error fetching coupons:', error);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ coupons: results });
    });
  });

  app.post('/get-coupons-applied', (req, res) => {
    const { couponCodes } = req.body;
  
    // Check if couponCodes is empty
    if (!couponCodes || couponCodes.length === 0) {
      return res.json({ coupons: [] });
    }
  
    const query = 'SELECT coupon_code, coupon_percentage FROM coupons WHERE coupon_code IN (?)';
    db.query(query, [couponCodes], (err, couponRows) => {
      if (err) {
        console.error('Error querying the database for coupons:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      res.json({ coupons: couponRows });
    });
  });
  

  
  app.post('/get-product-cart-details', (req, res) => {
    const { productIds } = req.body;
    console.log(productIds);
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'Invalid product IDs' });
    }
  
    const placeholders = productIds.map(() => '?').join(',');
    const query = `SELECT product_id, product_mrp, product_discount, tax FROM product WHERE product_id IN (${placeholders})`;
  
    db.query(query, productIds, (err, results) => {
      if (err) {
        console.error('Error fetching product details:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      res.json({ products: results });
    });
  });

  app.post('/get-applied-coupons-discount', (req, res) => {
    const { userEmail } = req.body;
  
    if (!userEmail) {
      return res.status(400).json({ error: 'Invalid user email' });
    }
  
    const userQuery = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
    db.query(userQuery, [userEmail], (err, userResult) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (userResult.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userId = userResult[0].user_id;
  
      const appliedCouponQuery = 'SELECT coupon_code FROM applied_coupons WHERE user_id = ?';
      db.query(appliedCouponQuery, [userId], (err, couponResult) => {
        if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Database error' });
        }
  
        if (couponResult.length === 0) {
          return res.json({ discount: 0 }); // No coupon applied
        }
  
        const couponCodesApplied = couponResult.map(row => row.coupon_code);
  
        const queryOrders = 'SELECT coupon_code FROM orders WHERE user_id = ?';
        db.query(queryOrders, [userId], (err, orderCoupons) => {
          if (err) {
            console.error('Error fetching order coupons:', err);
            return res.status(500).json({ error: 'Database error' });
          }
  
          let couponCodesOrdered = [];
          orderCoupons.forEach(row => {
            if (row.coupon_code) {
              try {
                const coupons = JSON.parse(row.coupon_code);
                couponCodesOrdered = couponCodesOrdered.concat(coupons);
              } catch (error) {
                console.error('Error parsing coupon code:', error);
              }
            }
          });
  
          const filteredCoupons = couponCodesApplied.filter(coupon => !couponCodesOrdered.includes(coupon));
  
          if (filteredCoupons.length === 0) {
            return res.json({ discount: 0 }); // No valid coupons left
          }
  
          const placeholders = filteredCoupons.map(() => '?').join(',');
          const couponQuery = `SELECT coupon_percentage FROM coupons WHERE coupon_code IN (${placeholders})`;
          db.query(couponQuery, filteredCoupons, (err, couponDetailsResult) => {
            if (err) {
              console.error('Error querying the database:', err);
              return res.status(500).json({ error: 'Database error' });
            }
  
            if (couponDetailsResult.length === 0) {
              return res.status(404).json({ error: 'Coupons not found' });
            }
  
            const totalDiscount = couponDetailsResult.reduce((acc, curr) => acc + curr.coupon_percentage, 0);
            res.json({ discount: totalDiscount });
          });
        });
      });
    });
  });
  
  app.post('/handle-buy-now', (req, res) => {
    const { userEmail, productId, productQty, amount } = req.body;
  
    if (!userEmail || !productId || !productQty || !amount) {
      return res.status(400).json({ error: 'Invalid request data' });
    }
  
    const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
    db.query(queryUser, [userEmail], (err, userRows) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (userRows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userId = userRows[0].user_id;
      const productIds = [productId];
      const productQtys = [productQty];
  
      const insertOrder = 'INSERT INTO orders (user_id, product_ids, product_qtys, order_date, total_amount, coupon_code, payment_option, delivery_status) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)';
      const orderValues = [userId, JSON.stringify(productIds), JSON.stringify(productQtys), amount, null, 'online', 'Pending'];
  
      db.query(insertOrder, orderValues, (err, result) => {
        if (err) {
          console.error('Error inserting the order:', err);
          return res.status(500).json({ error: 'Database error' });
        }
  
        res.json({ success: true, message: 'Order placed successfully', orderId: result.insertId });
      });
    });
  });
  

  app.post('/handle-order', (req, res) => {
    const { userEmail, amount } = req.body;
  
    // Step 1: Retrieve user_id
    const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
    db.query(queryUser, [userEmail], (err, userRows) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (userRows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userId = userRows[0].user_id;
  
      // Step 2: Retrieve cart products
      const queryCart = 'SELECT product_id, product_qty FROM cart WHERE user_id = ?';
      db.query(queryCart, [userId], (err, cartRows) => {
        if (err) {
          console.error('Error querying the cart:', err);
          return res.status(500).json({ error: 'Database error' });
        }
  
        const productIds = cartRows.map(row => row.product_id);
        const productQtys = cartRows.map(row => row.product_qty);
  
        // Step 3: Retrieve coupon code
        const queryCoupon = 'SELECT coupon_code FROM applied_coupons WHERE user_id = ?';
        db.query(queryCoupon, [userId], (err, couponRows) => {
          if (err) {
            console.error('Error querying the coupons:', err);
            return res.status(500).json({ error: 'Database error' });
          }
  
          const couponCodes = couponRows.map(row => row.coupon_code);
  
          // Step 4: Insert record into orders table
          const insertOrder = 'INSERT INTO orders (user_id, product_ids, product_qtys, order_date, total_amount, coupon_code, payment_option, delivery_status) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)';
          const orderValues = [userId, JSON.stringify(productIds), JSON.stringify(productQtys), amount, JSON.stringify(couponCodes), 'online', 'Pending'];
  
          db.query(insertOrder, orderValues, (err, result) => {
            if (err) {
              console.error('Error inserting the order:', err);
              return res.status(500).json({ error: 'Database error' });
            }
  
            // Step 5: Delete cart records for the user
            const deleteCart = 'DELETE FROM cart WHERE user_id = ?';
            db.query(deleteCart, [userId], (err, deleteResult) => {
              if (err) {
                console.error('Error deleting cart records:', err);
                return res.status(500).json({ error: 'Database error' });
              }
  
              res.json({ success: true, message: 'Order placed successfully and cart cleared', orderId: result.insertId });
            });
          });
        });
      });
    });
  });
  
  
  
  app.post('/get-address', (req, res) => {
    const { userEmail } = req.body;
    console.log(userEmail);
    if (!userEmail) {
        return res.status(400).json({ error: 'User email is required' });
    }

    const userQuery = `
        SELECT 
            u.user_id,
            u.first_name,
            u.last_name,
            u.user_phone_no
        FROM 
            user_register_details u
        WHERE 
            u.user_email = ?
    `;

    db.query(userQuery, [userEmail], (err, userRows) => {
        if (err) {
            console.error('Error querying the database for user:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userRows[0];

        const addressQuery = `
            SELECT
                a.aid, 
                a.pincode,
                a.house_apartment,
                a.area,
                a.landmark,
                a.town_city,
                a.state,
                a.is_default,
                a.name,
                a.phone_no
            FROM 
                user_addresses a
            WHERE 
                a.user_id = ?
            ORDER BY 
                a.is_default DESC, a.aid ASC
        `;

        db.query(addressQuery, [user.user_id], (err, addressRows) => {
            if (err) {
                console.error('Error querying the database for addresses:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({
                user: {
                    user_id: user.user_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    user_phone_no: user.user_phone_no
                },
                addresses: addressRows
            });
        });
    });
});

  

  app.post('/insert-coupon', (req, res) => {
    const { couponCode, userEmail } = req.body;
  
    const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
    db.query(queryUser, [userEmail], (err, userRows) => {
      if (err) {
        console.error('Error querying the database for user:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (userRows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userId = userRows[0].user_id;
      const insertCouponQuery = 'INSERT INTO applied_coupons (user_id, coupon_code) VALUES (?, ?)';
  
      db.query(insertCouponQuery, [userId, couponCode], (err, result) => {
        if (err) {
          console.error('Error inserting coupon into the database:', err);
          return res.status(500).json({ error: 'Database error' });
        }
  
        res.json({ success: true });
      });
    });
  });

  app.post('/add-address', (req, res) => {
    const { pincode, houseNo, area, landmark, townCity, state, userEmail, name, phone_no } = req.body;

    const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
    db.query(queryUser, [userEmail], (err, userRows) => {
        if (err) {
            console.error('Error querying the database for user:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].user_id;
        const checkAddressQuery = 'SELECT COUNT(*) AS addressCount FROM user_addresses WHERE user_id = ?';

        db.query(checkAddressQuery, [userId], (err, addressRows) => {
            if (err) {
                console.error('Error querying the database for addresses:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            const isDefault = addressRows[0].addressCount === 0 ? 1 : 0;
            const insertAddressQuery = 'INSERT INTO user_addresses (user_id, pincode, house_apartment, area, landmark, town_city, state, is_default, name, phone_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

            db.query(insertAddressQuery, [userId, pincode, houseNo, area, landmark, townCity, state, isDefault, name, phone_no], (err, result) => {
                if (err) {
                    console.error('Error inserting address into the database:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                res.json({ success: true });
            });
        });
    });
});

app.post('/set-default-address', (req, res) => {
  const { userEmail, addressId } = req.body;
  console.log(addressId);
  const queryUser = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
  db.query(queryUser, [userEmail], (err, userRows) => {
      if (err) {
          console.error('Error querying the database for user:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      if (userRows.length === 0) {
          return res.status(404).json({ error: 'User not found' });
      }

      const userId = userRows[0].user_id;
      const updateAddressesQuery = 'UPDATE user_addresses SET is_default = 0 WHERE user_id = ?';
      const setDefaultQuery = 'UPDATE user_addresses SET is_default = 1 WHERE aid = ?';

      db.query(updateAddressesQuery, [userId], (err) => {
          if (err) {
              console.error('Error updating addresses in the database:', err);
              return res.status(500).json({ error: 'Database error' });
          }

          db.query(setDefaultQuery, [addressId], (err) => {
              if (err) {
                  console.error('Error setting default address in the database:', err);
                  return res.status(500).json({ error: 'Database error' });
              }

              res.json({ success: true });
          });
      });
  });
});

app.post('/submit-feedback', (req, res) => {
  const { user_email, feedback, type } = req.body;

  if (!user_email || !feedback || type === undefined) {
      return res.status(400).json({ error: 'Invalid request, missing user_email, feedback, or type' });
  }

  const insertFeedbackQuery = 'INSERT INTO site_feedback (user_email, feedback, type) VALUES (?, ?, ?)';
  db.query(insertFeedbackQuery, [user_email, feedback, type], (err, result) => {
      if (err) {
          console.error('Error inserting feedback into the database:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      res.json({ success: true });
  });
});

  

// Fetch address by aid
app.get('/fetch-address', (req, res) => {
    const aid = req.query.aid;
    db.query('SELECT * FROM user_addresses WHERE aid = ?', [aid], (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(results[0]);
    });
  });

  app.post('/update-address', (req, res) => {
    const { aid, pincode, houseNo, area, landmark, townCity, state, name, phone_no } = req.body;
  
    const query = `UPDATE user_addresses SET 
      pincode = ?, 
      house_apartment = ?, 
      area = ?, 
      landmark = ?, 
      town_city = ?, 
      state = ?,
      name = ?,
      phone_no = ?
      WHERE aid = ?`;
  
    const params = [pincode, houseNo, area, landmark, townCity, state, name, phone_no, aid];
  
    db.query(query, params, (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Address updated successfully', affectedRows: results.affectedRows });
    });
  });
  
  app.post('/buy-now', (req, res) => {
    const { product_id, quantity } = req.body;
    console.log("my details " + product_id + " : " +quantity);

    if (!product_id || !quantity) {
        return res.status(400).json({ error: 'Invalid product details' });
    }

    const productQuery = 'SELECT product_mrp, product_discount FROM product WHERE product_id = ?';

    db.query(productQuery, [product_id], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(results[0]);
    });
});

app.post('/createOrder', async (req, res) => {
    const { amount, currency, receipt } = req.body;

    if (!amount || !currency || !receipt) {
        return res.status(400).json({ error: 'Invalid request, missing amount, currency, or receipt' });
    }

    try {
        const order = await razorpay.orders.create({ amount, currency, receipt });
        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.get('/categories', (req, res) => {
  const selectQuery = 'SELECT category_id, category_name FROM category';

  db.query(selectQuery, (err, results) => {
      if (err) {
          console.error('Error fetching categories from database:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      res.json(results);
  });
});

app.post('/remove-address', (req, res) => {
    const { aid } = req.body;

    if (!aid) {
        return res.status(400).json({ error: 'Missing aid parameter' });
    }

    const deleteQuery = 'DELETE FROM user_addresses WHERE aid = ?';

    db.query(deleteQuery, [aid], (err, result) => {
        if (err) {
            console.error('Error removing address from database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Address with aid ${aid} not found` });
        }

        res.json({ message: `Address with aid ${aid} successfully removed` });
    });
});



app.post('/get-cart-buy', (req, res) => {
    const { product_ids } = req.body;
  
    // console.log('Received product_ids:', product_ids);
  
    if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
    //   console.log('Invalid product details:', product_ids);
      return res.status(400).json({ error: 'Invalid product details' });
    }
  
    const placeholders = product_ids.map(() => '?').join(',');
    const productQuery = `SELECT product_id, product_mrp, product_discount FROM product WHERE product_id IN (${placeholders})`;
  
    // console.log('Executing query:', productQuery, 'with values:', product_ids);
  
    db.query(productQuery, product_ids, (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (results.length === 0) {
        console.log('No products found for the provided IDs:', product_ids);
        return res.status(404).json({ error: 'Products not found' });
      }
  
     
      res.json(results);
    });
  });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'C:/xampp/htdocs/admin-template/docs/review_images/'); // Uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

const upload = multer({ storage: storage });

// Handle POST request to upload review
app.post('/uploadReview', upload.array('media', 5), (req, res) => {
    const { headline, review, rating, userEmail, product_id, order_id } = req.body;
    const mediaFiles = req.files;

    if (!userEmail || !product_id) {
        return res.status(400).json({ error: 'Missing userEmail or product_id' });
    }

    // Retrieve user ID based on email
    const getUserIdQuery = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
    db.query(getUserIdQuery, [userEmail], (err, userResult) => {
        if (err) {
            console.error('Error querying user ID:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (userResult.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userResult[0].user_id;

        // Prepare file names as JSON array
        const imagePaths = mediaFiles.map(file => file.filename);
        console.log(imagePaths);

        // Insert review data into the database
        const insertReviewQuery = `
            INSERT INTO product_review (product_id, user_id, order_id, feedback_headline, product_rating, product_feedback, product_review_image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(insertReviewQuery, [product_id, userId, order_id, headline, rating, review, JSON.stringify(imagePaths)], (err, result) => {
            if (err) {
                console.error('Error inserting review into database:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json({ message: 'Review uploaded successfully' });
        });
    });
});


app.post('/checkProductReview', async (req, res) => {
  const { userEmail, orderId, productId } = req.body;
  console.log(userEmail, orderId, productId);

  try {
      // Get user_id from user_register_details table using userEmail
      const getUserQuery = 'SELECT user_id FROM user_register_details WHERE user_email = ?';
      db.query(getUserQuery, [userEmail], (err, userResults) => {
          if (err) {
              console.error('Error querying the database:', err);
              return res.status(500).json({ error: 'Database error' });
          }

          if (userResults.length > 0) {
              const userId = userResults[0].user_id;

              // Check if the record exists in product_review table
              const checkReviewQuery = 'SELECT COUNT(*) AS reviewCount FROM product_review WHERE user_id = ? AND product_id = ? AND order_id = ?';
              db.query(checkReviewQuery, [userId, productId, orderId], (err, reviewResults) => {
                  if (err) {
                      console.error('Error querying the database:', err);
                      return res.status(500).json({ error: 'Database error' });
                  }

                  const reviewExists = reviewResults[0].reviewCount > 0;
                  res.json({ exists: reviewExists });
              });
          } else {
              return res.status(404).json({ exists: false });
          }
      });
  } catch (error) {
      console.error('Error checking product review status:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/getProductReview/:productId', (req, res) => {
  const { productId } = req.params;
  const basePath = 'http://localhost/project_setup/admin-template/docs/review_images/';

  const query = `
      SELECT pr.*, ur.first_name, ur.last_name 
      FROM product_review pr
      JOIN user_register_details ur ON pr.user_id = ur.user_id
      WHERE pr.product_id = ?
  `;

  db.query(query, [productId], (err, results) => {
      if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      // Process the results to convert product_review_image to array and add basePath
      const processedResults = results.map(review => {
          if (review.product_review_image) {
              try {
                  let imagesArray = JSON.parse(review.product_review_image);
                  review.product_review_image = imagesArray.map(image => basePath + image.trim());
              } catch (parseError) {
                  console.error('Error parsing product_review_image:', parseError);
                  review.product_review_image = [];
              }
          } else {
              review.product_review_image = [];
          }
          return review;
      });

      res.json(processedResults);
  });
});

app.get('/getProductRating/:productId', (req, res) => {
  const { productId } = req.params;
  console.log(productId);
  const query = `
      SELECT AVG(product_rating) as averageRating 
      FROM product_review 
      WHERE product_id = ?
  `;

  db.query(query, [productId], (err, results) => {
      if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      const averageRating = results[0].averageRating || 0;
      res.json({ averageRating });
  });
});
app.post('/update-product-quantity', (req, res) => {
  const { cartProducts } = req.body;

  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Database transaction error' });
    }

    const updatePromises = cartProducts.map(product => {
      return new Promise((resolve, reject) => {
        const query = `
          UPDATE product 
          SET no_of_items = no_of_items - ? 
          WHERE product_id = ?
        `;
        db.query(query, [product.product_qty, product.product_id], (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      });
    });

    Promise.all(updatePromises)
      .then(() => {
        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              console.error('Error committing transaction:', err);
              res.status(500).json({ error: 'Database commit error' });
            });
          }
          res.json({ message: 'Product quantities updated successfully' });
        });
      })
      .catch(err => {
        db.rollback(() => {
          console.error('Error updating product quantities:', err);
          res.status(500).json({ error: 'Database update error' });
        });
      });
  });
});

app.post('/update-single-product-quantity', (req, res) => {
  const { id, qty } = req.body;

  const query = `
    UPDATE product 
    SET no_of_items = no_of_items - ? 
    WHERE product_id = ?
  `;

  db.query(query, [qty, id], (err, results) => {
    if (err) {
      console.error('Error updating the database:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ message: 'Product quantity updated successfully' });
  });
});


// Main Page Route (example)
app.get('/',  (req, res) => {
    res.send('Welcome to the main page'); // Replace with your actual main page logic
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
