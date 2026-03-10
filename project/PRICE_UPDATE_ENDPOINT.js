// API ENDPOINT TO UPDATE PRODUCT PRICES FOR AGRO SHOPS
// Add this to server/index.js after line 752 (after the app.patch('/api/agroshops/:id') endpoint)

// Update Product Prices for Specific Shop
app.patch('/api/agroshops/:id/prices', async(req, res) =\u003e {
    try {
        const { productPrices } = req.body;

        // Validate input
        if(!Array.isArray(productPrices)) {
    return res.status(400).json({ error: 'productPrices must be an array' });
}

// Update lastUpdated timestamp for each product
const updatedPrices = productPrices.map(product =\u003e({
    ...(product),
    lastUpdated: new Date()
}));

// Find and update the shop with new prices
const updatedShop = await AgroShop.findByIdAndUpdate(
    req.params.id,
    { productPrices: updatedPrices },
    { new: true, runValidators: true }
);

if (!updatedShop) {
    return res.status(404).json({ error: 'Shop not found' });
}

res.json({
    success: true,
    message: 'Product prices updated successfully',
    shop: { ...updatedShop.toObject(), id: updatedShop._id.toString() }
});
  } catch (err) {
    res.status(400).json({ error: err.message });
}
});
