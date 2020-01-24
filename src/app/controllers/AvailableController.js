import {
  startOfDay,
  endOfDay,
  setSeconds,
  setMinutes,
  setHours,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import Available from '../schema/Available';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);
    const provider_id = req.params.providerId;
    const appointments = await Appointment.findAll({
      where: {
        provider_id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const availableSchedule = await Available.findOne({ user: provider_id });
    if (!availableSchedule) {
      return res.json([]);
    }
    const available = availableSchedule.schedule.map(
      ({ _id: id, hour: time, available: blocked }) => {
        const [hour, min] = time.split(':');
        const value = setSeconds(
          setMinutes(setHours(searchDate, hour), min),
          0
        );

        return {
          id,
          time,
          value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
          blocked: !blocked,
          available:
            isAfter(value, new Date()) &&
            !appointments.find(a => format(a.date, 'HH:mm') === time),
        };
      }
    );

    return res.json(available);
  }

  async store(req, res) {
    await Available.create({
      schedule: req.body.schedule,
      user: req.body.provider_id,
    });
    return res.send();
  }

  async update(req, res) {
    const { id } = req.params;
    const { provider_id, available } = req.body;
    await Available.updateOne(
      { user: provider_id, 'schedule._id': id },
      {
        $set: { 'schedule.$.available': available },
      }
    );
    return res.send();
  }
}

export default new AvailableController();
