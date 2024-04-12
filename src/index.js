const Hapi = require("@hapi/hapi")
const { addNote, notes, updateNote } = require("./notes")

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: { cors: { origin: ['*'] } }
  })

  server.route([
    {
      method: 'GET',
      path: '/notes',
      handler: (req, h) => {
        return h.response({
          status: "success",
          data: { notes }
        })
      }
    },
    {
      method: 'GET',
      path: '/notes/{id}',
      handler: (req, h) => {
        const { id } = req.params
        let note = notes.find(note => note.id == id)
        if (note) {
          return h.response({
            status: "success",
            data: { note }
          }).code(200)
        }
        return h.response({
          "status": "fail",
          "message": "Catatan tidak ditemukan"
        }).code(404)
      },
    },
    {
      method: 'POST',
      path: '/notes',
      handler: (req, h) => {
        try {
          const { title, body, tags } = req.payload
          const noteId = addNote({ title, body, tags })

          return h.response({
            status: "success",
            message: "Catatan berhasil ditambahkan",
            data: { noteId }
          }).code(201)
        } catch (error) {
          console.log(error);
          return h.response({
            status: "error",
            message: "Catatan gagal untuk ditambahkan",
          }).code(500)
        }
      }
    },
    {
      method: 'PUT',
      path: '/notes/{id}',
      handler: (req, h) => {
        try {
          const newNote = req.payload
          const { id } = req.params
          let note = notes.find(note => note.id == id)
          if (note) {
            const index = notes.findIndex(note => note.id == id)
            updateNote(index, newNote)
            return h.response({
              "status": "success",
              "message": "Catatan berhasil diperbaharui"
            })
          }
          return h.response({
            "status": "fail",
            "message": "Gagal memperbarui catatan. Id catatan tidak ditemukan"
          }).code(404)
        } catch (error) {
          return h.response({
            status: "error",
            message: "Catatan gagal untuk diupdate",
          }).code(500)
        }
      }
    },
    {
      method: 'DELETE',
      path: '/notes/{id}',
      handler: (req, h) => {
        try {
          const { id } = req.params
          let index = notes.findIndex(note => note.id == id)
          if (index != -1) {
            notes.splice(index, 1)
            return h.response({
              status: 'success',
              message: 'Catatan berhasil dihapus',
            })
          }
          return h.response({
            status: 'fail',
            message: 'Catatan gagal dihapus. Id tidak ditemukan',
          }).code(404)
        } catch (error) {
          return h.response({
            status: "error",
            message: "Catatan gagal untuk diupdate",
          }).code(500)
        }
      }
    }
  ])

  await server.start()
  console.log(`server berjalan di ${server.info.uri}`);
}

init()