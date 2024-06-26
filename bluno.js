document.getElementById('connect').addEventListener('click', async () => {
    try {
        // Request Bluetooth device
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['0000dfb0-0000-1000-8000-00805f9b34fb']
        });

        // Check if the selected device is your Bluno
        if (device.name === 'Your Bluno Device Name') {
            // Connect to the device
            const server = await device.gatt.connect();

            // Get the primary service
            const service = await server.getPrimaryService('0000dfb0-0000-1000-8000-00805f9b34fb');

            // Get the characteristic
            const characteristic = await service.getCharacteristic('0000dfb1-0000-1000-8000-00805f9b34fb');

            console.log('Connected to Bluno');
            // Read the initial value
            const value = await characteristic.readValue();
            console.log('Initial Value:', new TextDecoder().decode(value));

            // Set up notifications
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', (event) => {
                const value = new TextDecoder().decode(event.target.value);
                console.log('New Value:', value);
            });
        } else {
            console.log('Selected device is not your Bluno.');
        }

    } catch (error) {
        console.error('Failed to connect', error);
    }
});
