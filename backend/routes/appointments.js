
const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { getConnection } = require('../db/connection');
const auth = require('../middleware/auth');

// Récupérer tous les rendez-vous (avec filtres optionnels)
router.get('/', auth, async (req, res) => {
  try {
    const { 
      start_date, 
      end_date, 
      status, 
      agent_id,
      client_id 
    } = req.query;
    
    const connection = getConnection();
    
    // Construire la requête avec les filtres
    let query = `SELECT * FROM appointments WHERE 1=1`;
    const params = [];
    
    if (start_date) {
      query += ` AND date >= ?`;
      params.push(start_date);
    }
    
    if (end_date) {
      query += ` AND date <= ?`;
      params.push(end_date);
    }
    
    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }
    
    if (agent_id) {
      query += ` AND agent_id = ?`;
      params.push(agent_id);
    }
    
    if (client_id) {
      query += ` AND client_id = ?`;
      params.push(client_id);
    }
    
    // Si l'utilisateur n'est pas admin, limiter aux rendez-vous qui le concernent
    if (req.user.role !== 'admin') {
      // Limiter selon le rôle (agent ou client)
      if (req.user.role === 'agent') {
        query += ` AND agent_id = ?`;
        params.push(req.user.id);
      } else {
        query += ` AND client_id = ?`;
        params.push(req.user.id);
      }
    }
    
    query += ` ORDER BY date ASC, time ASC`;
    
    const [appointments] = await connection.query(query, params);
    
    res.json({ success: true, appointments });
  } catch (error) {
    logger.error('Error fetching appointments:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des rendez-vous' });
  }
});

// Récupérer un rendez-vous spécifique
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const connection = getConnection();
    
    // Récupérer les détails du rendez-vous
    const [appointments] = await connection.query(`
      SELECT a.*, 
             c.full_name as client_name, c.email as client_email, c.phone as client_phone,
             u.full_name as agent_name 
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN users u ON a.agent_id = u.id
      WHERE a.id = ?
    `, [id]);
    
    if (!appointments.length) {
      return res.status(404).json({ success: false, message: 'Rendez-vous non trouvé' });
    }
    
    // Vérifier l'autorisation (admin, agent concerné ou client concerné)
    const appointment = appointments[0];
    if (req.user.role !== 'admin' && 
        req.user.id !== appointment.agent_id && 
        req.user.id !== appointment.client_id) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }
    
    res.json({ success: true, appointment });
  } catch (error) {
    logger.error('Error fetching appointment:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération du rendez-vous' });
  }
});

// Créer un nouveau rendez-vous
router.post('/', async (req, res) => {
  try {
    const {
      client_name,
      client_email,
      client_phone,
      date,
      time,
      duration = 60,
      service_id,
      agent_id,
      notes
    } = req.body;
    
    // Validation des champs obligatoires
    if (!client_name || !client_email || !date || !time || !service_id) {
      return res.status(400).json({
        success: false,
        message: 'Les champs nom, email, date, heure et service sont obligatoires'
      });
    }
    
    const connection = getConnection();
    
    // Vérifier la disponibilité
    const [conflicts] = await connection.query(`
      SELECT * FROM appointments 
      WHERE date = ? 
      AND ((time <= ? AND time + duration > ?) OR (time < ? + ? AND time >= ?))
      AND status != 'cancelled'
      ${agent_id ? 'AND agent_id = ?' : ''}
    `, [date, time, time, time, duration, time, ...(agent_id ? [agent_id] : [])]);
    
    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ce créneau horaire n\'est pas disponible'
      });
    }
    
    // Enregistrer le client s'il n'existe pas déjà
    const [existingClients] = await connection.query(`
      SELECT id FROM clients WHERE email = ?
    `, [client_email]);
    
    let client_id;
    if (existingClients.length > 0) {
      client_id = existingClients[0].id;
      // Mettre à jour les informations client si nécessaire
      await connection.query(`
        UPDATE clients 
        SET full_name = ?, phone = ?, updated_at = NOW()
        WHERE id = ?
      `, [client_name, client_phone, client_id]);
    } else {
      // Créer un nouveau client
      const [newClient] = await connection.query(`
        INSERT INTO clients (full_name, email, phone, created_at)
        VALUES (?, ?, ?, NOW())
      `, [client_name, client_email, client_phone]);
      
      client_id = newClient.insertId;
    }
    
    // Si aucun agent n'est spécifié, en assigner un automatiquement
    let assigned_agent_id = agent_id;
    if (!assigned_agent_id) {
      // Logique d'attribution basée sur la disponibilité et la charge
      const [availableAgents] = await connection.query(`
        SELECT u.id, COUNT(a.id) as appointment_count
        FROM users u
        LEFT JOIN appointments a ON u.id = a.agent_id AND a.date = ? AND a.status != 'cancelled'
        WHERE u.role = 'agent' AND u.active = 1
        GROUP BY u.id
        ORDER BY appointment_count ASC
        LIMIT 1
      `, [date]);
      
      if (availableAgents.length > 0) {
        assigned_agent_id = availableAgents[0].id;
      } else {
        // Aucun agent disponible
        return res.status(400).json({
          success: false,
          message: 'Aucun agent disponible pour cette date'
        });
      }
    }
    
    // Créer le rendez-vous
    const [result] = await connection.query(`
      INSERT INTO appointments 
      (client_id, agent_id, service_id, date, time, duration, notes, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled', NOW())
    `, [client_id, assigned_agent_id, service_id, date, time, duration, notes]);
    
    // Renvoyer les détails du rendez-vous créé
    const [newAppointment] = await connection.query(`
      SELECT a.*, 
             c.full_name as client_name, c.email as client_email,
             u.full_name as agent_name,
             s.name as service_name
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN users u ON a.agent_id = u.id
      JOIN services s ON a.service_id = s.id
      WHERE a.id = ?
    `, [result.insertId]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Rendez-vous créé avec succès',
      appointment: newAppointment[0] 
    });
  } catch (error) {
    logger.error('Error creating appointment:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création du rendez-vous' });
  }
});

