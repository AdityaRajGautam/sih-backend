import agency from '../models/agency.js';
import alert from '../models/alert.js';

// Create a new alert
export const createAlert = async (req, res) => {
  try {
    const {
      recipientAgency,
      severity,
      description,
    } = req.body;

    console.log("recipientAgency:", recipientAgency);
    console.log("senderAgencyId:", req.user._id);

    const senderAgencyId = req.user._id;

    // Convert recipientAgency to a string for direct comparison
    const recipientAgencyId = recipientAgency.toString();

    if (recipientAgencyId === senderAgencyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot send alert to yourself',
      });
    }

    // The rest of your code remains the same

    const newAlert = await new alert({
      senderAgency: senderAgencyId,
      recipientAgency,
      severity,
      description,
    }).save();

    res.status(201).json({
      success: true,
      message: "Alert sent successfully",
      newAlert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Something went wrong',
    });
  }
};



export const getAlertsForAgency = async (req, res) => {
  try {
    const senderAgencyId = req.user._id;
    const senderAgencies = await agency.findById(senderAgencyId);

    console.log("hello",senderAgencyId)
    if (!senderAgencies) {
      return res.status(404).json({ 
        success:false,
        message: 'Sender agency not found' 
      });
    }

    // const agencyId = req.params.agencyId;
    const alerts = await alert.find({ recipientAgency: senderAgencyId })
    // if (!alerts || alerts.length===0) {
    //     return res.status(404).json({ error: "NO Record found " });
    //   }
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

export const editAlert = async (req, res) => {
  try {
    const alertId = req.params.id;
    console.log("Alert ID:", alertId);
    const {
      recipientAgency,
      severity,
      description,
    } = req.body;

    // Find the alert by its ID
    const alertDocument = await alert.findById(alertId);

    if (!alertDocument) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    // Check if the requesting agency matches the senderAgency of the alert
    if (alertDocument.senderAgency.toString() !== req.user._id.toString()) {
      console.log(alertDocument.senderAgency.toString(), req.user._id.toString())
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this alert',
      });
    }

    // Update the alert properties
    alertDocument.recipientAgency = recipientAgency;
    alertDocument.severity = severity;
    alertDocument.description = description;

    // Save the updated alert
    const updatedAlert = await alertDocument.save();

    res.status(200).json({
      success: true,
      message: 'Alert updated successfully',
      updatedAlert,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating alert',
      error,
    });
  }
};

export const deleteAlert = async (req, res) => {
  try {
    const alertId = req.params.id;

    // Find the alert by its ID and delete it
    const deletedAlert = await alert.findByIdAndDelete(alertId);

    if (!deletedAlert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    // Check if the requesting agency matches the senderAgency of the deleted alert
    if (deletedAlert.senderAgency.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this alert',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting alert',
      error,
    });
  }
};




