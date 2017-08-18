![Docker Build Status](https://img.shields.io/docker/build/clma/pi-mqtt-timelapse.svg)


# A Raspberry Pi Timelapse Camera

This is a fairly simple implementation of a timelapse service that sends the result to an MQTT broker. There currently als is a HTTP API for taking pictures "manually". 

## Quick Start

Use Docker 😉 `docker pull -v /usr/bin/raspistill:/usr/bin/raspistill -p 3000:3000 --device /dev/vchiq clma/pi-mqtt-timelapse:arm`... 

or just 
``` 
git pull https://github.com/celaus/pi-mqtt-timelapse/
cd pi-mqtt-timelapse
npm install
npm start
```

### Configuration

Look at [config.toml](config.toml) and adjust the properties as needed. 

### Message

The JSON message pushed to the MQTT Broker looks like this:

```json
[{
    "meta": { 
        "name": "<device name from config>", 
        "role": "<device role from config>" 
    },
    "data": [{ 
        "Binary": { 
            "name": "timelapse", 
            "unit": "image", 
            "value": "base64 encoded image binary" 
        } 
    }],
    "timestamp": 12345678912 // time in milliseconds
}]
```


# License

Apache 2.0
