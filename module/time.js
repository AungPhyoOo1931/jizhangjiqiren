const moment = require("moment/moment");

function ysmc (time){
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
}

module.exports = {
    ysmc
}