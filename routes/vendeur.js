const express = require("express");
const passport = require("passport");
const router = express.Router();
const Vendeur= require("../models/Vendeur");
const jwt=require("jsonwebtoken");
const Commande =require("../models/Commande");
const Produit=require("../models/Produit");
const { default: axios } = require("axios");
function generateToken(admin) {
    return jwt.sign({ id: admin._id, username: admin.username }, 'your_secret_key', { expiresIn: '1h' });
  }
passport.serializeUser(function (vendeur, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: vendeur._id,
            username: vendeur.username
        });
    });
});

passport.deserializeUser(function (vendeur, cb) {
    process.nextTick(function () {
        return cb(null, vendeur);
    });
});
router.get('/produits', async (req, res) => {
    try {
        // Fetching all Produit items from the database
        const produits = await Produit.find();

        // Sending back the fetched Produit items as response
        res.json(produits);
    } catch (error) {
        // Handling errors
        res.status(500).json({ message: error.message });
    }
});
router.get('/produits/:code', async (req, res) => {
    try {
        const code = req.params.code; // Extract the code from the request parameters

        // Fetching the product from the database based on the provided code
        const produit = await Produit.findOne({ code: code });

        // If product not found, return 404
        if (!produit) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Sending back the product as response
        res.json(produit);
    } catch (error) {
        // Handling errors
        res.status(500).json({ message: error.message });
    }
});
router.post('/ajoutproduits', async (req, res) => {
    try {
        console.log(req.body);
        const { nom, prix, codeBarre, quantite, description } = req.body;

        // Check if a product with the same codeBarre already exists
        const existingProduit = await Produit.findOne({ code: codeBarre });
        if (existingProduit) {
            return res.status(400).json({ message: "Un produit avec le même code barre existe déjà." });
        }

        // Creating a new Produit instance
        const nouveauProduit = new Produit({
            nom,
            prix,
            code: codeBarre,
            description,
            quantiteStock: quantite,
            quantiteVendu: 0
        });

        // Saving the new Produit to the database
        const savedProduit = await nouveauProduit.save();

        // Sending back the saved Produit as response
        res.status(201).json(savedProduit);
    } catch (error) {
        // Handling errors
        res.status(400).json({ message: error.message });
    }
});

// Delete route for deleting a product by its ID
router.delete("/deleteproduit/:id", async (req, res) => {
  try {
    // Find the product by ID and delete it
    await Produit.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/touslescommandes/:id",async(req,res)=>{
     let id= req.params.id;
     let commandes= await Commande.find({idvendeur:id});
     if (commandes){
        res.status(200).json(commandes);
     }
     else {
        res.send("an error happened");
     }

});
router.post("/ajoutcommande", async (req, res) => {
    const { produits, idvendeur, date, nom ,montanttotal} = req.body;
    console.log(produits);
    try {
        const commande = new Commande({
            produits,
            idvendeur,
            nomVendeur: nom,
            date: date,
            montanttotal
        });

        for (const product of produits) {
            const produit = await Produit.findOne({ code: product.codeBarre });
            if (!produit) {
                return res.status(404).json({ message: `Product with code ${product.code} not found` });
            }

            produit.quantiteStock = produit.quantiteStock - product.quantite;
            produit.quantiteVendu = Number(produit.quantiteVendu) + Number(product.quantite);
            console.log(produit);
            await produit.save();
        }

        await commande.save();
        res.status(201).json({ message: "Commande added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
router.get("/allcommandes",async (req,res)=>{
    const commandes = await Commande.find();
    if (commandes){
        res.send(commandes)
    }
    else {res.send("no commande existes");}

});
router.delete("/deleteallcommandes",async(req,res)=>{
const deletecommandes= await Commande.deleteMany();
if (deletecommandes){
res.send("deleted commandes with succes");
}
else{
    res.send( " an error deleted commandes with succes");

}
});
// PATCH route for updating a product by its ID
router.patch("/updateproduit/:id", async (req, res) => {
  try {
    // Extract updated product data from request body
    const { nom, prix, code, quantiteStock, description ,quantiteVendu} = req.body;
    console.log(req.body);
    // Find the product by ID and update its fields
    const updatedProduit = await Produit.findByIdAndUpdate(
      req.params.id,
      { nom, prix, code, quantiteStock: quantiteStock,quantiteVendu, description },
      { new: true } // Return the updated product
    );

    res.status(200).json(updatedProduit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



router.post("/loginvendeur", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find vendeur by username
        const vendeur = await Vendeur.findByUsername(username);

        if (!vendeur) {
            return res.status(404).json({ message: "Vendeur not found" });
        }

        // Authenticate vendeur
        vendeur.authenticate(password, async (err, user, info) => {
            if (err) {
                return res.status(500).json({ message: "Internal Server Error", error: err });
            }

            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            // Log in user
            req.login(user, { session: false }, async (err) => {
                if (err) {
                    return res.status(500).json({ message: "Internal Server Error", error: err });
                }

                // Generate token
                const token = generateToken(user);

                // Return response with token and user information
                return res.json({ token: token, id: user.id, nom: user.nom });
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
router.get('/profilevendeur/:id', async (req, res) => {
    try {
      const vendeur = await Vendeur.findById(req.params.id);
      if (vendeur) {
        res.status(200).send(vendeur);
      } else {
        res.status(404).send('No vendeur found');
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if (err){console.log(err);}
        else {res.send("logout with succes");}
    });
    
    });
module.exports=router;