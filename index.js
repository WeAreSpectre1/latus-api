const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Banco de dados fake (depois você conecta num banco de verdade)
let offsetsDatabase = [
  {
    id: 1,
    game: "Counter-Strike 2",
    name: "EntityList",
    value: "0x04C4A3FC",
    category: "entity",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    game: "Counter-Strike 2",
    name: "LocalPlayer",
    value: "0x04C4A3F8",
    category: "player",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    game: "Counter-Strike 2",
    name: "ViewMatrix",
    value: "0x04C4A400",
    category: "visual",
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    game: "Counter-Strike 2",
    name: "AimAngle",
    value: "0x04C4A404",
    category: "aim",
    created_at: new Date().toISOString()
  },
  // Rust
  {
    id: 5,
    game: "Rust",
    name: "EntityList",
    value: "0x04C4A3FC",
    category: "entity",
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    game: "Rust",
    name: "LocalPlayer",
    value: "0x04C4A3F8",
    category: "player",
    created_at: new Date().toISOString()
  },
  // DayZ
  {
    id: 7,
    game: "DayZ",
    name: "EntityList",
    value: "0x04C4A3FC",
    category: "entity",
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    game: "DayZ",
    name: "ViewMatrix",
    value: "0x04C4A400",
    category: "visual",
    created_at: new Date().toISOString()
  },
  // Fortnite
  {
    id: 9,
    game: "Fortnite",
    name: "EntityList",
    value: "0x04C4A3FC",
    category: "entity",
    created_at: new Date().toISOString()
  }
]

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Latsus Cheats funcionando!',
    endpoints: {
      getOffsets: '/api/offsets/:game',
      addOffset: 'POST /api/offsets',
      deleteOffset: 'DELETE /api/offsets/:id'
    }
  })
})

// GET /api/offsets/:game - Pega offsets por jogo
app.get('/api/offsets/:game', (req, res) => {
  const game = decodeURIComponent(req.params.game)
  console.log('Buscando offsets para:', game)
  
  const offsets = offsetsDatabase.filter(offset => offset.game === game)
  
  // Se não achar nenhum, retorna array vazio
  res.json(offsets)
})

// POST /api/offsets - Adiciona novo offset
app.post('/api/offsets', (req, res) => {
  const { game, name, value, category } = req.body
  
  if (!game || !name || !value) {
    return res.status(400).json({ error: 'Faltou game, name ou value' })
  }
  
  // Gera ID novo
  const newId = Math.max(...offsetsDatabase.map(o => o.id), 0) + 1
  
  const newOffset = {
    id: newId,
    game,
    name,
    value,
    category: category || 'other',
    created_at: new Date().toISOString()
  }
  
  offsetsDatabase.push(newOffset)
  
  // Retorna só os offsets desse jogo
  const gameOffsets = offsetsDatabase.filter(o => o.game === game)
  res.json({ success: true, offsets: gameOffsets })
})

// DELETE /api/offsets/:id - Deleta offset
app.delete('/api/offsets/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = offsetsDatabase.findIndex(o => o.id === id)
  
  if (index === -1) {
    return res.status(404).json({ error: 'Offset não encontrado' })
  }
  
  const game = offsetsDatabase[index].game
  offsetsDatabase.splice(index, 1)
  
  const gameOffsets = offsetsDatabase.filter(o => o.game === game)
  res.json({ success: true, offsets: gameOffsets })
})

// Rota pra ver todos os offsets (só pra debug)
app.get('/api/debug/all', (req, res) => {
  res.json(offsetsDatabase)
})

app.listen(port, () => {
  console.log(`sucess port ${port}`)
  console.log(`load offsets ${offsetsDatabase.length}`)
})