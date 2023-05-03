const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51MYbfMDYuzoeBKxGcMhrNfA5j9wjsN4QqBDDofXq7ZXgfJhZB1K5R9MrUQZAEGVdzUgxgFcLyzSWIXLgbtUSD2Fz00NY3BBAUN');
const Cook = require('./../models/Cook')
const nodemailer = require('nodemailer');
const {v4:uuid} = require("uuid");
//const upload = require('../middleware/multer');
const MenuCategorySchema = require('./../models/MenuCategory');
const MenuItemSchema = require('./../models/Menu')
const multer = require('multer');
const aws = require("aws-sdk");
const multerS3 = require('multer-s3');
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const { uploadFile, getFileStream, uploadToS3 } = require('./s3')

//const upload2 = multer({ dest: 'uploads/' })

//const upload2 = multer({ dest: '/tmp' })

const storageTest = multer.memoryStorage();
const documentUpload = multer({ storage: storageTest });

// const upload = multer({ storage: storage });

router.get('/images/:key', (req, res) => {
  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
})


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + (file.originalname));
  },
});

const upload = multer({ storage: storage });


require('dotenv').config();

const bcrypt = require('bcrypt');
const path = require("path");
const { builtinModules } = require('module');

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});



const passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;



router.post('/cooksignup', (req, res) => {
    const { cook_email, cook_first_name, cook_last_name, cook_password, cook_birthday } = req.body;

    if ( !cook_email || !cook_first_name || !cook_last_name || !cook_password || !cook_birthday) {
        return res.status(400).send('All fields are required');
    }

    if (!passwordPattern.test(cook_password)) {
        return res.status(400).send('Password must be at least 8 characters and contain at least one number and one speactail character');
    }

    if (!emailPattern.test(cook_email)) {
        return res.status(400).send('Invalid email format');
    }

    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error generating salt')
        }

        // hashing password

        bcrypt.hash(cook_password, salt, (err, hash) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error hashing password');
            }

            const currentDate = new Date();
            const cook = new Cook({
                cook_first_name: cook_first_name,
                cook_last_name: cook_last_name,
                cook_email: cook_email,
                cook_password: hash,
                cook_birthday: cook_birthday,
                description: "This is the cooks Description",
                date_joined: currentDate,
                specialties: [],
                verified: false,
                profile_picture: "default.jpeg",
                application_status: "pending",
                
            });

            cook
            .save()
            .then((result) => {
                res.json({
                    status: "SUCCESS",
                    message: "successfully saved user",
                })
            })
            .catch((err) => {
                res.json({
                    status: "FAILED",
                    message: "An error occured!",
                })
            })
        });
    });
});

router.post('/cooksignin', (req, res) => {
    const { cook_email, cook_password } = req.body;

    if( !cook_email || !cook_password) {
        res.json({
            status: "FAILED",
            message: "Empty credentials provided",
        })
    } else {
        Cook.find({cook_email})
        .then(data => {
            if (data.length) {

                    const hashedPassword = data[0].cook_password;
                    bcrypt.compare(cook_password, hashedPassword).then(result => {
                        if (result) {
                            req.session.cook = data[0];
                            console.log(req.session.cook)

                            res.json({
                                status: "SUCCESS",
                                message: "Successfully logged in",
                            })
                        } else {
                            res.json({
                                status: "FAILED",
                                message: "Invalid password entered"
                            })
                        }
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while comparing passwords"
                        })
                    })
                
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials entered"
                })
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user"
            })
        })
    }
})

router.get("/cookinfo", (req, res) => {
  console.log(req.session);
  const cook = req.session.cook;
  // console.log(cook);

  if (cook) {
    Cook.findOne({ _id: cook._id })
      .populate("specialties")
      .exec((err, populatedCook) => {
        if (err) {
          res.json({
            status: "FAILED",
            message: "Error finding user",
          });
        } else {
          res.json({
            status: "SUCCESS",
            firstn: `${populatedCook.cook_first_name}`,
            lastn: `${populatedCook.cook_last_name}`,
            special: populatedCook.specialties,
            descrip: `${populatedCook.description}`,
            profile: `${populatedCook.profile_picture}`,
            bio: `${populatedCook.cook_bio}`,
            email: `${populatedCook.cook_email}`,
          });
        }
      });
  } else {
    res.json({
      status: "FAILED",
      message: "Error finding user",
    });
  }
});

