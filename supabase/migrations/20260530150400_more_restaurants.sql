-- Additional restaurant seed data for Bengaluru Cost Explorer.
-- Adds ~50 popular Bengaluru restaurants across neighborhoods.

INSERT INTO public.restaurants (name, address, location, rating, votes, cost_for_two, cuisines, rest_type)
VALUES
  -- Koramangala
  ('Bangalore Oota Company', '6th Block, Koramangala', 'Koramangala', 4.3, 8920, 800, 'Karnataka, South Indian', 'Casual Dining'),
  ('The Permit Room', '5th Block, Koramangala', 'Koramangala', 4.1, 6740, 1200, 'South Indian, Bar Food', 'Casual Dining'),
  ('Chinita', '5th Block, Koramangala', 'Koramangala', 4.4, 5120, 1400, 'Mexican, Tex-Mex', 'Casual Dining'),
  ('Smoke House Deli', '4th Block, Koramangala', 'Koramangala', 4.2, 7850, 1600, 'Continental, European', 'Cafe'),
  ('Leon Grill', '5th Block, Koramangala', 'Koramangala', 4.0, 9200, 400, 'Lebanese, Wraps, Grills', 'Quick Bites'),
  ('Nandhana Palace', '5th Block, Koramangala', 'Koramangala', 4.1, 11340, 600, 'Andhra, Biryani, South Indian', 'Casual Dining'),
  ('Corner House', '7th Block, Koramangala', 'Koramangala', 4.5, 14200, 300, 'Desserts, Ice Cream', 'Quick Bites'),
  ('Third Wave Coffee', '6th Block, Koramangala', 'Koramangala', 4.3, 4500, 500, 'Coffee, Continental, Bakery', 'Cafe'),

  -- Indiranagar
  ('The Fatty Bao', '12th Main, Indiranagar', 'Indiranagar', 4.3, 9870, 1800, 'Asian, Thai, Japanese', 'Casual Dining'),
  ('Communiti', '12th Main, Indiranagar', 'Indiranagar', 4.2, 5430, 2200, 'Continental, Asian, Bar Food', 'Pub'),
  ('Glen''s Bakehouse', '12th Main, Indiranagar', 'Indiranagar', 4.4, 8900, 700, 'Bakery, Desserts, Continental', 'Cafe'),
  ('Byg Brewski', 'Sarjapur-Marathahalli Rd', 'Indiranagar', 4.2, 13400, 2000, 'Continental, North Indian, Craft Beer', 'Microbrewery'),
  ('Dyu Art Cafe', '12th Main, Indiranagar', 'Indiranagar', 4.1, 3200, 600, 'Cafe, Continental, Italian', 'Cafe'),
  ('Brahmin''s Coffee Bar', 'Ranga Rao Road', 'Indiranagar', 4.5, 7800, 100, 'South Indian, Idli, Coffee', 'Quick Bites'),
  ('Arbor Brewing Company', '12th Main, Indiranagar', 'Indiranagar', 4.1, 6200, 2200, 'Continental, American, Craft Beer', 'Microbrewery'),

  -- HSR Layout
  ('Brik Oven', 'HSR Layout Sector 7', 'HSR Layout', 4.3, 6780, 800, 'Pizza, Italian, Continental', 'Casual Dining'),
  ('Hole in the Wall', '27th Main, HSR Layout', 'HSR Layout', 4.2, 5430, 1200, 'Cafe, Continental, Italian', 'Cafe'),
  ('Hari Super Sandwich', '27th Main, HSR Layout', 'HSR Layout', 4.0, 4300, 200, 'Street Food, Sandwiches', 'Quick Bites'),
  ('Veena Stores', '14th Cross, HSR Layout', 'HSR Layout', 4.4, 5600, 150, 'South Indian, Breakfast', 'Quick Bites'),
  ('1522', 'HSR Layout Sector 3', 'HSR Layout', 4.1, 3800, 1500, 'Continental, North Indian', 'Casual Dining'),
  ('La Pino''z Pizza', '27th Main, HSR Layout', 'HSR Layout', 3.9, 4200, 500, 'Pizza, Italian, Fast Food', 'Quick Bites'),

  -- Whitefield
  ('Barbeque Nation', 'ITPL Main Road, Whitefield', 'Whitefield', 4.1, 11200, 1600, 'North Indian, BBQ, Buffet', 'Casual Dining'),
  ('Punjab Grill', 'VR Bengaluru, Whitefield', 'Whitefield', 4.3, 4300, 2000, 'North Indian, Mughlai', 'Fine Dining'),
  ('Chili''s', 'Forum Value Mall, Whitefield', 'Whitefield', 4.0, 6700, 1400, 'American, Mexican, Burgers', 'Casual Dining'),
  ('The Biryani Cafe', 'ITPL Main Road, Whitefield', 'Whitefield', 4.2, 3200, 500, 'Biryani, Hyderabadi', 'Quick Bites'),
  ('Cafe Azzure', 'Marriott Whitefield', 'Whitefield', 4.4, 2800, 2500, 'Continental, Buffet, Multi-Cuisine', 'Fine Dining'),
  ('Nando''s', 'VR Bengaluru, Whitefield', 'Whitefield', 4.0, 5100, 1000, 'Portuguese, Grills', 'Casual Dining'),

  -- Jayanagar
  ('Vidyarthi Bhavan', 'Gandhi Bazaar, Jayanagar', 'Jayanagar', 4.5, 16700, 200, 'South Indian, Dosa, Breakfast', 'Quick Bites'),
  ('Airlines Hotel', '4th Block, Jayanagar', 'Jayanagar', 4.3, 9400, 500, 'South Indian, Karnataka, North Indian', 'Casual Dining'),
  ('Maiyas', '4th Block, Jayanagar', 'Jayanagar', 4.2, 8300, 400, 'South Indian, Sweets, Snacks', 'Quick Bites'),
  ('Halli Mane Rotties', 'Jayanagar 4th Block', 'Jayanagar', 4.1, 5600, 300, 'Karnataka, North Karnataka', 'Casual Dining'),
  ('Just Bake', '3rd Block, Jayanagar', 'Jayanagar', 4.0, 3100, 250, 'Bakery, Cakes, Desserts', 'Quick Bites'),

  -- Malleswaram
  ('New Krishna Bhavan', '8th Cross, Malleswaram', 'Malleswaram', 4.2, 7800, 200, 'South Indian, Breakfast, Coffee', 'Quick Bites'),
  ('Janatha Hotel', '4th Cross, Malleswaram', 'Malleswaram', 4.3, 6400, 150, 'South Indian, Idli, Dosa', 'Quick Bites'),
  ('Donne Biryani House', '15th Cross, Malleswaram', 'Malleswaram', 4.1, 4300, 350, 'Biryani, Karnataka', 'Casual Dining'),
  ('Sapphire Crust', 'Sampige Road, Malleswaram', 'Malleswaram', 4.0, 2900, 500, 'Pizza, Continental, Bakery', 'Cafe'),

  -- Electronic City
  ('Empire Restaurant', 'Electronic City Phase 1', 'Electronic City', 4.0, 8900, 500, 'Biryani, Kebabs, North Indian', 'Casual Dining'),
  ('Udupi Garden', 'Electronic City Phase 1', 'Electronic City', 4.1, 5200, 300, 'South Indian, North Indian', 'Quick Bites'),
  ('Rasoi Magic', 'Neeladri Road, Electronic City', 'Electronic City', 3.9, 2800, 250, 'North Indian, Thali', 'Casual Dining'),

  -- Marathahalli
  ('A2B', 'Outer Ring Road, Marathahalli', 'Marathahalli', 4.0, 6700, 400, 'South Indian, Sweets, Snacks', 'Quick Bites'),
  ('Biryani Zone', 'Marathahalli Bridge', 'Marathahalli', 4.1, 4300, 350, 'Biryani, North Indian', 'Quick Bites'),
  ('Cafe Coffee Day Lounge', 'Outer Ring Road, Marathahalli', 'Marathahalli', 3.8, 3100, 600, 'Coffee, Continental, Snacks', 'Cafe'),

  -- JP Nagar
  ('Udupi Grand', '15th Cross, JP Nagar', 'JP Nagar', 4.2, 7600, 350, 'South Indian, North Indian', 'Casual Dining'),
  ('Savoy Restaurant', 'JP Nagar 3rd Phase', 'JP Nagar', 4.0, 4500, 500, 'Kebabs, Biryani, North Indian', 'Casual Dining'),
  ('Onesta', '15th Cross, JP Nagar', 'JP Nagar', 4.3, 6800, 700, 'Pizza, Italian, Pasta', 'Casual Dining'),

  -- BTM Layout
  ('MTR 1924', 'BTM Layout 2nd Stage', 'BTM Layout', 4.4, 9300, 400, 'South Indian, Karnataka, Breakfast', 'Quick Bites'),
  ('Ambur Star Biryani', '16th Main, BTM Layout', 'BTM Layout', 4.2, 5400, 350, 'Biryani, Andhra, Non-Veg', 'Casual Dining'),
  ('Frozen Bottle', 'BTM Layout 1st Stage', 'BTM Layout', 4.0, 3200, 400, 'Desserts, Milkshakes, Ice Cream', 'Quick Bites'),

  -- MG Road / Brigade Road
  ('Koshy''s', 'St. Marks Road', 'MG Road', 4.3, 11200, 800, 'Continental, Indian, Cafe', 'Casual Dining'),
  ('The Only Place', 'Museum Road', 'MG Road', 4.2, 7800, 1200, 'Steaks, Continental, American', 'Casual Dining'),
  ('Indian Coffee House', 'MG Road', 'MG Road', 4.1, 5600, 200, 'South Indian, Coffee, Snacks', 'Quick Bites')

ON CONFLICT (name, location) DO UPDATE SET
  address = EXCLUDED.address,
  rating = EXCLUDED.rating,
  votes = EXCLUDED.votes,
  cost_for_two = EXCLUDED.cost_for_two,
  cuisines = EXCLUDED.cuisines,
  rest_type = EXCLUDED.rest_type;
