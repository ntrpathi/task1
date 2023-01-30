const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
dotenv.config({ path: '../config.env' })
const jwt = require("jsonwebtoken")
const userRegister = require('../models/user');
const customer = require('../models/customer')


router.get('/', (req, res) => {
    res.send('hi from the Home page')
});
// jwt kaha installed h?, token generate

// For REGISTRATIOIN OF NEW USERS


router.post('/signUp', async (req, res) => {
    const { FirstName, LastName, email, phone, password, cPassword } = req.body;



    try {
        if (!FirstName || !LastName || !email || !phone || !password || !cPassword) {
            res.send('please fill all the information to signUp')
        }
        const userLogin = await userRegister.findOne({ email: email })
        if (userLogin) {

            res.send('email id already exist')
        } else if (password != cPassword) {

            res.send('password does not match')
        } else {

            const user = new userRegister({ FirstName, LastName, email, phone, password, cPassword })
            const userRgst = await user.save()

            if (userRgst) {
                res.send('registration sucessfull')

            }
        }


    } catch (err) {
        res.send(err);
    }
})


// FOR LOGIN OF EXISTING USERS

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.send('fill all the given fields properly')
    }

    try {
        const userLogin = await userRegister.findOne({ email: email })
        if (!userLogin) {

            res.send('invalid credentials')
        } else {

            const isMatch = await bcrypt.compare(password, userLogin.password)

            const token = await userLogin.generateAuthToken();
            console.log(token);



            if (!isMatch) {
                res.send('invalid credentials')
            } else {
                res.send(token)
            }
        }



    } catch (err) {
        console.log(err)
    }
})

// for saving customer details

router.post("/customer", async (req, res) => {
    try {
        // run kr isme hit kr

        let token = req.headers.authorization
        token = token.split(" ")[1]
       
        if (!token) {
            res.send({ msg: "token not provided !" })
        }

        const tokenVerify = jwt.verify(token, process.env.SECRET_KEY)
        console.log(tokenVerify)
        if (tokenVerify._id) {
            const { FirstName, LastName, company, products } = req.body
            const user = tokenVerify._id
            if (!FirstName || !LastName || !company || !products) {
                res.send("fill all the fields properly")
            } else {
                const customers = new customer({user, FirstName, LastName, company, products })
                const customerAdded = await customers.save()

                if (customerAdded) {
                    res.send("customer added sucessfully")
                }

            }

        } else {
            res.send("token invalid !")
        }


    } catch (err) {
        console.log(err)
    }
})

module.exports = router