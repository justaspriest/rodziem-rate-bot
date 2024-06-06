class ContextFacade {

    constructor(context) {
        this.ctx = context;
    }

    get text() {
        if (!this.ctx || !this.ctx.message) {
            return;
        }
    
        return this.ctx.message.text;
    }

    get command() {
        const rawEntry = this.getText(this.ctx);
        if (!rawEntry) {
            return;
        }

        return rawEntry.substring(1);
    }

    get action() {
        if (!this.ctx || !this.ctx.message) {
            return;
        }

        return !!this.ctx.callbackQuery && this.ctx.callbackQuery.data;
    }

    getUserId() {
        if (!this.ctx || !this.ctx.from) {
            return;
        }
    
        return this.ctx.from.id;
    }

    isCommandContext() {
        if (!this.ctx || !this.ctx.message) {
            return false;
        }
    
        const entities = this.ctx.message.entities;
    
        return !!entities && !!entities[0] && entities[0].type === 'bot_command';
    }

}

module.exports.ContextFacade = ContextFacade;
