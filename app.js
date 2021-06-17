//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportlocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// mongoose.connect("mongodb://localhost:27017/examDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
// });
mongoose.connect("mongodb+srv://admin-eric:adeline@cluster0.cdksd.mongodb.net/exam2DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
mongoose.set('useFindAndModify', false);


const userSchema = new mongoose.Schema({
    fullname: String,
    username: String,
    password: String,
    email: String,
    osce_started: Boolean,
    osce_completed: Boolean,
    osce_starttime: String,
    osce_answer: Array,
    osce_mark: Array,
    rapid_started: Boolean,
    rapid_completed: Boolean,
    rapid_answer: Array,
    rapid_starttime: String,
    rapid_mark: Array
});

userSchema.plugin(passportlocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
    let time = new Date();
    if (req.query.type === "quiz") {
        if (req.isAuthenticated()) {
            let time = new Date().getTime();

            if (req.user.osce_starttime == "refresh") {
                User.findOneAndUpdate({
                        username: req.user.username
                    }, {
                        $set: {
                            osce_started: true,
                            osce_starttime: time
                        }
                    },
                    function (error, success) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(success);
                            res.render("quiz", {
                                fullname: req.user.fullname,
                                userData: req.user,
                                quiz: req.query.quiz,
                                starttime: req.user.osce_starttime
                            });
                        }
                    });

            } else {
                res.render("quiz", {
                    fullname: req.user.fullname,
                    userData: req.user,
                    quiz: req.query.quiz,
                    starttime: req.user.starttime
                });
            }


        } else {
            res.redirect("/login");
        }
    } else if (req.query.type === "rapid") {
        if (req.isAuthenticated()) {
            let time = new Date().getTime();

            if (req.user.rapid_starttime == "refresh") {
                User.findOneAndUpdate({
                        username: req.user.username
                    }, {
                        $set: {
                            rapid_started: true,
                            rapid_starttime: time
                        }
                    },
                    function (error, success) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(success);
                            res.render("rapid", {
                                fullname: req.user.fullname,
                                userData: req.user,
                                quiz: req.query.quiz,
                                starttime: req.user.starttime
                            });
                        }
                    });

            } else {
                console.log(req.query.type);
                res.render("rapid", {
                    fullname: req.user.fullname,
                    userData: req.user,
                    quiz: req.query.quiz,
                    starttime: req.user.starttime
                });
            }


        } else {
            res.redirect("/login");
        }

    } else {
        if (req.isAuthenticated()) {
            res.render("userpage", {
                userData: req.user,
                fullname: req.user.fullname,
            });
        } else {
            res.render("login");
        }
    }

});


// app.get("/", function (req, res) {
//     let time = new Date();

//     if (time.toDateString() === "Thu Jun 17 2021") {
//         if (req.query.type === "quiz") {
//             if (req.isAuthenticated()) {
//                 let time = new Date().getTime();

//                 if (req.user.osce_starttime == "refresh") {
//                     User.findOneAndUpdate({
//                             username: req.user.username
//                         }, {
//                             $set: {
//                                 osce_started: true,
//                                 osce_starttime: time
//                             }
//                         },
//                         function (error, success) {
//                             if (error) {
//                                 console.log(error);
//                             } else {
//                                 console.log(success);
//                                 res.render("quiz", {
//                                     fullname: req.user.fullname,
//                                     userData: req.user,
//                                     quiz: req.query.quiz,
//                                     starttime: req.user.osce_starttime
//                                 });
//                             }
//                         });

//                 } else {
//                     res.render("quiz", {
//                         fullname: req.user.fullname,
//                         userData: req.user,
//                         quiz: req.query.quiz,
//                         starttime: req.user.starttime
//                     });
//                 }


//             } else {
//                 res.redirect("/login");
//             }
//         } else if (req.query.type === "rapid") {
//             if (req.isAuthenticated()) {
//                 let time = new Date().getTime();

