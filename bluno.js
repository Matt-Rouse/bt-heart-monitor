document.getElementById('connect').addEventListener('click', async () => {
    try {

        document.getElementById('connection').innerText = "Searching...";

        // Request Bluetooth device with a specific address
        const device = await navigator.bluetooth.requestDevice({
            filters: [{
                // Specific address (example: '12:34:56:78:9A:BC')
                address: 'D0:39:72:E4:A8:43'
            }],
            optionalServices: ['0000dfb0-0000-1000-8000-00805f9b34fb']
        });

        document.getElementById('connection').innerText = "Connecting...";

        // Connect to the device
        const server = await device.gatt.connect();

        document.getElementById('connection').innerText = "Connected";

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

    } catch (error) {
        console.error('Failed to connect', error);
    }
});
