module.exports = {
    execute: async (chatId) => {
        const response = 'এটি AI সম্পর্কিত তথ্য।';
        await sendMessage(chatId, response);
    }
};
