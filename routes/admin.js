const express = require("express");
const passport = require("passport");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Vendeur= require("../models/Vendeur");
const Commande= require("../models/Commande");
const Produit= require("../models/Produit");
const Depot=require("../models/Depot");
const Rapport=require("../models/Rapport");
const Fournisseur=require("../models/Foiurnisseur");
function generateToken(admin) {
  return jwt.sign({ id: admin._id, username: admin.username }, 'your_secret_key', { expiresIn: '1h' });
}

passport.serializeUser(function (admin, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: admin._id,
            username: admin.username
        });
    });
});

passport.deserializeUser(function (admin, cb) {
    process.nextTick(function () {
        return cb(null, admin);
    });
});

router.post("/createadmin", async (req, res) => {
    try {
        const { username, password, email } = req.body;

      
        if (!username || !password || !email) {
            return res.status(400).send("Missing required fields");
        }

        const newAdmin = new Admin({ username, email });

        await Admin.register(newAdmin, password);

        
        passport.authenticate("local-admin")(req, res, () => {
            res.send("Admin created successfully");
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.post("/loginadmin", async (req, res) => {
  try {
      const { username, password } = req.body;

      const admin = await Admin.findByUsername(username);

      if (!admin) {
          return res.status(404).send("Admin not found");
      }

      await admin.authenticate(password, (err, user, info) => {
          if (err || !user) {
              return res.status(401).send("Unauthorized");
          }

          req.login(user, { session: false }, async (err) => {
              if (err) {
                  return res.status(500).send("Internal Server Error");
              }

              const token = generateToken(user);
              return res.json({ token });
          });
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
      if (err) {
          return res.status(401).json({ error: 'ss' });
      }
      req.userId = decoded.id;
      next();
  });
}
router.post("/createvendeur", async (req, res) => {
  try {
      const { username, password, email,nom,prenom,cin ,tel} = req.body;
      console.log(req.body);
    
      if (!username || !password || !email) {
          return res.status(400).send("Missing required fields");
      }

      const newVendeur = new Vendeur({ username, email, nom,prenom,cin,tel});

      await Vendeur.register(newVendeur, password);

      
      passport.authenticate("local-vendeur")(req, res, () => {
          res.send("vendeur created successfully");
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});
router.patch("/updatefournisseur/:id", async (req, res) => {
  try {
    const { nom, email, adresse } = req.body;
    const updatedFournisseur = await Fournisseur.findByIdAndUpdate(req.params.id, { nom, email, adresse }, { new: true });
    res.status(200).json(updatedFournisseur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/deletefournisseur/:id", async (req, res) => {
  try {
    const deletedFournisseur = await Fournisseur.findByIdAndDelete(req.params.id);
    if (!deletedFournisseur) {
      return res.status(404).json({ message: "Fournisseur not found" });
    }
    res.status(200).json({ message: "Fournisseur deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/updatevendeur/:id", async (req, res) => {
  try {
    const { nom, prenom, cin, tel, email, username, password } = req.body;
    const updatedVendeur = await Vendeur.findByIdAndUpdate(req.params.id, { nom, prenom, cin, tel, email, username, password }, { new: true });
    res.status(200).json(updatedVendeur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete("/deletevendeur/:id", async (req, res) => {
  try {
    const deletedVendeur = await Vendeur.findByIdAndDelete(req.params.id);
    if (!deletedVendeur) {
      return res.status(404).json({ message: "Vendeur not found" });
    }
    res.status(200).json({ message: "Vendeur deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/updatedepot/:id", async (req, res) => {
  try {
    const { nom, adresse, nomresponsable,capaciteMax } = req.body;
    const updatedDepot = await Depot.findByIdAndUpdate(req.params.id, { nom, adresse, nomresponsable,capaciteMax }, { new: true });
    res.status(200).json(updatedDepot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/deletedepot/:id", async (req, res) => {
  try {
    const deletedDepot = await Depot.findByIdAndDelete(req.params.id);
    if (!deletedDepot) {
      return res.status(404).json({ message: "Depot not found" });
    }
    res.status(200).json({ message: "Depot deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/profileadmin/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (admin) {
      res.status(200).send(admin);
    } else {
      res.status(404).send('No Admin found');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});
router.post('/ajoutfournisseur', async (req, res) => {
  try {
    // Destructure the required fields from the request body
    const { nom, email, adresse } = req.body;

    // Create a new fournisseur instance
    const newFournisseur = new Fournisseur({
      nom,
      email,
      adresse
    });

    // Save the new fournisseur to the database
    const savedFournisseur = await newFournisseur.save();

    // Respond with the saved fournisseur object
    res.status(201).json(savedFournisseur);
  } catch (error) {
    // Handle errors
    res.status(400).json({ message: error.message });
  }
});

router.get("/logout",(req,res)=>{
  req.logout((err)=>{
      if (err){console.log(err);}
      else {res.send("logout with succes");}
  });
  
  });

  router.post('/ajoutdepots', async (req, res) => {
    try {
      // Destructure the required fields from the request body
      console.log(req.body);
      const { nom, adresse, nomresponsable,capaciteMax } = req.body;
  
      // Create a new depot instance
      const newDepot = new Depot({
        nom,
        adresse,
        nomresponsable,
        capaciteMax
      });
  
      // Save the new depot to the database
      const savedDepot = await newDepot.save();
  
      // Respond with the saved depot object
      res.status(201).json(savedDepot);
    } catch (error) {
      // Handle errors
      res.status(400).json({ message: error.message });
    }
  });
router.get("/touslesproduits",async(req,res)=>{
let touslesproduits= await Produit.find();
if (touslesproduits){
  res.send(touslesproduits);
}
else{
  res.send("something went wrong");
}
});
router.get("/touslesfournisseurs",async(req,res)=>{
  let touslesfournisseurs= await Fournisseur.find();
  if (touslesfournisseurs){
    res.send(touslesfournisseurs);
  }
  else{
    res.send("something went wrong");
  }
  });
router.get("/touslesvendeurs",async(req,res)=>{
  let touslesvendeurs= await Vendeur.find();
  if (touslesvendeurs){
    res.send(touslesvendeurs);
  }
  else{
    res.send("something went wrong");
  }
  });

    router.get("/touslesdepots",async(req,res)=>{
      let touslesdepots= await Depot.find();
      if (touslesdepots){
        res.send(touslesdepots);
      }
      else{
        res.send("something went wrong");
      }
      });   
module.exports = router;
