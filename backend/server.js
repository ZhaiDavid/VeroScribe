import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { nanoid } from 'nanoid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbFile = path.join(__dirname, 'db.json')
const adapter = new JSONFile(dbFile)
const db = new Low(adapter)

await db.read()
if (!db.data) {
  db.data = {
    users: [
      {
        id: 'doc1',
        email: 'maya@hospital.com',
        password: 'doc123',
        type: 'doctor',
        physicianId: 'p1'
      },
      {
        id: 'doc2',
        email: 'aiden@hospital.com',
        password: 'doc123',
        type: 'doctor',
        physicianId: 'p2'
      },
      {
        id: 'doc3',
        email: 'priya@hospital.com',
        password: 'doc123',
        type: 'doctor',
        physicianId: 'p3'
      },
      {
        id: 'patient1',
        email: 'john@example.com',
        password: 'patient123',
        type: 'patient',
        firstName: 'John',
        middleName: '',
        lastName: 'Smith',
        preferredName: ''
      },
      {
        id: 'patient2',
        email: 'jane@example.com',
        password: 'patient123',
        type: 'patient',
        firstName: 'Jane',
        middleName: 'Marie',
        lastName: 'Doe',
        preferredName: 'J.M.'
      }
    ],
    physicians: [
      {
        id: 'p1',
        name: 'Dr. Maya Hernandez',
        specialty: 'Family Medicine',
        location: 'Suite 101',
        bio: 'Dr. Hernandez has 15 years of experience in family medicine. She is dedicated to providing comprehensive primary care and building long-term relationships with her patients. Dr. Hernandez completed her MD at Johns Hopkins Medical School and her residency at Massachusetts General Hospital.',
        email: 'maya@hospital.com',
        phone: '(555) 123-4567',
        yearsExperience: 15,
        education: 'MD, Johns Hopkins Medical School'
      },
      {
        id: 'p2',
        name: 'Dr. Aiden Brooks',
        specialty: 'Internal Medicine',
        location: 'Suite 102',
        bio: 'Dr. Brooks specializes in internal medicine with a focus on chronic disease management and preventive care. With 12 years of clinical experience, he is committed to patient education and evidence-based treatment approaches. Dr. Brooks completed his MD at Stanford School of Medicine.',
        email: 'aiden@hospital.com',
        phone: '(555) 234-5678',
        yearsExperience: 12,
        education: 'MD, Stanford School of Medicine'
      },
      {
        id: 'p3',
        name: 'Dr. Priya Patel',
        specialty: 'Pediatrics',
        location: 'Suite 103',
        bio: 'Dr. Patel is a pediatrician with 10 years of experience caring for infants, children, and adolescents. She believes in a family-centered approach to pediatric care and is passionate about preventive health and childhood wellness. Dr. Patel completed her MD at Harvard Medical School.',
        email: 'priya@hospital.com',
        phone: '(555) 345-6789',
        yearsExperience: 10,
        education: 'MD, Harvard Medical School'
      }
    ],
    slots: [
      { id: 's1', physicianId: 'p1', datetime: '2026-05-12T09:00:00', isAvailable: true },
      { id: 's2', physicianId: 'p1', datetime: '2026-05-12T10:00:00', isAvailable: true },
      { id: 's3', physicianId: 'p1', datetime: '2026-05-12T14:00:00', isAvailable: true },
      { id: 's4', physicianId: 'p2', datetime: '2026-05-12T09:30:00', isAvailable: true },
      { id: 's5', physicianId: 'p2', datetime: '2026-05-12T11:00:00', isAvailable: true },
      { id: 's6', physicianId: 'p2', datetime: '2026-05-12T15:00:00', isAvailable: true },
      { id: 's7', physicianId: 'p3', datetime: '2026-05-12T08:30:00', isAvailable: true },
      { id: 's8', physicianId: 'p3', datetime: '2026-05-12T10:30:00', isAvailable: true },
      { id: 's9', physicianId: 'p3', datetime: '2026-05-12T13:30:00', isAvailable: true }
    ],
    bookings: []
  }
  await db.write()
}

