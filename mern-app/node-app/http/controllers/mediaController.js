const express = require("express");
const { formatBytes } = require("../../utils/media");
const fs = require("fs");
const path = require("path");
const constents = require("../../utils/constents");
const videoUtil = require("../../utils/video-conversion");

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);


async function uploadNew(req, res) {
    try {
        // Check if file is valid
        if (req.hasOwnProperty("fileValidationError")) {
            return res.status(400).send({
                status: 300,
                message: "This file type is not supported",
                memeType: req
            });
        }

        let fileData = req.file;
        let filePath = path.join(fileData.destination, fileData.filename);
        let fileNameWithoutExt = path.basename(fileData.filename, path.extname(fileData.filename));
        let outputFolder = path.join(fileData.destination, 'hls'); // Folder for HLS output

        // If the file is a video, proceed with conversion
        if (fileData.mimetype.startsWith('video/')) {
            // Convert video to m3u8
            const { m3u8File, tsFilesPattern } = await videoUtil.convertVideoToM3U8(filePath, fileNameWithoutExt, outputFolder);

            // Optionally: Remove the original video file after conversion
            fs.unlinkSync(filePath);

            // Prepare the response data
            let newFile = {
                filename: path.basename(m3u8File), // m3u8 file name
                name: fileNameWithoutExt,
                ext: 'm3u8',
                directory: outputFolder,
                mime_type: 'application/vnd.apple.mpegurl',
                size: formatBytes(fs.statSync(m3u8File).size),
                sizeInBytes: fs.statSync(m3u8File).size,
                url: path.join('hls', path.basename(m3u8File)) // Path to the m3u8 file
            };

            return res.status(200).send({
                status: 200,
                message: "File Uploaded and Converted to HLS successfully!",
                file: newFile
            });
        } else {
            // If the file is not a video, send the regular upload response
            let newFile = {
                filename: fileData.filename,
                name: path.basename(fileData.filename, path.extname(fileData.filename)),
                ext: path.extname(fileData.filename).slice(1),
                directory: fileData.destination,
                mime_type: fileData.mimetype,
                size: formatBytes(fileData.size),
                sizeInBytes: fileData.size,
                url: path.join(fileData.destination, fileData.filename)
            };

            return res.status(200).send({
                status: 200,
                message: "File Uploaded Successfully",
                file: newFile
            });
        }
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: "An Unknown error occurred",
            error: error.message
        });
    }
}

module.exports = {
    uploadNew
}