const express = require("express");
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const {
  newService,
  getServicesAd,
  getServices,
  services,
  addProvidersIntoServices,
  getProviders,
  getCategories,
  getServicesByProviders,
  deleteService,
  updateService
} = require("../controllers/serviceController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const dir = 'uploads/';
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      cb(null, dir);
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/new-service", upload.single('image'), newService);
router.get("/get-services-ad", getServicesAd);
router.get("/get-services", getServices);
router.get("/services", services);
router.post("/services/:serviceId/provider", addProvidersIntoServices);
router.get("/getProviders", getProviders);
router.get("/getCategories", getCategories);
router.get("/getServicesByProviders", getServicesByProviders);
router.delete("/deleteService", deleteService);
router.post("/updateService", upload.single('image'), updateService);

module.exports = router;
