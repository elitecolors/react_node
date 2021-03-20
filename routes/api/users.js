const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt= require('bcryptjs');
const  jwt = require('jsonwebtoken');
const config = require('config');
const  User= require('../../models/User');
const {check, validationResult} = require('express-validator');
// @route   Post api/users
// @desc    add user
// @access  Public
router.post('/',[
    check('name','Name is required')
        .not()
        .isEmpty(),
    check('email','Email invalid')
        .isEmail(),
    check('password','Passwod invalid')
        .isLength({min: 6})
],async (req, res)=> {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {name,email,password} = req.body;

    try {
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({errors: [{msg: 'User exist'}]});
        }
        const  avatar= gravatar.url(email,{
           s: '200',
           r: 'pg',
           d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        const salt= await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);

        await  user.save();

        const payload= {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 36000000},
            (err,tocken)=>{
                if(err) throw err;
                res.json({tocken});

            }
        )

    }catch (err){
        console.error(err.message);
        res.status(500).send('server error');
    }

} );

module.exports = router;