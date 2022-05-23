const localStrategy = require("passport-local")
const { Authenticator } = require("passport/lib")
const bcrypt = require("bcrypt")

function initialize(passport, getUserByUsername, getUserById) {
    const AuthenticateUser = async (username, password, done) => {
        const user = getUserByUsername(username)
        if (user == null) {
            return done(null, false, { message: "Aucun utilisateur trouvé"})
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: "Mot de passe erroné"})
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new localStrategy({ usernameField: "username"},
    AuthenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) =>  {
        return done(null, getUserById(id))
    })
}
// Rendu à 27:30
module.exports = initialize