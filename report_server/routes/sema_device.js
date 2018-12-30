const express = require('express');
const router = express.Router();
const validator = require('validator');
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const Device = require(`${__basedir}/models`).device;

// Register a device and its associated sensor/s into the DB
router.post('/register', async (req, res) => {
	semaLog.info('sema_device - Register');
    
    // Gather data sent
    const {
        deviceName,
        deviceSerialNumber,
        deviceIPAddress,
        deviceFirmware,
        kioskId,
        deviceSensors
    } = req.body;

    // Check if all fields have a value
    if (
        validator.isEmpty(deviceName) ||
        validator.isEmpty(deviceSerialNumber) ||
        validator.isEmpty(deviceIPAddress) ||
        validator.isEmpty(deviceFirmware) ||
        validator.isEmpty(kioskId) ||
        areSensorsValid(deviceSensors)
    ) {
        semaLog.warn(`sema_device - Register - Error: ${err}`);
        return res.status(422).send({ msg: "One or more fields were empty." });
    }

    // Create the new device
    let [err, storedDevice] = await __hp(Device.create({
        name: deviceName,
        serial_number: deviceSerialNumber,
        ip_address: deviceIPAddress,
        firmware: deviceFirmware,
        kiosk_id: kioskId
    }));

    // On error, return a generic error message and log the error
    if (err) {
        semaLog.warn(`sema_device - Register - Error: ${JSON.stringify(err)}`);
		return res.status(500).send({ msg: "Internal Server Error" });
    }

    // Prepare the creation of the new sensors
    const newSensors = deviceSensors.map(sensor =>
        Sensor.create({
            name: sensor.name,
            sampling_site_id: sensor.sampling_site_id,
            parameter_id: sensor.parameter_id,
            device_id: storedDevice.id
        })
    );

    // Store new sensors into the DB
    let [err, storedSensors] = Promise.all(newSensors);

    // On error, return a generic error message and log the error
    if (err) {
        semaLog.warn(`sema_device - Register - Error: ${JSON.stringify(err)}`);
		return res.status(500).json({ msg: "Internal Server Error" });
    }

    // On success, return a success message and info about the stored device and sensors
    return res.json({
        msg: `Successfully created the device ${storedDevice.serial_number} and its ${newSensors.length} sensors.`,
        storedDevice,
        storedSensors
    });
});

// Validates sensor fields
const areSensorsValid = sensors => {
    const notValid = sensors.filter(sensor => {
        return (
            validator.isEmpty(sensor.name) ||
            validator.isEmpty(sensor.sampling_site_id) ||
            validator.isEmpty(sensor.parameter_id)
        );
    });

    return notValid.length;
};

module.exports = router;
