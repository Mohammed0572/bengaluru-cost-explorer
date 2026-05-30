-- Additional real estate seed data for Bengaluru Cost Explorer.
-- Adds ~60 property listings across neighborhoods, BHK types, and price ranges.

INSERT INTO public.real_estate (area, location, bhk, bath, property_type, price)
VALUES
  -- Koramangala
  (550, 'Koramangala', 1, 1, 'Apartment', 12500000),
  (750, 'Koramangala', 1, 1, 'Apartment', 16000000),
  (950, 'Koramangala', 2, 2, 'Apartment', 24000000),
  (1400, 'Koramangala', 3, 2, 'Apartment', 35000000),
  (1800, 'Koramangala', 3, 3, 'Apartment', 48000000),
  (2200, 'Koramangala', 4, 4, 'Villa', 75000000),

  -- Indiranagar
  (500, 'Indiranagar', 1, 1, 'Apartment', 15000000),
  (850, 'Indiranagar', 2, 1, 'Apartment', 25000000),
  (1350, 'Indiranagar', 3, 2, 'Apartment', 38000000),
  (1600, 'Indiranagar', 3, 3, 'Apartment', 52000000),
  (2400, 'Indiranagar', 4, 4, 'Villa', 85000000),

  -- HSR Layout
  (600, 'HSR Layout', 1, 1, 'Apartment', 10500000),
  (850, 'HSR Layout', 2, 1, 'Apartment', 14000000),
  (1100, 'HSR Layout', 2, 2, 'Apartment', 19000000),
  (1350, 'HSR Layout', 3, 2, 'Apartment', 24000000),
  (1700, 'HSR Layout', 3, 3, 'Apartment', 31000000),

  -- Whitefield
  (650, 'Whitefield', 1, 1, 'Apartment', 7500000),
  (950, 'Whitefield', 2, 1, 'Apartment', 11000000),
  (1100, 'Whitefield', 2, 2, 'Apartment', 14500000),
  (1500, 'Whitefield', 3, 2, 'Apartment', 20000000),
  (1800, 'Whitefield', 3, 3, 'Apartment', 26000000),
  (2500, 'Whitefield', 4, 3, 'Villa', 45000000),
  (3200, 'Whitefield', 5, 5, 'Villa', 65000000),

  -- Jayanagar
  (700, 'Jayanagar', 1, 1, 'Apartment', 14000000),
  (1050, 'Jayanagar', 2, 2, 'Apartment', 22000000),
  (1300, 'Jayanagar', 3, 2, 'Apartment', 30000000),
  (1800, 'Jayanagar', 3, 3, 'Apartment', 42000000),
  (2400, 'Jayanagar', 4, 4, 'Villa', 70000000),

  -- Malleswaram
  (600, 'Malleswaram', 1, 1, 'Apartment', 13000000),
  (950, 'Malleswaram', 2, 2, 'Apartment', 20000000),
  (1400, 'Malleswaram', 3, 2, 'Apartment', 32000000),
  (1900, 'Malleswaram', 3, 3, 'Apartment', 45000000),

  -- Electronic City
  (550, 'Electronic City', 1, 1, 'Apartment', 4500000),
  (750, 'Electronic City', 2, 1, 'Apartment', 6500000),
  (950, 'Electronic City', 2, 2, 'Apartment', 8500000),
  (1200, 'Electronic City', 3, 2, 'Apartment', 11000000),
  (1500, 'Electronic City', 3, 3, 'Apartment', 14500000),
  (2000, 'Electronic City', 4, 3, 'Villa', 22000000),

  -- Marathahalli
  (600, 'Marathahalli', 1, 1, 'Apartment', 6000000),
  (850, 'Marathahalli', 2, 1, 'Apartment', 9000000),
  (1100, 'Marathahalli', 2, 2, 'Apartment', 12500000),
  (1400, 'Marathahalli', 3, 2, 'Apartment', 16000000),
  (1700, 'Marathahalli', 3, 3, 'Apartment', 21000000),

  -- JP Nagar
  (650, 'JP Nagar', 1, 1, 'Apartment', 9500000),
  (900, 'JP Nagar', 2, 1, 'Apartment', 13000000),
  (1150, 'JP Nagar', 2, 2, 'Apartment', 17500000),
  (1500, 'JP Nagar', 3, 2, 'Apartment', 25000000),
  (1900, 'JP Nagar', 3, 3, 'Apartment', 33000000),
  (2600, 'JP Nagar', 4, 4, 'Villa', 55000000),

  -- BTM Layout
  (550, 'BTM Layout', 1, 1, 'Apartment', 8000000),
  (800, 'BTM Layout', 2, 1, 'Apartment', 11500000),
  (1050, 'BTM Layout', 2, 2, 'Apartment', 15000000),
  (1350, 'BTM Layout', 3, 2, 'Apartment', 20000000),

  -- Sarjapur Road
  (650, 'Sarjapur Road', 1, 1, 'Apartment', 5500000),
  (900, 'Sarjapur Road', 2, 1, 'Apartment', 7500000),
  (1100, 'Sarjapur Road', 2, 2, 'Apartment', 10000000),
  (1400, 'Sarjapur Road', 3, 2, 'Apartment', 14000000),
  (1800, 'Sarjapur Road', 3, 3, 'Apartment', 19000000),
  (2800, 'Sarjapur Road', 4, 4, 'Villa', 35000000),

  -- Hebbal
  (700, 'Hebbal', 1, 1, 'Apartment', 8500000),
  (1000, 'Hebbal', 2, 2, 'Apartment', 14000000),
  (1350, 'Hebbal', 3, 2, 'Apartment', 20000000),
  (1800, 'Hebbal', 3, 3, 'Apartment', 28000000),
  (2500, 'Hebbal', 4, 4, 'Villa', 48000000),

  -- Yelahanka
  (600, 'Yelahanka', 1, 1, 'Apartment', 4800000),
  (850, 'Yelahanka', 2, 1, 'Apartment', 7000000),
  (1100, 'Yelahanka', 2, 2, 'Apartment', 9500000),
  (1500, 'Yelahanka', 3, 2, 'Apartment', 13500000),
  (2200, 'Yelahanka', 4, 3, 'Villa', 25000000),

  -- Bannerghatta Road
  (550, 'Bannerghatta Road', 1, 1, 'Apartment', 5000000),
  (800, 'Bannerghatta Road', 2, 1, 'Apartment', 7500000),
  (1050, 'Bannerghatta Road', 2, 2, 'Apartment', 10500000),
  (1400, 'Bannerghatta Road', 3, 2, 'Apartment', 15000000),
  (2000, 'Bannerghatta Road', 3, 3, 'Villa', 24000000)

ON CONFLICT (location, bhk, bath, area, property_type, price) DO NOTHING;
