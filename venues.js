const db = require('../db.json');

module.exports = (req, res) => {
  let venues = db.venues;
  const { id, category, popular, location_like, _sort, _order } = req.query;

  // Get single venue by id: /api/venues?id=24
  if (id) {
    const venue = venues.find((v) => String(v.id) === String(id));
    if (!venue) {
      res.status(404).json({ error: 'Venue not found' });
      return;
    }
    res.status(200).json(venue);
    return;
  }

  // Filter by category: /api/venues?category=Padel
  if (category) {
    venues = venues.filter(
      (v) => v.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by popular: /api/venues?popular=true
  if (popular) {
    venues = venues.filter((v) => String(v.popular) === popular);
  }

  // Filter by location keyword: /api/venues?location_like=Bogor
  if (location_like) {
    venues = venues.filter((v) =>
      v.location.toLowerCase().includes(location_like.toLowerCase())
    );
  }

  // Sort: /api/venues?_sort=pricePerHour&_order=asc
  if (_sort) {
    venues = [...venues].sort((a, b) => {
      const valA = a[_sort];
      const valB = b[_sort];
      if (valA == null) return 1;
      if (valB == null) return -1;
      if (valA < valB) return _order === 'desc' ? 1 : -1;
      if (valA > valB) return _order === 'desc' ? -1 : 1;
      return 0;
    });
  }

  res.status(200).json(venues);
};
