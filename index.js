import { adminEmail, subscriptions } from './config';
import { getDatesFromRange } from './utils';
import { getAvailabilityForDates } from './services/recreation';
import { sendEmail } from './services/gmail';

(async () => {
  for (const {
    id, name, checkIn, checkOut, notify,
  } of subscriptions) {
    const dates = getDatesFromRange(checkIn, checkOut);
    const campsites = await getAvailabilityForDates(id, dates);

    const availableCampsites = Object.values(campsites)
      .filter(({ availabilities }) => dates.every((d) => {
        const key = `${d.split('.')[0]}Z`;

        if (!(key in availabilities)) {
          return false;
        }

        return availabilities[key] === 'Available';
      }));

    availableCampsites.forEach((c) => {
      const message = `Site ${c.site} is available for your dates: https://www.recreation.gov/camping/campsites/${c.campsite_id}`;

      notify.forEach((to) => {
        sendEmail(to, name, message);
      });
    });
  }
})().catch((e) => {
  const subject = 'Camping Checker is Failing';
  const text = e.message;

  sendEmail(adminEmail, subject, text);
});
