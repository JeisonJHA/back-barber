import User from '../models/User';
import Notification from '../schema/Notification';

class NotifcationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load notifications' });
    }

    const notifications = Notification.find({
      user: req.provider_id,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    return res.json(notification);
  }
}

export default new NotifcationController();
