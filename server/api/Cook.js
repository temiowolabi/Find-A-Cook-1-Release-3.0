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
const upload2 = multer({ dest: '/uploads/' })
const storageTest = multer.memoryStorage();
const documentUpload = multer({ storage: storageTest });

// const upload = multer({ storage: storage });

router.get('/images/:key', (req, res) => {
  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
})

router.post('/images', upload2.single('image'), async (req, res) => {
  const file = req.file;
  console.log(file); // add this line to see if file is being received
  // apply filter
  // resize 

  const result = await uploadFile(file, 'images')
  await unlinkFile(file.path)
  console.log(result)
  const description = req.body.description
  res.send({imagePath: `/images/${result.Key}`})
});


// router.post('/documents', documentUpload.array('document'), async (req, res) => {
//   try {
//     const files = req.files;
//     console.log('Console: ',req.files);
//     const result = [];

//     const cookId = req.session.cook_id; // get the cookId from the session
//     console.log("COOK ID YALL",cookId);

//     for (const file of files) {
//       console.log("req.files:", req.files);
//       console.log("req.files.document:", req.files.document);
      
//       const filename = `${cookId}_${file.originalname}`; // include cookId in the filename
//       const uploadResult = await uploadToS3(file, 'document', filename); // pass the filename to the uploadToS3 function
//       result.push(uploadResult);
//     }

//     res.json({ message: 'Documents uploaded successfully', data: result });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to upload documents' });
//   }
// });



// const s3 = new aws.S3({
//   accessKeyId: process.env.S3_ACCESS_KEY,
//   secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//   region: process.env.S3_BUCKET_REGION,
// })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/tmp/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  // const documentUpload = (bucketName) => multer({
  //   storage: multerS3({
  //     s3,
  //     bucket: bucketName,
  //     metadata: function (req, file, cb) {
  //       cb(null, { fieldName: file.fieldName });
  //     },
  //     key: function (req, file, cb) {
  //       cb(null, Date.now().toString())
  //     }
  //   })
  // })
  

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
                cook_bio: "This is the cooks bio",
                description: "This is the cooks Description",
                date_joined: currentDate,
                specialties: [],
                verified: false,
                profile_picture: "profile picture",
                cook_address: "cooks address",
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
                if (!data[0].verified) {
                    res.json({
                        status: "FAILED",
                        message: "You have not been verified yet, please await a response from our team"
                    })
                } else {
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
                }
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
    console.log(req.session)
    const cook = req.session.cook;
    // console.log(cook);
    if(cook) {
        res.json({
            status: "SUCCESS",
            firstn: `${cook.cook_first_name}`,
            lastn: `${cook.cook_last_name}`,
            special: `${cook.specialties}`,
            descrip: `${cook.description}`,
            profile: `${cook.profile_picture}`,
            bio: `${cook.cook_bio}`,
            email: `${cook.cook_email}`
        })
    } else {
        res.json({
            status: "FAILED",
            message: "Error finding user"
        })
    }
});

router.get("/allcooks", async (req, res) => {
    try {
      const cooks = await Cook.find({}, { cook_first_name: 1, cook_last_name: 1, profile_picture: 1, application_status: 1, cook_bio: 1, description: 1, _id: 1,specialties: 1 });
  
      res.json({
        status: "SUCCESS",
        cooks: cooks,
      });
    } catch (err) {
      res.json({
        status: "FAILED",
        message: "Error retrieving cooks",
        error: err,
      });
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


  router.post('/addmenuitem', upload.single('imageurls'), async (req, res) => {
    console.log(req.files);
    console.log(req.body);
    const cook = req.session.cook;
  
    if (!cook) {
      return res.json({
        status: 'FAILED',
        message: 'Not authorized to add menu items',
      });
    }
  
    const { item_name, product_description, price, category } = req.body;
    const imageurls = req.file ? req.file.path : null;
  
    try {
      const menuItem = new MenuItemSchema({
        cook_id: cook._id,
        item_name: item_name,
        product_description: product_description,
        category: category,
        imageurls: imageurls,
        price: price,
      });
  
      await menuItem.save();
      res.json({
        status: 'SUCCESS',
        message: 'Menu item added successfully',
      });
    } catch (err) {
      res.json({
        status: 'FAILED',
        message: 'Error adding menu item',
        error: err,
      });
    }
  });
  

router.put("/editprofile", (req, res) => {
    const { cook_first_name, cook_last_name, specialties, description, profile_picture, cook_bio } = req.body;
    const cook = req.session.cook;
  
    if (cook) {
      Cook.updateOne(
        { _id: cook._id },
        {
          $set: {
            cook_first_name: cook_first_name,
            cook_last_name: cook_last_name,
            specialties: specialties,
            description: description,
            profile_picture: profile_picture,
            cook_bio: cook_bio,
          },
        }
      )
        .then((result) => {
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
      const profile_picture = req.file.path;
  
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
      console.log('Console: ',req.files);
      const result = [];
      const cook = req.session.cook;
      const fromEmail = cook.cook_email;
      const from = `Your Cooks <${fromEmail}>`;
  
      for (const file of files) {
        console.log("req.files:", req.files);
        console.log("req.files.document:", req.files.document);
        
        const filename = `${cook._id}_${file.originalname}`; // include cookId in the filename
        const uploadResult = await uploadToS3(file, 'document', filename); // pass the filename to the uploadToS3 function
        result.push(uploadResult);


        const mailOptions = {
          from,
          to: 'temiowolabi8@gmail.com',
          subject: 'New Document Uploaded',
          html: `Cook ${cook.cook_first_name} ${cook.cook_last_name} (ID: ${cook._id}) has uploaded a new document: ${filename}`,
          attachments: req.files.map(file => ({
            filename: file.originalname,
            content: file.buffer
          }))
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      
      }
  
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
  
  
  

module.exports = router;
// router.post('cooklogout', (req, res) => {

// })