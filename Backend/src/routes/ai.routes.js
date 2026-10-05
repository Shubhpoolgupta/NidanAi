const express = require('express');
const router = express.Router(); 
const multer = require('multer');
const { simplifyReportAI } = require('../services/ai.service'); 
const upload = multer({ dest: 'uploads/' });

router.post('/simplify-report', upload.single('file'), async (req, res) => {
  try {
    console.log("File received:", req.file); 
    const filePath = req.file.path;
    const mimetype = req.file.mimetype;

    const simplifiedReport = await simplifyReportAI(filePath, mimetype);

    console.log(" Simplified report:", simplifiedReport);

    res.json(simplifiedReport);
  } catch (err) {
    console.error(" Error in simplify-report:", err);
    res.status(500).json({ error: 'Failed to process report' });
  }
});

module.exports = router;
