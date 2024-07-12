 // Read WAV file
 const client = new KoiiStorageClient();
 const wallet = namespaceWrapper.getSubmitterAccount();
 const wavData = fs.readFileSync(wavFilePath);
 const wav = new lamejs.WavHeader();
 wav.readHeader(new DataView(wavData.buffer));

 // Decode WAV
 const samples = new Int16Array(
   wavData.buffer,
   wav.dataOffset,
   wav.dataLen / 2,
 );
 const mp3Encoder = new lamejs.Mp3Encoder(
   wav.channels,
   wav.sampleRate,
   128,
 );

 console.log('Started Task', new Date(), process.env.TEST_KEYWORD);

 // Encode to MP3
 const mp3Data = [];
 const sampleBlockSize = 1152; // Number of samples per channel
 for (let i = 0; i < samples.length; i += sampleBlockSize) {
   const sampleChunk = samples.subarray(i, i + sampleBlockSize);
   const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
   if (mp3buf.length > 0) {
     mp3Data.push(new Int8Array(mp3buf));
   }
 }
 const mp3End = mp3Encoder.flush(); // Flush any remaining data
 if (mp3End.length > 0) {
   mp3Data.push(new Int8Array(mp3End));
 }

 // Save MP3 file
 const buffer = Buffer.concat(mp3Data.map(buf => Buffer.from(buf.buffer)));
 fs.writeFileSync(mp3FilePath, buffer);
 console.log('Conversion completed successfully');

 try {
   const fileUploadResponse = await client.uploadFile(
     mp3FilePath,
     userStaking,
   );
   const cid_returned = fileUploadResponse.cid;
   console.log('File uploaded successfully. CID:', cid_returned);
 } catch (error) {
   console.error('Error uploading file:', error);
 }

 
    // try {
    //   console.log('ROUND', round);
    //   const value = 'Hello, World!';
    //   // Store the result in NeDB (optional)
    //   console.log('Started Task', new Date(), process.env.TEST_KEYWORD)
    //   if (value) {
    //     await namespaceWrapper.storeSet('value', value);
    //   }
    //   // Optional, return your task
    //   return value;
    // } catch (err) {
    //   console.log('ERROR IN EXECUTING TASK', err);
    //   return 'ERROR IN EXECUTING TASK' + err;
    // }

 return cid_returned;
} catch (error) {
 console.error('Error converting WAV to MP3:', error);
}