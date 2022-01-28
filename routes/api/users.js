const express=require("express")
const router=express.Router()
const gravatar=require("gravatar")
const bcrypt=require("bcryptjs")
const { check, validationResult}=require("express-validator")
const User=require('../../models/Users')

// @route post api/users
// @desc register user
// @access Public
router.post("/",[
    check("name","Name is require")
     .not()
     .isEmpty(),
    check("email","please include a valid email").isEmail(),
    check("password","please enter a password with 6 or more charactes").isLength({ min: 6 })

],
async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array)

        return res.status(400).json({ errors: errors.array() })
    }
    const { name,email,password } =req.body;
    try{
        let user=await User.findOne({ email });
        if(user){
            res.status(400).json({ errors: [{ msg:"User already exists"  }] });
        }
        const avatar=gravatar.url(email, {
            s:"200",
            r:"pg",
            d:"mm"
        })
        user=new User({
            name,
            email,
            avatar,
            password

        });
        const salt=await bcrypt.getSalt(10);
        user.password=await bcrypt.hash(password,salt);
         await user.save();
         res.send("User registered")


    

    // see if user exists
    // get users gravatar
    // encrypt password
    // return jsonwebtoken
    res.send('user route');

    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error")
        
}
})
module.exports=router