const app = express()
app.use(cors())
app.use(express.json())

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  await db.read()
  const { email, password } = req.body
  const user = db.data.users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' })
  }

  const { password: _, ...userWithoutPassword } = user
  res.json(userWithoutPassword)
})

app.post('/api/auth/signup', async (req, res) => {
  await db.read()
  const { email, password, type, firstName, middleName, lastName, preferredName } = req.body

  if (db.data.users.find((u) => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered.' })
  }

  const newUser = {
    id: nanoid(),
    email,
    password,
    type,
    ...(type === 'patient' ? { firstName, middleName: middleName || '', lastName, preferredName: preferredName || '' } : {})
  }

  db.data.users.push(newUser)
  await db.write()

  const { password: _, ...userWithoutPassword } = newUser
  res.json(userWithoutPassword)
})

app.get('/api/auth/user', async (req, res) => {
  const userId = req.headers['x-user-id']
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated.' })
  }

  await db.read()
  const user = db.data.users.find((u) => u.id === userId)

  if (!user) {
    return res.status(404).json({ error: 'User not found.' })
  }

  const { password: _, ...userWithoutPassword } = user
  res.json(userWithoutPassword)
})

app.get('/api/physicians', async (req, res) => {
  await db.read()
  res.json(db.data.physicians)
})

app.get('/api/physicians/:id/slots', async (req, res) => {
  await db.read()
  const physicianId = req.params.id
  const slots = db.data.slots.filter((slot) => slot.physicianId === physicianId && slot.isAvailable)
  res.json(slots)
})

app.get('/api/bookings', async (req, res) => {
  await db.read()
  const userId = req.headers['x-user-id']
  const user = userId ? db.data.users.find((u) => u.id === userId) : null

  const bookings = db.data.bookings
    .filter((booking) => {
      if (!user) return true
      if (user.type === 'doctor') {
        return booking.physicianId === user.physicianId
      }
      if (user.type === 'patient') {
        return booking.patientId === user.id || booking.email === user.email
      }
      return true
    })
    .map((booking) => {
      const physician = db.data.physicians.find((item) => item.id === booking.physicianId)
      const slot = db.data.slots.find((item) => item.id === booking.slotId)
      return {
        ...booking,
        physicianName: physician?.name || 'Unknown physician',
        datetime: slot?.datetime || booking.datetime
      }
    })

  res.json(bookings.sort((a, b) => new Date(a.datetime) - new Date(b.datetime)))
})

app.post('/api/bookings', async (req, res) => {
  await db.read()
  const { physicianId, slotId, patientName, email, phone, reason } = req.body
  const slot = db.data.slots.find((item) => item.id === slotId)
  const physician = db.data.physicians.find((item) => item.id === physicianId)

  if (!slot || !slot.isAvailable || !physician) {
    return res.status(400).json({ error: 'Selected slot is not available or physician not found.' })
  }

  const booking = {
    id: nanoid(),
    physicianId,
    slotId,
    patientId: req.headers['x-user-id'] || null,
    patientName,
    email,
    phone,
    reason,
    status: 'pending',
    requestedAt: new Date().toISOString()
  }

  db.data.bookings.push(booking)
  slot.isAvailable = false
  await db.write()

  res.json({
    ...booking,
    physicianName: physician.name,
    datetime: slot.datetime
  })
})

app.patch('/api/bookings/:id', async (req, res) => {
  await db.read()
  const booking = db.data.bookings.find((item) => item.id === req.params.id)
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' })
  }
  const { status } = req.body
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' })
  }

  booking.status = status

  if (status === 'cancelled') {
    const slot = db.data.slots.find((item) => item.id === booking.slotId)
    if (slot) {
      slot.isAvailable = true
    }
  }

  await db.write()
  res.json({ success: true })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Booking API running on http://localhost:${port}`)
})
