const { nanoid } = require('nanoid')
// biar gak capek ngetik doang btw :)
/** @type {{
 id: string,
 title: string,
 createdAt: string,
 updatedAt: string,
 tags: string[],
 body: string,
}[]}, */
let notes = []

const addNote = (note) => {

  const id = nanoid(16)

  notes.push({
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...note
  })
  return id
}

const updateNote = (index, newNote) => {
  notes[index].title = newNote.title
  notes[index].body = newNote.body
  notes[index].tags = newNote.tags
  notes[index].updatedAt = new Date().toISOString()
}

module.exports = { addNote, updateNote, notes }