const axios = require('axios');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const { resolve: resolveFilePath } = require('path');

const MediaFileRepository = require('../repositories/mediaFileRepository');
const { configuration } = require('../utils/configuration');

const performLoad = async (mediaUrl, mediaId) => {
    const response = await axios.get(mediaUrl,  { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'utf-8');

    const cachePath = configuration.cachePath;
    if (!fs.existsSync(cachePath)){
        fs.mkdirSync(cachePath);
    }
    
    const filePath = resolveFilePath(`${cachePath}/${mediaId}.jpg`);

    return new Promise((resolve, reject) => {
        buffer
        fs.writeFile(filePath, buffer, (err) => {
            if (!!err) {
                console.error('Error while writing media to file', err);
                reject();
            }

            resolve(filePath);
        });
    });
};


const loadMedia = async (telegramMediaId, ctx) => {
    const mediaUrl = await ctx.telegram.getFileLink(telegramMediaId);
    const mediaId = uuidv4();

    performLoad(mediaUrl, mediaId)
        .then((filePath) => {
            const mediaFile = {
                id: mediaId,
                type: 'local',
                path: filePath
            };
            MediaFileRepository.save(mediaFile);
        })
        .catch((err) => {
            console.error(`Could not load image ${mediaId}`, err);
        });
    
    return mediaId;
};

module.exports.loadMedia = loadMedia;
