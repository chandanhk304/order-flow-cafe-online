
const express = require('express');
const QRCode = require('qrcode');
const router = express.Router();

// Generate QR code for cafe menu
router.post('/generate', async (req, res) => {
  try {
    const { cafeId, baseUrl } = req.body;
    
    if (!cafeId) {
      return res.status(400).json({ error: 'Cafe ID is required' });
    }

    const menuUrl = `${baseUrl || 'http://localhost:5173'}/menu/${cafeId}`;
    
    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(menuUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      url: menuUrl,
      qrCode: qrCodeDataURL
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

module.exports = router;
