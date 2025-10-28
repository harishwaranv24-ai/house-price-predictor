/*
  # House Price Prediction Database Schema

  1. New Tables
    - `houses`
      - `id` (uuid, primary key) - Unique identifier for each house record
      - `square_feet` (numeric) - Living area in square feet
      - `bedrooms` (integer) - Number of bedrooms
      - `bathrooms` (numeric) - Number of bathrooms
      - `year_built` (integer) - Year the house was built
      - `lot_size` (numeric) - Lot size in square feet
      - `garage_spaces` (integer) - Number of garage spaces
      - `location_score` (numeric) - Location desirability score (1-10)
      - `actual_price` (numeric) - Actual sale price
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `predictions`
      - `id` (uuid, primary key) - Unique identifier for prediction
      - `square_feet` (numeric) - Input: living area
      - `bedrooms` (integer) - Input: number of bedrooms
      - `bathrooms` (numeric) - Input: number of bathrooms
      - `year_built` (integer) - Input: year built
      - `lot_size` (numeric) - Input: lot size
      - `garage_spaces` (integer) - Input: garage spaces
      - `location_score` (numeric) - Input: location score
      - `predicted_price` (numeric) - Model output: predicted price
      - `created_at` (timestamptz) - Prediction timestamp
  
  2. Security
    - Enable RLS on both tables
    - Allow public read access for houses (training data)
    - Allow authenticated users to insert predictions
    - Allow public to insert predictions for demo purposes
  
  3. Sample Data
    - Insert realistic sample house data for model training
*/

-- Create houses table
CREATE TABLE IF NOT EXISTS houses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  square_feet numeric NOT NULL,
  bedrooms integer NOT NULL,
  bathrooms numeric NOT NULL,
  year_built integer NOT NULL,
  lot_size numeric NOT NULL,
  garage_spaces integer NOT NULL DEFAULT 0,
  location_score numeric NOT NULL,
  actual_price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  square_feet numeric NOT NULL,
  bedrooms integer NOT NULL,
  bathrooms numeric NOT NULL,
  year_built integer NOT NULL,
  lot_size numeric NOT NULL,
  garage_spaces integer NOT NULL DEFAULT 0,
  location_score numeric NOT NULL,
  predicted_price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for houses table
CREATE POLICY "Anyone can view houses"
  ON houses FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert houses"
  ON houses FOR INSERT
  WITH CHECK (true);

-- RLS Policies for predictions table
CREATE POLICY "Anyone can view predictions"
  ON predictions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert predictions"
  ON predictions FOR INSERT
  WITH CHECK (true);

-- Insert sample training data
INSERT INTO houses (square_feet, bedrooms, bathrooms, year_built, lot_size, garage_spaces, location_score, actual_price) VALUES
(1500, 3, 2, 2010, 5000, 2, 7.5, 325000),
(2200, 4, 2.5, 2015, 6500, 2, 8.2, 485000),
(1800, 3, 2, 2008, 4800, 2, 6.8, 298000),
(2800, 4, 3, 2018, 8000, 3, 9.1, 625000),
(1200, 2, 1.5, 2005, 3500, 1, 6.2, 215000),
(3200, 5, 3.5, 2020, 10000, 3, 9.5, 785000),
(1600, 3, 2, 2012, 5200, 2, 7.0, 295000),
(2500, 4, 2.5, 2016, 7200, 2, 8.5, 535000),
(2000, 3, 2.5, 2014, 5800, 2, 7.8, 425000),
(3500, 5, 4, 2019, 12000, 3, 9.8, 895000),
(1400, 2, 2, 2011, 4200, 1, 6.5, 245000),
(2700, 4, 3, 2017, 7800, 2, 8.8, 615000),
(1900, 3, 2, 2013, 5500, 2, 7.3, 365000),
(2300, 4, 2.5, 2015, 6800, 2, 8.0, 475000),
(1700, 3, 2, 2009, 4900, 2, 6.9, 285000),
(3000, 5, 3.5, 2021, 9500, 3, 9.3, 725000),
(1550, 3, 2, 2010, 5100, 2, 7.2, 315000),
(2600, 4, 3, 2018, 7500, 2, 8.7, 595000),
(2100, 3, 2.5, 2014, 6000, 2, 7.9, 445000),
(3800, 5, 4.5, 2022, 13000, 3, 10, 975000),
(1300, 2, 1.5, 2006, 3800, 1, 6.0, 225000),
(2400, 4, 2.5, 2016, 7000, 2, 8.3, 515000),
(1850, 3, 2, 2012, 5400, 2, 7.4, 355000),
(2900, 4, 3.5, 2019, 8500, 3, 9.0, 685000),
(1650, 3, 2, 2011, 4700, 2, 7.1, 305000);
