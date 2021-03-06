const express = require('express');
const router = express.Router();
const bcrypt= require('bcryptjs');
const {check, validationResult} = require('express-validator');
const  jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');
const auth = require('../../middleware/auth');
// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/',auth,async (req, res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch (err){
        console.error(err.message);
        res.status(500).send('Server eror auth');
    }
} );


// @route   Post api/auth
// @desc    Authenicate user and get token
// @access  Public
router.post('/',[
    check('email','Email invalid')
        .isEmail(),
    check('password','Passwod required')
        .exists()
],async (req, res)=> {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {email,password} = req.body;

    try {
        let user = await User.findOne({email});
        if(!user){
            return res
                .status(400)
                .json({errors: [{msg: 'Invalid credentials'}]});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res
                .status(400)
                .json({errors: [{msg: 'Invalid credentials'}]});
        }

        const payload= {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 36000000},
            (err,token)=>{
                if(err) throw err;
                res.json({token});

            }
        )

    }catch (err){
        console.error(err.message);
        res.status(500).send('server error');
    }

} );


module.exports = router;