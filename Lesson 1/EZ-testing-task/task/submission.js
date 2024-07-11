const { namespaceWrapper } = require('@_koii/namespace-wrapper');

const fs = require('fs');
const lamejs = require('lamejs');
class Submission {
  /**
   * Executes your task, optionally storing the result.
   *
   * @param {number} round
   * @param {*} mp3FilePath  - mp3 file 
   * @param {*} wavFilePath  - wav file
   * @returns {Promise<any>}
   */
  async task(wavFilePath, mp3FilePath) {

    try {
      // Read WAV file
      const wavData = fs.readFileSync(wavFilePath);
      const wav = new lamejs.WavHeader();
      wav.readHeader(new DataView(wavData.buffer));
  
      // Decode WAV
      const samples = new Int16Array(wavData.buffer, wav.dataOffset, wav.dataLen / 2);
      const mp3Encoder = new lamejs.Mp3Encoder(wav.channels, wav.sampleRate, 128);

      console.log('Started Task', new Date(), process.env.TEST_KEYWORD);
      await namespaceWrapper.storeSet('wavData', wavData);
      
  
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
      const mp3End = mp3Encoder.flush();   // Flush any remaining data
      if (mp3End.length > 0) {
        mp3Data.push(new Int8Array(mp3End));
      }
  
      // Save MP3 file
      const buffer = Buffer.concat(mp3Data.map(buf => Buffer.from(buf.buffer)));
      fs.writeFileSync(mp3FilePath, buffer);
      console.log('Conversion completed successfully');

      return buffer
  
      
    } catch (error) {
      console.error('Error converting WAV to MP3:', error);
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
  }

  /**
   * Submits a task for a given round
   *
   * @param {number} round - The current round number
   * @returns {Promise<any>} The submission value that you will use in audit. Ex. cid of the IPFS file
   */
  async submitTask(wavFilePath) {
    console.log('SUBMIT TASK CALLED ROUND NUMBER', round);
    try {
      console.log('SUBMIT TASK SLOT', await namespaceWrapper.getSlot());
      const submission = await this.fetchSubmission(round);
      console.log('SUBMISSION', submission);
      await namespaceWrapper.checkSubmissionAndUpdateRound(submission, round);
      console.log('SUBMISSION CHECKED AND ROUND UPDATED');
      console.log('Started Submission', new Date(), process.env.TEST_KEYWORD)
      return submission;
    } catch (error) {
      console.log('ERROR IN SUBMISSION', error);
    }
  }
  /**
   * Fetches the submission value
   *
   * @param {number} round - The current round number
   * @returns {Promise<string>} The submission value that you will use in audit. It can be the real value, cid, etc.
   *
   */
  async fetchSubmission(round) {
    console.log('FETCH SUBMISSION');
    // Fetch the value from NeDB
    const value = await namespaceWrapper.storeGet('value'); // retrieves the value
    // Return cid/value, etc.
    return value;
  }
}
const submission = new Submission();
module.exports = { submission };
