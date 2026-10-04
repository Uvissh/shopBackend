const  dotenv = require('dotenv');
const pool = require('../db');
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const TABLES = {
  grocery: "grocery",
  vegetables: "vegetables",
  cold_drinks: "cold_drinks",
  animal_food: "animal_food",
  stationery: "stationery",
};

function getTable(type) {
  return Object.hasOwn(TABLES, type) ? TABLES[type] : null;
}

// Step 4: products, with "type" added (this solves the type issue)

 const productType =async (req, res,next) => {
  const table = getTable(req.params.type);
  if (!table) return res.status(404).json({ error: "Unknown type" });

  try {
    const result = await pool.query(
      `SELECT id, name, price::float AS price, weight, image, $1::text AS type
       FROM ${table} ORDER BY id`,
      [req.params.type]
    );
    res.json({
        data:result.rows
    });
  } catch (err) {
    console.error(err);
   next(err);
  }
}


const stripePayment = async (req, res,next) => {
  try {
    const { items } = req.body; // [{ id, type, quantity }]

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const line_items = [];

    for (const item of items) {
      const table = getTable(item.type);
      const quantity = Number.parseInt(item.quantity, 10);

      if (!table || !(quantity > 0)) {
        return res.status(400).json({ error: "Invalid item in cart" });
      }

      // Real price from the database, not from the browser
      const { rows } = await pool.query(
        `SELECT name, price::float AS price FROM ${table} WHERE id = $1`,
        [item.id]
      );
      const product = rows[0];
      if (!product) {
        return res.status(400).json({ error: "Product not found" });
      }

      line_items.push({
        price_data: {
          currency: "inr",
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100),
        },
        quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    next(err);
    
  }
};

module.exports = {stripePayment,productType};