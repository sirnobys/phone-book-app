const contacts_controller = (app) => {
    const Contact = require('../../../models/contactModel')

    app.get('/contacts', async (req, res) => {
        try {
            const contacts = await Contact.find()
            res.status(200).json(contacts);
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    })

    app.get('/contacts/:id', async (req, res) => {
        try {
            const {id} = req.params;
            const contacts = await Contact.findById(id);
            res.status(200).json(contacts);
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    })

    app.post('/contacts/create', async (req, res) => {
        try {
            const search = await Contact.find({number:req.body.number})
            if(search.length>0){
               return res.status(409).json({ message: 'number already exists' })
            }
            const contacts = await Contact.create(req.body);
            res.status(200).json(contacts);
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    })

    app.put('/contacts/update/:id', async (req, res) => {
        try {
            const search = await Contact.find({number:req.body.number})
            if(search.length>0){
               return res.status(409).json({ message: 'number already exists' })
            }
            const {id} = req.params;
            const contact = await Contact.findByIdAndUpdate(id, req.body);
            if(!contact){
                res.status(404).json({message: `cannot find any contact with ID ${id}`})
            }
            const updated_contact = await Contact.findById(id)
            res.status(200).json(updated_contact);
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    })

    app.delete('/contacts/delete/:id', async (req, res) => {
        try {
            const {id} = req.params;
            const contact = await Contact.findByIdAndDelete(id);
            if(!contact){
                return res.status(404).json({message: `cannot find any contact with ID ${id}`})
            }
            res.status(200).json(contact);
            
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    })
}

module.exports = contacts_controller