module.exports = (error) => {

    setTimeout(() => {

        throw error;

    }, 10);
    return;

};
