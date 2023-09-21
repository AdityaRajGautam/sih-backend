import Alert from '../models/alert';

const sendAlertController = async (req, res) => {
  try {
    const { senderAgencyId, recipientAgencyId, type, description } = req.body;

    // Create a new alert instance
    const alert = new Alert({
      senderAgency: senderAgencyId,
      recipientAgency: recipientAgencyId,
      type,
      description,
    });

    // Save the alert to the database
    await alert.save();

    res.status(201).json({ message: 'Alert sent successfully', alert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending alert', error });
  }
};

const receiveAlertController = async (req, res) => {
  try {
    // Extract the agency ID from the JWT token or any other authentication mechanism
    const recipientAgencyId = req.user.agencyId; // Replace with the actual JWT token field or authentication mechanism

    // Query alerts that are received by the agency
    const receivedAlerts = await Alert.find({ recipientAgency: recipientAgencyId });

    res.status(200).json({ message: 'Received alerts retrieved successfully', receivedAlerts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving received alerts', error });
  }
};

export default {
  receiveAlertController, sendAlertController,
};