router.get("/allcooks", async (req, res) => {
  try {
    const cooks = await Cook.find({});
    res.status(200).json({cooks});
  } catch (error) {
    console.error('Error fetching cooks:', error);
    res.status(500).json({message: 'There was an Error fetching cooks', error});
    };
});

  router.get('/cook/:cookId', async (req, res) => {
    const cookId = req.params.cookId;
    console.log('Requested cook ID:', cookId); // Add this line to log the cookId
  
    try {
      const cook = await Cook.findById(cookId);
      console.log('Found cook:', cook); // Add this line to log the cook object
      if (!cook) {
        res.status(404).json({ status: 'FAILED', message: 'Cook not found' });
      } else {
        res.json({ status: 'SUCCESS', cook });
      }
    } catch (err) {
      console.error('Error fetching cook by ID:', err);
      res.status(500).json({ status: 'FAILED', message: 'Error fetching cook by ID' });
    }
  });
  

  router.get('/menucategories', async (req, res) => {
    try {
      const menuCategories = await MenuCategorySchema.find();
      res.json({ status: 'SUCCESS', menuCategories });
    } catch (err) {
      res.json({ status: 'FAILED', message: 'Error retrieving menu categories' });
      console.log(err);
    }
  });

  router.get('/menuitems', async (req, res) => {
    try {
      const cookId = req.session.cook._id;
      const menuItems = await Menu.find({ cook: cookId }).populate('category');
      res.json({ status: 'SUCCESS', menuItems });
    } catch (err) {
      res.json({ status: 'FAILED', message: 'Error retrieving menu items' });
      console.log(err);
    }
  });
  

  router.get("/menu/cook/:cookId", async (req, res) => {
    try {
      const { cookId } = req.params;
      const menuItems = await MenuItemSchema.find({ cook_id: cookId });
      res.status(200).json({ menuItems });
    } catch (error) {
      console.error("Error fetching menu items for cook ID:", cookId, "Error:", error);
      res.status(500).json({ message: "Error fetching menu items" });
    }
  });

  // router.post('/images', upload2.single('image'), async (req, res) => {
  //   const file = req.file;
  //   console.log(file); // add this line to see if file is being received
  //   // apply filter
  //   // resize 
  
  //   const result = await uploadFile(file, 'images')
  //   await unlinkFile(file.path)
  //   console.log(result)
  //   const description = req.body.description
  //   res.send({imagePath: `/images/${result.Key}`})
  // });
  

  // router.post('/addmenuitem', upload2.single('imageurls'), async (req, res) => {
  //   const cook = req.session.cook;
  
  //   if (!cook) {
  //     return res.json({
  //       status: 'FAILED',
  //       message: 'Not authorized to add menu items',
  //     });
  //   }
  
  //   const { dish, dish_description, price, category } = req.body;
  //   // const imageurls = req.file ? req.file.path : null;
  //   const imageurls = req.file;
  //   console.log(imageurls); // add this line to see if file is being received
  
  //   const result = await uploadFile(imageurls, 'images')
  //   await unlinkFile(imageurls.path)
  //   console.log(result)
  //   const description = req.body.description
  //   res.send({imagePath: `/images/${result.Key}`})
  //   try {
  //     // Create a new product in Stripe
  //     const product = await stripe.products.create({
  //       name: dish,
  //       type: 'good',
  //     });
  
  //     // Create a new price for the product in Stripe
  //     const stripePrice = await stripe.prices.create({
  //       product: product.id,
  //       unit_amount: price * 100, // Stripe requires the price in cents
  //       currency: 'usd',
  //     });
  
  //     const newDish = {
  //       dish: dish,
  //       dish_description: dish_description,
  //       price: price,
  //       category: category,
  //       imageurls: imageurls,
  //       stripe_product_id: product.id, // Save the product ID in your database
  //       stripe_price_id: stripePrice.id, // Save the price ID in your database
  //     };
  
  //     const updatedCook = await Cook.findByIdAndUpdate(
  //       cook._id,
  //       { $push: { dishes: newDish } },
  //       { new: true }
  //     );
  
  //     res.json({
  //       status: 'SUCCESS',
  //       message: 'Menu item added successfully',
  //       updatedCook: updatedCook,
  //     });
  //   } catch (err) {
  //     res.json({
  //       status: 'FAILED',
  //       message: 'Error adding menu item',
  //       error: err,
  //     });
  //   }
  // });
  
  



  // router.post('/addmenuitem', upload.single('imageurls'), async (req, res) => {
  //   const cook = req.session.cook;
  
  //   if (!cook) {
  //     return res.json({
  //       status: 'FAILED',
  //       message: 'Not authorized to add menu items',
  //     });
  //   }
  
  //   const { dish, dish_description, price, category } = req.body;
  //   // const imageurls = req.file ? req.file.path : null;
  //   const imageurls = req.file;
  //   console.log(imageurls); // add this line to see if file is being received
  
  //   const result = await uploadFile(imageurls, 'images')
  //   await unlinkFile(imageurls.path)
  //   console.log(result)
  //   const description = req.body.description
  //   res.send({imagePath: `/images/${result.Key}`})
  //   try {
  //     // Create a new product in Stripe
  //     const product = await stripe.products.create({
  //       name: dish,
  //       type: 'good',
  //     });
  
  //     // Create a new price for the product in Stripe
  //     const stripePrice = await stripe.prices.create({
  //       product: product.id,
  //       unit_amount: price * 100, // Stripe requires the price in cents
  //       currency: 'eur',
  //     });
  
  //     const newDish = {
  //       dish: dish,
  //       dish_description: dish_description,
  //       price: price,
  //       category: category,
  //       imageurls: imageurls,
  //       stripe_product_id: product.id, // Save the product ID in your database
  //       stripe_price_id: stripePrice.id, // Save the price ID in your database
  //     };
  
  //     const updatedCook = await Cook.findByIdAndUpdate(
  //       cook._id,
  //       { $push: { dishes: newDish } },
  //       { new: true }
  //     );
  
  //     res.json({
  //       status: 'SUCCESS',
  //       message: 'Menu item added successfully',
  //       updatedCook: updatedCook,
  //     });
  //   } catch (err) {
  //     res.json({
  //       status: 'FAILED',
  //       message: 'Error adding menu item',
  //       error: err,
  //     });
  //   }
  // });
  



  // router.post('/addmenuitem', upload.single('imageurls'), async (req, res) => {
  //   console.log(req.files);
  //   console.log(req.body);
  //   const cook = req.session.cook;
  
  //   if (!cook) {
  //     return res.json({
  //       status: 'FAILED',
  //       message: 'Not authorized to add menu items',
  //     });
  //   }
  
  //   const { item_name, product_description, price, category } = req.body;
  //   const imageurls = req.file ? req.file.path : null;
  
  //   try {
  //     // Create a new product in Stripe
  //     const product = await stripe.products.create({
  //       name: item_name,
  //       type: 'good',
  //     });
  
  //     // Create a new price for the product in Stripe
  //     const stripePrice = await stripe.prices.create({
  //       product: product.id,
  //       unit_amount: price * 100, // Stripe requires the price in cents
  //       currency: 'usd',
  //     });
  
  //     const menuItem = new MenuItemSchema({
  //       cook_id: cook._id,
  //       item_name: item_name,
  //       product_description: product_description,
  //       category: category,
  //       imageurls: imageurls,
  //       price: price,
  //       stripe_product_id: product.id, // Save the product ID in your database
  //       stripe_price_id: stripePrice.id, // Save the price ID in your database
  //     });
  
  //     await menuItem.save();
  //     res.json({
  //       status: 'SUCCESS',
  //       message: 'Menu item added successfully',
  //     });
  //   } catch (err) {
  //     res.json({
  //       status: 'FAILED',
  //       message: 'Error adding menu item',
  //       error: err,
  //     });
  //   }
  // });


  // router.post('/addmenuitem', upload.single('imageurls'), async (req, res) => {
  //   console.log(req.files);
  //   console.log(req.body);
  //   const cook = req.session.cook;
  
  //   if (!cook) {
  //     return res.json({
  //       status: 'FAILED',
  //       message: 'Not authorized to add menu items',
  //     });
  //   }
  
  //   const { item_name, product_description, price, category } = req.body;
  //   const imageurls = req.file ? req.file.path : null;
  
  //   try {
  //     const menuItem = new MenuItemSchema({
  //       cook_id: cook._id,
  //       item_name: item_name,
  //       product_description: product_description,
  //       category: category,
  //       imageurls: imageurls,
  //       price: price,
  //     });
  
  //     await menuItem.save();
  //     res.json({
  //       status: 'SUCCESS',
  //       message: 'Menu item added successfully',
  //     });
  //   } catch (err) {
  //     res.json({
  //       status: 'FAILED',
  //       message: 'Error adding menu item',
  //       error: err,
  //     });
  //   }
  // });
  

