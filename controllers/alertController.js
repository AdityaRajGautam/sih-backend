import Alert from '../models/alert.js';

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

    const newAlert = await new Alert({
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
        error: 'Internal server error' });
  }
};


// Get alerts for a specific agency
export const getAlertsForAgencyController = async (req, res) => {
  try {
    const agencyId = req.params.agencyId;
    const alerts = await Alert.find({ recipientAgency: agencyId })
    if (!alerts) {
        return res.status(404).json({ error: "NO Record found" });
      }
    res.status(200).json({
        success: true,
        message:"Alerts fetch successfully",
        alerts,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
