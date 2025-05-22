import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2';
import session from 'express-session';
import db from './db.js';

class Authentication {
    constructor(app) {
        const GOOGLE_CLIENT_ID = "1087925047717-ffjvnfrc7dtq1us5plo9m3qnvuq4vkno.apps.googleusercontent.com";
        const GOOGLE_CLIENT_SECRET = "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";

        app.use(session({
            secret: "secret",
            resave: false,
            saveUninitialized: true,
        }));

        app.use(passport.initialize()); // init passport on every route call
        app.use(passport.session());

        passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
            passReqToCallback: true
        }, this.verifyIdentity));

        passport.serializeUser((user, done) => done(null, user));
        passport.deserializeUser((user, done) => done(null, user));
    }

     verifyIdentity = async (request, accessToken, refreshToken, profile, done) => {
        
        try {
            const collection = db.collection("Usuarios");
            const existingUser = await collection.findOne({ id: profile.id });
            if (!existingUser) {
                await collection.insertOne({
                    id: profile.id,
                    name: profile.displayName,
                    email: profile.email,
                    photo: profile.picture
                });
            }

            return done(null, profile);
        } catch (err) {
            console.error("Error guardando usuario en MongoDB:", err);
            return done(err);
        }
    }



    checkAuthenticated(req, res, next) {        
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    }
}

export default Authentication;