// Mettre à jour un rendez-vous
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      date,
      time,
      duration,
      status,
      notes,
      agent_id
    } = req.body;
    
    const connection = getConnection();
    
    // Vérifier que le rendez-vous existe
    const [appointments] = await connection.query(`
      SELECT * FROM appointments WHERE id = ?
    `, [id]);
    
    if (!appointments.length) {
      return res.status(404).json({ success: false, message: 'Rendez-vous non trouvé' });
    }
    
    const appointment = appointments[0];
    
    // Vérifier l'autorisation (admin ou agent concerné)
    if (req.user.role !== 'admin' && req.user.id !== appointment.agent_id) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }
    
    // Si la date ou l'heure change, vérifier les conflits
    if ((date && date !== appointment.date) || (time && time !== appointment.time)) {
      const newDate = date || appointment.date;
      const newTime = time || appointment.time;
      const newDuration = duration || appointment.duration;
      
      const [conflicts] = await connection.query(`
        SELECT * FROM appointments 
        WHERE id != ? 
        AND date = ? 
        AND ((time <= ? AND time + duration > ?) OR (time < ? + ? AND time >= ?))
        AND status != 'cancelled'
        ${agent_id ? 'AND agent_id = ?' : 'AND agent_id = ?'}
      `, [id, newDate, newTime, newTime, newTime, newDuration, newTime, agent_id || appointment.agent_id]);
      
      if (conflicts.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Ce créneau horaire n\'est pas disponible'
        });
      }
    }
    
    // Préparer la requête de mise à jour
    const updates = [];
    const values = [];
    
    if (date !== undefined) {
      updates.push('date = ?');
      values.push(date);
    }
    
    if (time !== undefined) {
      updates.push('time = ?');
      values.push(time);
    }
    
    if (duration !== undefined) {
      updates.push('duration = ?');
      values.push(duration);
    }
    
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    
    if (notes !== undefined) {
      updates.push('notes = ?');
      values.push(notes);
    }
    
    if (agent_id !== undefined) {
      updates.push('agent_id = ?');
      values.push(agent_id);
    }
    
    updates.push('updated_at = NOW()');
    
    // Si aucune mise à jour n'est requise
    if (updates.length === 1) {
      return res.json({ success: true, message: 'Aucune modification nécessaire' });
    }
    
    // Exécuter la mise à jour
    await connection.query(`
      UPDATE appointments
      SET ${updates.join(', ')}
      WHERE id = ?
    `, [...values, id]);
    
    // Récupérer le rendez-vous mis à jour
    const [updatedAppointment] = await connection.query(`
      SELECT a.*, 
             c.full_name as client_name, c.email as client_email,
             u.full_name as agent_name,
             s.name as service_name
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN users u ON a.agent_id = u.id
      JOIN services s ON a.service_id = s.id
      WHERE a.id = ?
    `, [id]);
    
    res.json({ 
      success: true, 
      message: 'Rendez-vous mis à jour avec succès',
      appointment: updatedAppointment[0] 
    });
  } catch (error) {
    logger.error('Error updating appointment:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du rendez-vous' });
  }
});

