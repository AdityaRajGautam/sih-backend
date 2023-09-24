import agency from '../models/agency.js';
import alert from '../models/alert.js';

// Create a new alert
export const createAlertController = async (req, res) => {
  try {
    const {
        senderAgency,
        recipientAgency,
        severity,
        timestamp,
        description,
      } = req.body;  

    const senderAgencyId = req.user._id;
    const senderAgencies = await agency.findById(senderAgencyId);

    if (!senderAgencies) {
      return res.status(404).json({ 
        success:false,
        message: 'Sender agency not found' 
      });
    }

    
    const newAlert = await new alert({
        senderAgency,
        recipientAgency,
        severity,
        timestamp,
        description,
      }).save();

    res.status(201).json({
        success:true,
        message:"Alert sent successfully",
        newAlert});
  } catch (error) {
    res.status(500).json({ 
        success:false,
        error: 'Something went wrong' });
  }
};


// Get alerts for a specific agency
export const getAlertsForAgencyController = async (req, res) => {
  try {
    const senderAgencyId = req.user._id;
    const senderAgencies = await agency.findById(senderAgencyId);

    if (!senderAgencies) {
      return res.status(404).json({ 
        success:false,
        message: 'Sender agency not found' 
      });
    }

    // const agencyId = req.params.agencyId;
    const alerts = await alert.find({ recipientAgency: senderAgencyId })
    if (!alerts || alerts.length===0) {
        return res.status(404).json({ error: "NO Record found" });
      }
    res.status(200).json({
        success: true,
        message:"Alerts fetch successfully",
        alerts,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false, error: 'Something went wrong' });
  }
};










