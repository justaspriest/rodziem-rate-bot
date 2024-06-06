const { handleMediaMessage } = require('../controllers/mediaController');
const { wrapContext } = require('../utils/contextUtils');

const getImageId = (ctx) => {
    const files = !!ctx.message && ctx.message.photo;
    // Фотография в лучшем разрешении
    return files[files.length - 1].file_id;
};

const createContext = async (ctx) => {
    const text = !!ctx.message && ctx.message.caption;
    const imageId = getImageId(ctx);

    return {
        ...wrapContext(ctx),
        text,
        media: [ imageId ]
    };
};

const isMediaGroupMessage = (ctx) => {
    const message = ctx.message || ctx.channelPost
    return !!message.media_group_id;
}

class MediaGroupAccumulator {

    constructor() {
        this.acc = {};
    }

    retrieveGroup(ctx) {
        const chatId = ctx.chat.id;
        const mediaGroup = this.acc[chatId];
        if (!!mediaGroup) {
            clearTimeout(mediaGroup.timeoutId);
            return mediaGroup;
        }
    
        const newMediaGroup = {
            context: {
                ...wrapContext(ctx),
                media: []
            }
        };
    
        this.acc[chatId] = newMediaGroup;
    
        return newMediaGroup;
    }

    deleteGroup(ctx) {
        const chatId = ctx.chat.id;
        delete this.acc[chatId];
    }
}

const mediaGroupAccumulator = new MediaGroupAccumulator();

const accumulateMediaGroupMessage = async (ctx, onComplete) => {
    const mediaGroup = mediaGroupAccumulator.retrieveGroup(ctx);
    
    const text = !!ctx.message && ctx.message.caption;
    if (!!text) {
        mediaGroup.context.text = text;
    }

    const imageId = getImageId(ctx);
    mediaGroup.context.media.push(imageId);
    mediaGroup.timeoutId = setTimeout(() => {
        mediaGroupAccumulator.deleteGroup(ctx);
        onComplete(mediaGroup.context);
    }, 300);
};

const handlePhotoMessage = async (ctx) => {
    if (isMediaGroupMessage(ctx)) {
        accumulateMediaGroupMessage(ctx, handleMediaMessage);
        return;
    }

    const context = await createContext(ctx);
    handleMediaMessage(context);
};

module.exports.handlePhotoMessage = handlePhotoMessage;