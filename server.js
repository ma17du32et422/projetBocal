const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');

const app = express();
const port = process.env.PORT || 3000;


const flash = require("express-flash")
const session = require("express-session")
const passport = require("passport")
const bcrypt = require("bcrypt")

var bodyParser = require('body-parser');
app.use(bodyParser.json());


app.use(expressLayouts);
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
const users = []
app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(require('express-session')({ secret: 'qc libre', resave: true, saveUninitialized: true }));
app.use(passport.initialize())
app.use(passport.session())

const initializePassport = require("../ProjetBocal/passport-config");
const { unset } = require('lodash');
initializePassport(
  passport, 
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)
app.post("/register", async (req, res, next) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        username: req.body.username,
        email: req.body.userEmail,
        password: hashedPassword
      })
      res.redirect("/login")
    } catch {
      res.redirect("/register")
    }
    console.log(users)
  })

  app.post("/login", passport.authenticate("local", {
    successRedirect: "/portail",
    failureRedirect: "/login",
    badRequestMessage: "sike that's the wrong number",
    failureFlash: true
  }))


 
  var output = "heheheha"
  var listeAvis = []

  app.get('/portail', (req, res, next) => {
    res.render('portail', { page: 'portail', matricule:output });
  });
  app.post("/portail", async (req, res, next) => {
    //Set matricule
    try {
      var u = req.body.username
       var findUser = users.find(c => c.username == u)
       
       if (findUser == undefined) {
         output = "Utilisateur non d??fini"
       }
       else {
        output = findUser.username
       }
      console.log(output);
      res.redirect({matricule: output}, "/portail")
        res.render('portail', { page: 'portail', matricule:output });
    } catch {
      res.redirect("/portail")
    }
      //Ajouter avis
      var avis = req.body.avis
    if (avis != undefined) {
      const index = users.findIndex(object => {
        return object.username === u;
      });
      
      if (index !== -1) {
        users[index].avis = avis
      }
      if (avis != "") {
        d = new Date()
      listeAvis.push(avis)
      console.log(avis)
      console.log(listeAvis)
    }
    }

      // Supprimer avis
      var deleteAvis = req.body.deleteAvis
    if (deleteAvis != undefined) {
      const index = users.findIndex(object => {
        return object.username === u;
      });
      
      /*if (index !== -1) {
        users[index].avis = "R??cemment supprim??"
      }*/
      if (deleteAvis != "") {
      
        let index = listeAvis.indexOf(deleteAvis);
        console.log(listeAvis[1])
        console.log(listeAvis.indexOf(deleteAvis))
        listeAvis.splice(index, 1);
      
      console.log(users)
      console.log(listeAvis)
    }
    // delete listeAvis[1]
    }
    
  })
  

  app.post("/portail#", async (req, res, next) => {


  })

app.use(express.static(`${__dirname}/public`));

app.use('/', indexRouter);

app.use((req, res, next) => {
    res.status(404).render('404', { page: 'Page not found' });
});

app.listen(port, console.log(`Server is listening at port ${port}.`));
