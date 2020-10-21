import queryString from 'query-string';
import fetch from 'node-fetch';
import { getFirstOfMonth } from '../utils';

export async function getAvailability(campgroundId, startDate) {
  const apiUrl = queryString.stringifyUrl({
    url: `https://www.recreation.gov/api/camps/availability/campground/${campgroundId}/month`,
    query: {
      start_date: startDate,
    },
  });

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36' },
  });

  return response.json();
}

export async function getAvailabilityForDates(campgroundId, dates) {
  const campsites = {};
  const startDates = [...new Set(dates.map(getFirstOfMonth))];

  for (const startDate of startDates) {
    const data = await getAvailability(campgroundId, startDate);
    Object.values(data.campsites).forEach((campsite) => {
      if (campsite.campsite_id in campsites) {
        campsites[campsite.campsite_id].availabilities = {
          ...campsites[campsite.campsite_id].availabilities,
          ...campsite.availabilities,
        };
      } else {
        campsites[campsite.campsite_id] = campsite;
      }
    });
  }

  return campsites;
}
