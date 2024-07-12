const { namespaceWrapper } = require('@_koii/namespace-wrapper');

const fs = require('fs');
const lamejs = require('lamejs');
import ffmpeg from "fluent-ffmpeg";
import path from "path";
const { Keypair } = require('@_koii/web3.js');
const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
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
    function isWavFile(wavFilename) {
      try {
        const ext = path.extname(wavFilename);
        return ext === ".wav";
      } catch (error) {
        console.error("Error checking file extension:", error);
        return false;
      }
    }
    
    function convertWavToMp3(wavFilename, callback) {
      try {
        if (!isWavFile(wavFilename)) {
          throw new Error(`Not a wav file`);
        }
        const outputFile = wavFilename.replace(".wav", ".mp3");
        ffmpeg(wavFilename)
          .on("error", (err) => {
            callback(err, null);
          })
          .on("end", () => {
            callback(null, outputFile);
          })
          .save(outputFile);
      } catch (error) {
        callback(error, null);
      }
    }
}

  /**
   * Submits a task for a given round
   *
   ** @param {number} round
   * @param {*} mp3FilePath  - mp3 file
   * @param {*} wavFilePath  - wav file
   * @returns {Promise<any>} The submission value that you will use in audit. Ex. cid of the IPFS file
   */
  async submitTask(wavFilePath, mp3FilePath) {
    console.log('SUBMIT TASK CALLED ROUND NUMBER');
    function isWavFile(wavFilename) {
      try {
        const ext = path.extname(wavFilename);
        return ext === ".wav";
      } catch (error) {
        console.error("Error checking file extension:", error);
        return false;
      }
    }
    
    function convertWavToMp3(wavFilename, callback) {
      try {
        if (!isWavFile(wavFilename)) {
          throw new Error(`Not a wav file`);
        }
        const outputFile = wavFilename.replace(".wav", ".mp3");
        ffmpeg(wavFilename)
          .on("error", (err) => {
            callback(err, null);
          })
          .on("end", () => {
            callback(null, outputFile);
          })
          .save(outputFile);
      } catch (error) {
        callback(error, null);
      }
    }
}
const submission = new Submission();
module.exports = { submission };