//                 if (req.user.rapid_starttime == "refresh") {
//                     User.findOneAndUpdate({
//                             username: req.user.username
//                         }, {
//                             $set: {
//                                 rapid_started: true,
//                                 rapid_starttime: time
//                             }
//                         },
//                         function (error, success) {
//                             if (error) {
//                                 console.log(error);
//                             } else {
//                                 console.log(success);
//                                 res.render("rapid", {
//                                     fullname: req.user.fullname,
//                                     userData: req.user,
//                                     quiz: req.query.quiz,
//                                     starttime: req.user.starttime
//                                 });
//                             }
//                         });

//                 } else {
//                     console.log(req.query.type);
//                     res.render("rapid", {
//                         fullname: req.user.fullname,
//                         userData: req.user,
//                         quiz: req.query.quiz,
//                         starttime: req.user.starttime
//                     });
//                 }


//             } else {
//                 res.redirect("/login");
//             }

//         } else {
//             if (req.isAuthenticated()) {
//                 res.render("userpage", {
//                     userData: req.user,
//                     fullname: req.user.fullname,
//                 });
//             } else {
//                 res.render("login");
//             }
//         }
//     } else {
//         res.render("index")
//     }


// });

app.get("/login", function (req, res) {
    res.render("login");
});



app.get("/userpage", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("userpage", {
            userData: req.user,
            fullname: req.user.fullname,
        });
    } else {
        res.redirect("login");
    }
})

app.get("/secret1234", function (req, res) {
    res.render("register");
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});

app.get("/marking", (req, res) => {
    res.render("marking");
});

app.get('/userlist', function(req, res) {
    User.find({}, function(err, users) {

        const myJSON = JSON.stringify(users); 
        res.render('userlist', {users: myJSON});
    });
});

app.post("/register", (req, res) => {
    User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err) {
            console.log(err);;
        }
        if (user) {
            return res.render('register', {
                message: "User already exist, pick another username"
            })
        } else {
            User.register({
                fullname: req.body.fullname,
                username: req.body.username,
                email: req.body.email,
                osce_started: false,
                osce_completed: false,
                osce_starttime: "refresh",
                osce_answer: [],
                osce_mark: [],
                rapid_started: false,
                rapid_completed: false,
                rapid_answer: [],
                rapid_starttime: "refresh",
                rapid_mark: []
            }, req.body.password, (err, user) => {
                if (err) {
                    console.log(err);
                    res.redirect("/register");
                } else {
                    passport.authenticate("local")(req, res, () => {
                        res.redirect("/userpage");
                    });
                }
            });
        }
    });
});


app.post("/login", (req, res, next) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // *** Display message without using flash option
            // re-render the login form with a message
            return res.render('login', {
                messagelogin: info.message
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/userpage");
        });
    })(req, res, next);
});

