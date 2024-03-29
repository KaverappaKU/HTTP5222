const express = require("express");
const { request } = require("http");
const path = require("path");
const ejs = require("ejs");
const axios = require("axios");
const dotenv = require("dotenv");
const app = express();
const port = 3000;

dotenv.config();
const apiURL = process.env.CRYPTOPANIC_API_URL;
const apiKEY = process.env.CRYPTOPANIC_API_KEY;

const coincapURL = process.env.COINCAP_API_URL;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

// Cryptopanic news api route
app.get("/news", async (req, res) => {
  try {
    //const cryptoPanicUrl =
    ("https://cryptopanic.com/api/v1/posts/?auth_token=23d482e7fda896ae34b51213564fd37ef5763847&public=true");
    const cryptoPanicUrl = `${apiURL}?auth_token=${apiKEY}&public=true`;
    console.log(cryptoPanicUrl);
    const response = await axios.get(cryptoPanicUrl);
    const newsData = response.data.results;
    console.log(newsData);
    res.render("news", { newsData });
  } catch (error) {
    res.render("error", { error });
  }
});

// CoinGecko cryptocurrency route
app.get("/currencies", async (req, res) => {
  try {
    const coinCapUrl = coincapURL;
    const response = await axios.get(coinCapUrl);
    const cryptocurrencyData = response.data.data;
    res.render("currencies", { cryptocurrencyData });
  } catch (error) {
    res.render("error", { error });
  }
});

// Route to search for a cryptocurrency
app.post("/search", async (req, res) => {
  try {
    const { searchQuery } = req.body;

    // Fetch cryptocurrency data from CoinCap API
    const response = await fetch(`https://api.coincap.io/v2/assets`);
    const data = await response.json();
    const currencies = data.data;

    // Search logic
    const searchResults = currencies.filter(
      (currency) =>
        currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    res.render("currencies", { cryptocurrencyData: searchResults });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
