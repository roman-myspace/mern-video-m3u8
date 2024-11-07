const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);


// Utility function to convert video to HLS (m3u8)
async function convertVideoToM3U8(filePath, fileNameWithoutExt, outputFolder) {
    return new Promise((resolve, reject) => {
        let outputM3U8 = path.join(outputFolder, `${fileNameWithoutExt}.m3u8`);
        let outputTsPattern = path.join(outputFolder, `${fileNameWithoutExt}_%03d.ts`);

        // Ensure output folder exists
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder);
        }

        // Start FFmpeg conversion
        ffmpeg(filePath)
            .output(outputM3U8)
            .outputOptions([
                 '-preset fast',
                '-crf 22',
                '-c:v libx264',
                '-c:a aac',
                '-b:a 192k',
                '-f hls',
                '-hls_time 10',  // Segment duration in seconds
                '-hls_list_size 0',  // Set to 0 to not limit the number of entries in the playlist
                '-hls_segment_filename', `${outputM3U8}_%03d.ts`  // Output segments with numbering
            ])
            .on('end', () => {
                console.log('Conversion finished!');
                // Resolve promise once conversion is done
                resolve({ m3u8File: outputM3U8, tsFilesPattern: outputTsPattern });
            })
            .on('error', (err, stdout, stderr) => {
                console.error('Error:', err);
                console.error('FFmpeg stdout:', stdout);
                console.error('FFmpeg stderr:', stderr);
                reject(err);
            })
            .run();
    });
}

module.exports = {
    convertVideoToM3U8
};