router.put("/editprofile", upload.single('profile_picture'), (req, res) => {
  console.log("req.body", req.body);
    const { cook_first_name, cook_last_name, description } = req.body;
    const profile_picture = req.file.filename;
    const cook = req.session.cook;
    console.log("cook", cook);
  
    if (cook) {
      Cook.updateOne(
        { _id: cook._id },
        {
          $set: {
            cook_first_name: cook_first_name,
            cook_last_name: cook_last_name,
            profile_picture: profile_picture,
            description: description
          },
        }
      )
        .then((result) => {
          req.session.cook.cook_first_name = cook_first_name;
          req.session.cook.cook_last_name = cook_last_name;
          req.session.cook.profile_picture = profile_picture;
          req.session.cook.description = description;

          console.log("result", result);
          res.json({
            status: "SUCCESS",
            message: "Profile updated successfully",
          });
        })
        .catch((err) => {
          res.json({
            status: "FAILED",
            message: "Error updating profile",
            error: err,
          });
        });
    } else {
      res.json({
        status: "FAILED",
        message: "Not authorized to edit profile",
      });
    }
  });

  router.post('/uploadprofilepicture', upload.single('profile_picture'), async (req, res) => {
    const cook = req.session.cook;
    
    if (cook) {
      const profile_picture = req.file.filename;
  
      try {
        await Cook.updateOne({ _id: cook._id }, { $set: { profile_picture } });
        res.json({
          status: 'SUCCESS',
          message: 'Profile picture uploaded successfully',
          imagePath: profile_picture,
        });
      } catch (err) {
        res.json({
          status: 'FAILED',
          message: 'Error uploading profile picture',
          error: err,
        });
      }
    } else {
      res.json({
        status: 'FAILED',
        message: 'Not authorized to upload profile picture',
      });
    }
  });

  
  router.post('/verify_cook', async (req, res) => {
    // Extract cook email from the request body
    const { cook_email } = req.body;
    if (!cook_email) {
      // Return error if cook email is not provided
      res.status(400).json({ success: false, message: 'Cook email is required' });
    } else {
      // Check if the cook email exists in the database
      const cook = await Cook.findOne({ email: cook_email });
      if (cook) {
        // Update the verified field of the cook to true
        await Cook.updateOne({ cook_email: cook_email },  {$set:{ verified: true }});
        // Return success message if cook email is found and verified is updated to true
        res.status(200).json({ success: true, message: 'Cook has been verified!' });
      } else {
        // Return error if cook email is not found in the database
        res.status(400).json({ success: false, message: 'Cook not found in the database' });
      }
    }
  });

  
  router.post('/documents', documentUpload.array('document'), async (req, res) => {
    try {
      const files = req.files;
      console.log('Console: ', req.files);
      const result = [];
      const cook = req.session.cook;
  
      const attachments = files.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
      }));
  
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: 'santosodigie104@gmail.com',
        subject: 'New Documents Uploaded',
        html: `Cook ${cook.cook_first_name} ${cook.cook_last_name} (ID: ${cook._id}) has uploaded new documents.`,
        attachments: attachments,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  
      res.json({ message: 'Documents uploaded successfully', data: result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload documents' });
    }
  });
  


  // router.put('/:id/applicationstatus', async (req, res) => {
  //   const { id } = req.params;
  //   const { application_status } = req.body;
  //   try {
  //     const cook = await Cook.findById(id);
  //     if (!cook) {
  //       return res.status(404).json({ error: 'Cook not found' });
  //     }
  //     if (!application_status) {
  //       return res.status(400).json({ error: 'Invalid application status' });
  //     }
  //     cook.application_status = application_status;
  //     await cook.save();
  //     res.json({ message: 'Application status updated successfully', data: cook });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ error: 'Failed to update application status' });
  //   }
  // });
  

  router.put('/:id/applicationstatus', async (req, res) => {
    const { id } = req.params;
    const { application_status, reason_for_decline } = req.body;
    try {
      const cook = await Cook.findById(id);
      if (!cook) {
        return res.status(404).json({ error: 'Cook not found' });
      }
      if (!application_status) {
        return res.status(400).json({ error: 'Invalid application status' });
      }
      console.log(cook.cook_email)
      cook.application_status = application_status;
      console.log(application_status, reason_for_decline);
      if (application_status === 'declined' && reason_for_decline) {
        const mailOptions = {
          from: process.env.AUTH_EMAIL,
          to: cook.cook_email,
          subject: 'Your application has been declined',
          text: `Dear ${cook.cook_first_name},\n\nWe regret to inform you that your application has been declined due to the following reason: ${reason_for_decline}.\n\nThank you for your interest in Find-A-Cook.\n\nBest regards,\nThe Find-A-Cook team`
        };
        console.log('Before transporter.sendMail');
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to send email' });
          } else {
            console.log(`Email sent: ${info.response}`);
            console.log("YO YO YO",info);
            res.json({ message: 'Application status updated successfully', data: cook });
          }
        });
        console.log('After transporter.sendMail');
      }

      if (application_status === 'approved') {
        const mailOptions = {
          from: process.env.AUTH_EMAIL,
          to: cook.cook_email,
          subject: "Your application has been approved",
          html: `<p>Congratulations! Your application has been approved. Please visit <a href='http://localhost:3000/subscription'>this page</a> to complete your registration.</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent successfully:", info.response);
          }
        });
      }
      await cook.save();
      res.json({ message: 'Application status updated successfully', data: cook });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update application status' });
    }
  });
  



  router.post('/dish', async (req, res) => {
    try {
      const cookId = req.session.cook;
      // const cook = req.session.cook;
  
      if (!cookId) {
        return res.json({
          status: 'FAILED',
          message: 'Not authorized to add menu items',
        });
      }
      // if (!cookId) {
      //   return res.status(401).json({ message: 'Unauthorized' });
      // }
  
      const { dish, dish_description, price, category } = req.body;
      const newDish = new MenuItemSchema({
        dish,
        dish_description,
        price,
        category,
        cook_id: cookId,
      });
  
      await newDish.save();
  
      // Find the cook and add the dish to their dishes array
      const cook = await Cook.findByIdAndUpdate(
        cookId,
        { $push: { dishes: newDish } },
        { new: true }
      );
  
      res.status(201).json(newDish);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  




  
  // router.post('/dish', async (req, res) => {
  //   const cook = req.session.cook;
  //   const { dish, dish_description, price, category } = req.body;
  //   console.log(dish, dish_description, price, category);
  //   if (!dish || !dish_description || !price || !category) {
  //     return res.json({
  //       status: 'FAILED',
  //       message: 'Missing required fields: dish, dish_description, price, or category',
  //     });
  //   }
  
  //   const menuItem = new MenuItemSchema({
  //     dish: dish,
  //     dish_description: dish_description,
  //     price: price,
  //     category: category,
  //   });
  
  //   try {
  //     const updateCook = await Cook.findByIdAndUpdate(
  //       cook._id,
  //       { $push: { dishes: menuItem } },
  //       { new: true }
  //     );
  
  //     res.json({
  //       status: 'SUCCESS',
  //       message: 'Menu item added successfully',
  //       updateCook: updateCook,
  //     });
  //   } catch (error) {
  //     res.json({
  //       status: 'FAILED',
  //       message: 'Error adding menu item',
  //       error: error,
  //     });
  //   }
  // });
  



  // router.post('/:cookId/dish', async (req, res) => {
  //   try {
  //     const dish = new MenuItemSchema(req.body);
  //     dish.cook_id = req.params.cookId;
  //     await dish.save();
  
  //     // Find the cook and add the dish to their dishes array
  //     const cook = await Cook.findByIdAndUpdate(
  //       req.params.cookId,
  //       { $push: { dishes: dish } },
  //       { new: true }
  //     );
  
  //     res.status(201).json(dish);
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // });


  // router.post('/dish', async (req, res) => {
  //   try {
  //     const cook = req.session.cook;
  //     const dish = new MenuItemSchema(req.body);
  //     dish.cook_id = req.params.cookId;
  //     await dish.save();
  
  //     // Find the cook and add the dish to their dishes array
  //     const updatedCook = await Cook.findByIdAndUpdate(
  //       req.params.cookId,
  //       { $push: { dishes: dish } },
  //       { new: true }
  //     );
  
  //     res.status(201).json(dish);
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // });


  router.get('/:cookId', async (req, res) => {
    try {
      // Find the cook by ID and populate their dishes
      const cook = await Cook.findById(req.params.cookId).populate('dishes');
      // Return the cook's dishes
      res.json(cook.dishes);
    } catch (error) {
      // Return an error message if there is an error
      res.status(400).json({ message: error.message });
    }
  });



  router.post('/searchcooks', async (req, res) => {
    // Get the type (cuisine, dish, or both) and search query from the request body
    const { type, query } = req.body;
  
    try {
      let cooks;
  
      switch (type) {
        case 'cuisine':
          // Find the menu category that matches the cuisine query
          const cuisine = await MenuCategorySchema.findOne({ category_name: { $regex: new RegExp(`^${query.toString()}$`, 'i') } });
          if (!cuisine) {
            // Return an empty response if the cuisine is not found
            return res.json({ cooks: [] });
          }
          // Find all cooks with the matching cuisine
          cooks = await Cook.find({ specialties: cuisine._id });
          console.log('Found cooks by cuisine:', cooks); // log the found cooks
          break;
        case 'dish':
          // Find all cooks with a dish that matches the dish query
          cooks = await Cook.find({ 'dishes.dish': { $regex: new RegExp(`${query.toString()}`, 'i') } });
          console.log('Found cooks by dish:', cooks); // log the found cooks
          break;
        case 'both':
          // Find all cooks with a dish or cuisine that matches the search query
          cooks = await Cook.find({
            $or: [
              { 'specialties': { $in: await MenuCategorySchema.find({category_name: {$regex: new RegExp(`${query}`, 'i')}}).select('_id') } },
              { 'dishes.dish': { $regex: new RegExp(`${query}`, 'i') } }
            ]
          });
          console.log('Found cooks by both:', cooks); // log the found cooks
          break;
      }
  
      // If no cooks were found, return an empty array
      if (!cooks.length) {
        return res.json({ cooks: [] });
      }
  
      // Return the found cooks
      res.json({ cooks });
    } catch (err) {
      console.log(err, 'filter Controller error');
      // Return an error message if there is an error
      res.status(500).json({
        errorMessage: 'Please try again later',
      });
    }
  });
  




// router.post('/searchcooks', async (req, res) => {
//   // Get the type (cuisine, dish, or both) and search query from the request body
//   const { type, query } = req.body;

//   try {
//     let cooks;

//     switch (type) {
//       case 'cuisine':
//         // Find the menu category that matches the cuisine query
//         const cuisine = await MenuCategorySchema.findOne({ category_name: { $regex: new RegExp(`^${query.toString()}$`, 'i') } });
//         if (!cuisine) {
//           // Return an empty response if the cuisine is not found
//           return res.json({ cooks: [] });
//         }
//         // Find all cooks with the matching cuisine
//         cooks = await Cook.find({ specialties: cuisine._id });
//         console.log('Found cooks by cuisine:', cooks); // log the found cooks
//         break;
//       case 'dish':
//         // Find all cooks with a dish that matches the dish query
//         cooks = await Cook.find({ 'dishes.dish': { $regex: new RegExp(`${query.toString()}`, 'i') } });
//         console.log('Found cooks by dish:', cooks); // log the found cooks
//         break;
//       case 'both':
//         // Find all cooks with a dish or cuisine that matches the search query
//         cooks = await Cook.find({
//           $or: [
//             { 'specialties': { $in: await MenuCategorySchema.find({category_name: {$regex: new RegExp(`${query}`, 'i')}}).select('_id') } },
//             { 'dishes.dish': { $regex: new RegExp(`${query}`, 'i') } }
//           ]
//         });
//         console.log('Found cooks by both:', cooks); // log the found cooks
//         break;
//     }

//     // If no cooks were found, return an empty array
//     if (!cooks.length) {
//       return res.json({ cooks: [] });
//     }

//     // Return the found cooks
//     res.json({ cooks });
//   } catch (err) {
//     console.log(err, 'filter Controller error');
//     // Return an error message if there is an error
//     res.status(500).json({
//       errorMessage: 'Please try again later',
//     });
//   }
// });


router.get('/categories', async (req, res) => {
  try {
    const categories = await MenuCategorySchema.find({});
    res.status(200).json(categories);
  } catch (err) {
    console.log('Category ReadAll Error: ', err);
    res.status(500).json({
      errorMessage: 'Please try again later',
    });
  }
});


router.get('/filterByCategory', async (req, res) => {
  try {
    let cooks;

    // Get the category from the query parameters
    const category = req.query.category;

    // If category is specified in the query parameters, filter by category
    if (category) {
      // Find the menu category that matches the category query
      const menuCategory = await MenuCategorySchema.findOne({ category_name: { $regex: new RegExp(`^${category.toString()}$`, 'i') } });

      // If the category is not found, return an empty response
      if (!menuCategory) {
        return res.json({ cooks: [] });
      }

      // Find all cooks with the matching category
      cooks = await Cook.find({ menu_categories: menuCategory._id });
      console.log('Found cooks by category:', cooks); // log the found cooks
    } else {
      // If category is not specified, return all cooks
      cooks = await Cook.find({});
      console.log('Found all cooks:', cooks); // log all found cooks
    }

    // If no cooks were found, return an empty array
    if (!cooks.length) {
      return res.json({ cooks: [] });
    }

    // Return the found cooks
    res.json({ cooks });
  } catch (err) {
    console.log(err, 'filter Controller error');
    // Return an error message if there is an error
    res.status(500).json({
      errorMessage: 'Please try again later',
    });
  }
});




// GET all cooks filtered by category
router.get('/getfiltercooks', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query = { specialties: mongoose.Types.ObjectId(category) };
    }
    const cooks = await CookSchema.find(query).populate('specialties', 'category_name');
    res.json({ cooks });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errorMessage: 'Please try again later',
    });
  }
});


router.get('/cooks', async (req, res) => {
  try {
    let cooks;

    // Get the category from the query parameters
    const category = req.query.category;

    // If category is specified in the query parameters, filter by category
    if (category) {
      // Find the menu category that matches the category query
      const menuCategory = await MenuCategorySchema.findOne({ category_name: { $regex: new RegExp(`^${category.toString()}$`, 'i') } });

      // If the category is not found, return an empty response
      if (!menuCategory) {
        return res.json({ cooks: [] });
      }

      // Find all cooks with the matching category
      cooks = await Cook.find({ specialties: menuCategory._id });
      console.log('Found cooks by category:', cooks); // log the found cooks
    } else {
      // If category is not specified, return all cooks
      cooks = await Cook.find({});
      console.log('Found all cooks:', cooks); // log all found cooks
    }

    // If no cooks were found, return an empty array
    if (!cooks.length) {
      return res.json({ cooks: [] });
    }

    // Return the found cooks
    res.json({ cooks });
  } catch (err) {
    console.log(err, 'filter Controller error');
    // Return an error message if there is an error
    res.status(500).json({
      errorMessage: 'Please try again later',
    });
  }
});





router.get('/menuitems', async (req, res) => {
  try {
    const cookId = req.session.cook._id; // Retrieve the cook ID from the session
    const menuItems = await MenuItemSchema.find({ cook: cookId }).populate('category'); // Find all menu items for the logged-in cook and populate the 'category' field
    res.json({ status: 'SUCCESS', menuItems: menuItems });
  } catch (error) {
    console.error('Error retrieving menu items', error);
    res.json({ status: 'ERROR', message: 'Error retrieving menu items' });
  }
});








router.get('/cooksByCategory', async (req, res) => {
  const { category } = req.query;
  try {
    const cooks = await Cook.find({ specialties: category });
    res.json({ cooks });
  } catch (error) {
    console.error("Error filtering cooks by category:", error);
    res.status(500).json({
      errorMessage: 'Please try again later',
    });
  }
});


router.post('/filtercooks', async (req, res) => {
  try {
    let cooks;
    const { category_name } = req.body;
    const category = await MenuCategorySchema.findOne({ category_name });
    if (!category) { // handle case where category is not found
      return res.status(404).json({ status: 'ERROR', message: 'Category not found' });
    }
    cooks = await Cook.find({ specialties: category._id });
    console.log('Found cooks by cuisine:', cooks); // log the found cooks
    res.status(200).json({ status: 'SUCCESS', cooks });
  } catch (error) {
    console.error('Error filtering cooks', error);
    res.status(500).json({ status: 'ERROR', message: 'Error filtering cooks' });
  }
});







router.post('/dishy', upload.single('imageurls'), async (req, res) => {
   
  const cook = req.session.cook;

  if (!cook) {
    return res.json({
      status: 'FAILED',
      message: 'Not authorized to add menu items',
    });
  }

  console.log('Request body:', req.body);
  const { dish, dish_description, price, category } = req.body;
  const imageurls = req.file.filename;
  console.log('New Dish: ', req.body)

  const product = await stripe.products.create({
    name: dish,
    type: 'good',
  });

  // Create a new price for the product in Stripe
  const stripePrice = await stripe.prices.create({
    product: product.id,
    unit_amount: price * 100, // Stripe requires the price in cents
    currency: 'eur',
  });
  try {

    let newDish = new MenuItemSchema({
      cook_id: cook._id,
      dish: dish,
      dish_description: dish_description,
      price: price,
      category: category,
      // imageurls: req.file ? req.file.path : null,
      stripe_product_id: product.id, // Save the product ID in your database
      stripe_price_id: stripePrice.id, // Save the price ID in your database
      imageurls: imageurls,
    })
    // dish.cook_id = cook._id;
    await newDish.save();

    // Find the cook and add the dish to their dishes array
    const updatedCook = await Cook.findByIdAndUpdate(
      cook._id,
      { $push: { dishes: newDish } },
      { new: true }
    );

    res.json({
      status: 'SUCCESS',
      message: 'Menu item added successfully',
      updatedCook: updatedCook,
    });
  } catch (err) {
    res.json({
      status: 'FAILED',
      message: 'Error adding menu item',
      error: err,
    });
  }
});





module.exports = router;
// router.post('cooklogout', (req, res) => {

// })