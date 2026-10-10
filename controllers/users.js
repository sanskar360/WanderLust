const User = require("../models/users");


// Signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


// Signup
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({
            email,
            username
        });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash(
                "success",
                "Registration Successful! Welcome To Wanderlust"
            );

            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


// Login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


// Login
module.exports.login = async (req, res) => {
    req.flash("success", "Login Successful");

    res.redirect(res.locals.redirectUrl || "/listings");
};


// Logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    });
};