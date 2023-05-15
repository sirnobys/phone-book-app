const controllers = (app) => {
    const contacts_controller = require('./contact')
    contacts_controller(app)
}

module.exports = controllers