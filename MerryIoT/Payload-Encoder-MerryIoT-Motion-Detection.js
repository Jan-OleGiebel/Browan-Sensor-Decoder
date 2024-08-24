//TTS v3 Payload Encoder
//Created 2024 by Jan-Ole Giebel

function encodeDownlink(input) {
  var outputBytes = [];
  var fPort = 204;

  function dec2HexSwap(cellValue) {
    let hexValue = cellValue.toString(16).toUpperCase().padStart(4, '0');

    let rightPart = hexValue.slice(-2);
    let leftPart = hexValue.slice(0, 2);

    let byte1 = parseInt(rightPart, 16);
    let byte2 = parseInt(leftPart, 16);

    return [byte1, byte2];
  }

  function dec2Hex(value) {
    let hexValue = value.toString(16).toUpperCase().padStart(2, '0');

    return parseInt(hexValue, 16);
  }

  //The value of this key can be any as only the key is being checked.
  //Note that if this key exists no data can be sent!
  if(input.data.hasOwnProperty('getConfiguration')) {
    outputBytes.push(0x00);
  } else if(input.data.hasOwnProperty('bleFOTA')) {
    fPort = 206;
    outputBytes.push(0x44);
    outputBytes.push(0x46);
    outputBytes.push(0x55);
  } else if(input.data.hasOwnProperty('reboot')) {
    fPort = 206;
    outputBytes.push(0x52);
    outputBytes.push(0x45);
    outputBytes.push(0x42);
    outputBytes.push(0x4F);
    outputBytes.push(0x4F);
    outputBytes.push(0x54);
  } else {
    //Must be int (seconds)
    if (input.data.hasOwnProperty("setKeepAliveInterval")) {
      outputBytes.push(0x00);
      outputBytes = outputBytes.concat(dec2HexSwap(input.data.setKeepAliveInterval));
    }

    //Must be int (seconds)
    if (input.data.hasOwnProperty("setOccupiedInterval")) {
      outputBytes.push(0x02);
      outputBytes = outputBytes.concat(dec2HexSwap(input.data.setOccupiedInterval));
    }

    //Must be int (minutes)
    if (input.data.hasOwnProperty("setFreeDetectionTime")) {
      outputBytes.push(0x03);
      outputBytes.push(dec2Hex(input.data.setFreeDetectionTime));
    }

    //Must be int (interpreted as boolean)
    if (input.data.hasOwnProperty("setTriggerCountWhileOccupied")) {
      outputBytes.push(0x04);
      outputBytes = outputBytes.concat(dec2HexSwap(input.data.setTriggerCountWhileOccupied));
    }

    //Must be either "room" or "desk"
    if (input.data.hasOwnProperty("setPIRMode")) {
      outputBytes.push(0x05);
      if (input.data.setPIRMode === "room") {
        outputBytes.push(0x00, 0xE0, 0x21, 0x00);
      } else if (input.data.setPIRMode === "desk") {
        outputBytes.push(0x00, 0x14, 0x81, 0x01);
      }
    }

    //Must be int (interpreted as boolean)
    if (input.data.hasOwnProperty("setVibrationDetection")) {
      outputBytes.push(0x06);
      if (input.data.setVibrationDetection === 1) {
        outputBytes.push(0x01);
      } else {
        outputBytes.push(0x00);
      }
    }
  }

  return {
    bytes: outputBytes,
    fPort: fPort,
    warnings: [],
    errors: [],
  };
}

function decodeDownlink(input) {
  return {
    data: {
      outputBytes: input.outputBytes,
    },
    warnings: [],
    errors: [],
  };
}