// Annuler un rendez-vous
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const connection = getConnection();
    
    // Vérifier que le rendez-vous existe
    const [appointments] = await connection.query(`
      SELECT * FROM appointments WHERE id = ?
    `, [id]);
    
    if (!appointments.length) {
      return res.status(404).json({ success: false, message: 'Rendez-vous non trouvé' });
    }
    
    const appointment = appointments[0];
    
    // Vérifier l'autorisation (admin, agent concerné ou client concerné)
    if (req.user.role !== 'admin' && 
        req.user.id !== appointment.agent_id && 
        req.user.id !== appointment.client_id) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }
    
    // Vérifier que le rendez-vous n'est pas déjà annulé
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Ce rendez-vous est déjà annulé' });
    }
    
    // Annuler le rendez-vous
    await connection.query(`
      UPDATE appointments
      SET status = 'cancelled', cancellation_reason = ?, updated_at = NOW()
      WHERE id = ?
    `, [reason, id]);
    
    res.json({ success: true, message: 'Rendez-vous annulé avec succès' });
  } catch (error) {
    logger.error('Error cancelling appointment:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'annulation du rendez-vous' });
  }
});

// Récupérer les créneaux disponibles
router.get('/available-slots', async (req, res) => {
  try {
    const { date, service_id, duration = 60 } = req.query;
    
    if (!date) {
      return res.status(400).json({ success: false, message: 'La date est requise' });
    }
    
    const connection = getConnection();
    
    // Récupérer les heures d'ouverture pour cette date
    const dayOfWeek = new Date(date).getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    const [businessHours] = await connection.query(`
      SELECT open_time, close_time FROM business_hours WHERE day_of_week = ?
    `, [dayOfWeek]);
    
    if (!businessHours.length || !businessHours[0].open_time) {
      return res.json({ 
        success: true, 
        available_slots: [],
        message: 'Fermé à cette date'
      });
    }
    
    const openTime = businessHours[0].open_time;
    const closeTime = businessHours[0].close_time;
    
    // Récupérer tous les rendez-vous pour cette date
    const [existingAppointments] = await connection.query(`
      SELECT time, duration, agent_id FROM appointments 
      WHERE date = ? AND status != 'cancelled'
    `, [date]);
    
    // Récupérer tous les agents disponibles
    const [agents] = await connection.query(`
      SELECT id FROM users WHERE role = 'agent' AND active = 1
    `);
    
    // Générer les créneaux disponibles (par tranches de 30 minutes)
    const availableSlots = [];
    const slotDuration = 30; // minutes
    
    // Convertir openTime/closeTime en minutes depuis minuit
    const openMinutes = parseInt(openTime.split(':')[0]) * 60 + parseInt(openTime.split(':')[1]);
    const closeMinutes = parseInt(closeTime.split(':')[0]) * 60 + parseInt(closeTime.split(':')[1]);
    
    // Pour chaque créneau potentiel
    for (let slotStart = openMinutes; slotStart <= closeMinutes - duration; slotStart += slotDuration) {
      // Convertir en format HH:MM
      const slotTime = `${Math.floor(slotStart / 60).toString().padStart(2, '0')}:${(slotStart % 60).toString().padStart(2, '0')}`;
      
      // Vérifier si le créneau est disponible pour au moins un agent
      const availableAgents = agents.filter(agent => {
        // Vérifier les conflits pour cet agent
        return !existingAppointments.some(appt => {
          if (appt.agent_id !== agent.id) return false;
          
          const apptStart = parseInt(appt.time.split(':')[0]) * 60 + parseInt(appt.time.split(':')[1]);
          const apptEnd = apptStart + appt.duration;
          const currentSlotEnd = slotStart + parseInt(duration);
          
          // Vérifier si les créneaux se chevauchent
          return (slotStart < apptEnd && currentSlotEnd > apptStart);
        });
      });
      
      // Si au moins un agent est disponible, ajouter le créneau
      if (availableAgents.length > 0) {
        availableSlots.push({
          time: slotTime,
          available_agents: availableAgents.length
        });
      }
    }
    
    res.json({ success: true, available_slots: availableSlots });
  } catch (error) {
    logger.error('Error fetching available slots:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des créneaux disponibles' });
  }
});

module.exports = router;