app.post("/osce", (req, res) => {

    let answer_list = {
        "question_1A": req.body.question_1A,
        "question_1B": req.body.question_1B,
        "question_1C": req.body.question_1C,
        "question_1D": req.body.question_1D,
        "question_1E": req.body.question_1E,
        "question_2A": req.body.question_2A,
        "question_2B": req.body.question_2B,
        "question_2C": req.body.question_2C,
        "question_2D": req.body.question_2D,
        "question_3A": req.body.question_3A,
        "question_3B": req.body.question_3B,
        "question_3C": req.body.question_3C,
        "question_3D": req.body.question_3D,
        "question_4A": req.body.question_4A,
        "question_4B": req.body.question_4B,
        "question_4C": req.body.question_4C,
        "question_4D": req.body.question_4D,
        "question_4E": req.body.question_4E,
        "question_5A": req.body.question_5A,
        "question_5B": req.body.question_5B,
        "question_5C": req.body.question_5C,
        "question_5D": req.body.question_5D,
        "question_6A": req.body.question_6A,
        "question_6B": req.body.question_6B,
        "question_6C": req.body.question_6C,
        "question_6D": req.body.question_6D,
        "question_7A": req.body.question_7A,
        "question_7B": req.body.question_7B,
        "question_7C": req.body.question_7C,
        "question_7D": req.body.question_7D,
        "question_7E": req.body.question_7E,
        "question_8A": req.body.question_8A,
        "question_8B": req.body.question_8B,
        "question_8C": req.body.question_8C,
        "question_8D": req.body.question_8D,
        "question_9A": req.body.question_9A,
        "question_9B": req.body.question_9B,
        "question_9C": req.body.question_9C,
        "question_9D": req.body.question_9D,
        "question_9E": req.body.question_9E,
        "question_10A": req.body.question_10A,
        "question_10B": req.body.question_10B,
        "question_10C": req.body.question_10C,
        "question_10D": req.body.question_10D,
        "question_11A": req.body.question_11A,
        "question_11B": req.body.question_11B,
        "question_11C": req.body.question_11C,
        "question_11D": req.body.question_11D,
        "question_11E": req.body.question_11E,
        "question_12A": req.body.question_12A,
        "question_12B": req.body.question_12B,
        "question_12C": req.body.question_12C,
        "question_12D": req.body.question_12D,
        "question_12E": req.body.question_12E,
        "question_13A": req.body.question_13A,
        "question_13B": req.body.question_13B,
        "question_13C": req.body.question_13C,
        "question_13D": req.body.question_13D,
        "question_14A": req.body.question_14A,
        "question_14B": req.body.question_14B,
        "question_14C": req.body.question_14C,
        "question_14D": req.body.question_14D,
        "question_14E": req.body.question_14E,
        "question_15A": req.body.question_15A,
        "question_15B": req.body.question_15B,
        "question_15C": req.body.question_15C,
        "question_15D": req.body.question_15D,
        "question_15E": req.body.question_15E,
        "question_16A": req.body.question_16A,
        "question_16B": req.body.question_16B,
        "question_16C": req.body.question_16C,
        "question_16D": req.body.question_16D,
        "question_16E": req.body.question_16E,
        "question_17A": req.body.question_17A,
        "question_17B": req.body.question_17B,
        "question_17C": req.body.question_17C,
        "question_17D": req.body.question_17D,
        "question_18A": req.body.question_18A,
        "question_18B": req.body.question_18B,
        "question_18C": req.body.question_18C,
        "question_18D": req.body.question_18D,
        "question_18E": req.body.question_18E,
        "question_19A": req.body.question_19A,
        "question_19B": req.body.question_19B,
        "question_19C": req.body.question_19C,
        "question_19D": req.body.question_19D,
        "question_19E": req.body.question_19E,
        "question_20A": req.body.question_20A,
        "question_20B": req.body.question_20B,
        "question_20C": req.body.question_20C,
        "question_20D": req.body.question_20D,
        "question_20E": req.body.question_20E,
    };
    User.findOneAndUpdate({
            username: req.body.username
        }, {
            $set: {
                osce_completed: true,
            },
            $push: {
                osce_answer: answer_list
            }
        },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
                res.redirect("/userpage");
            }
        });

});

app.post("/rapid", (req, res) => {

    let answer_list = {
        "question_1": req.body.question_1,
        "question_2": req.body.question_2,
        "question_3": req.body.question_3,
        "question_4": req.body.question_4,
        "question_5": req.body.question_5,
        "question_6": req.body.question_6,
        "question_7": req.body.question_7,
        "question_8": req.body.question_8,
        "question_9": req.body.question_9,
        "question_10": req.body.question_10,
        "question_11": req.body.question_11,
        "question_12": req.body.question_12,
        "question_13": req.body.question_13,
        "question_14": req.body.question_14,
        "question_15": req.body.question_15,
        "question_16": req.body.question_16,
        "question_17": req.body.question_17,
        "question_18": req.body.question_18,
        "question_19": req.body.question_19,
        "question_20": req.body.question_20,
        "question_21": req.body.question_21,
        "question_22": req.body.question_22,
        "question_23": req.body.question_23,
        "question_24": req.body.question_24,
        "question_25": req.body.question_25
    };
    User.findOneAndUpdate({
            username: req.body.username
        }, {
            $set: {
                rapid_completed: true,
            },
            $push: {
                rapid_answer: answer_list
            }
        },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
                res.redirect("/userpage");
            }
        });

});

app.post("/askanswer", (req, res) => {

    User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err) {
            console.log(err);;
        }
        if (user) {
            res.render("report", {
                userData: user,
                osceanswer: JSON.stringify(user.osce_answer),
                rapidanswer: JSON.stringify(user.rapid_answer)
            });
        } else {
            return res.render('marking', {
                message: "User does not exist, pick another username"
            })
        }
    });
});



app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running at port 3000`);

});