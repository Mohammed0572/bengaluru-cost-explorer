export interface CostItem {
  id: string;
  category: string;
  item: string;
  avg_price: number;
  unit: string;
  area: string;
  created_at: string;
}

export const generateMockData = (): CostItem[] => {
  return [
    { id: "1", category: "Housing", item: "1BHK Rent", avg_price: 22000, unit: "month", area: "Indiranagar", created_at: "2026-05-01T10:00:00Z" },
    { id: "2", category: "Housing", item: "2BHK Rent", avg_price: 35000, unit: "month", area: "Koramangala", created_at: "2026-05-02T10:00:00Z" },
    { id: "3", category: "Housing", item: "1BHK Rent", avg_price: 18000, unit: "month", area: "Whitefield", created_at: "2026-05-03T10:00:00Z" },
    { id: "4", category: "Housing", item: "PG Accommodation", avg_price: 12000, unit: "month", area: "HSR Layout", created_at: "2026-05-04T10:00:00Z" },
    { id: "5", category: "Food", item: "Filter Coffee", avg_price: 30, unit: "cup", area: "Malleswaram", created_at: "2026-05-05T10:00:00Z" },
    { id: "6", category: "Food", item: "Masala Dosa", avg_price: 60, unit: "plate", area: "Jayanagar", created_at: "2026-05-06T10:00:00Z" },
    { id: "7", category: "Food", item: "Lunch Thali", avg_price: 150, unit: "meal", area: "Koramangala", created_at: "2026-05-07T10:00:00Z" },
    { id: "8", category: "Transportation", item: "Metro Pass", avg_price: 1500, unit: "month", area: "All Areas", created_at: "2026-05-08T10:00:00Z" },
    { id: "9", category: "Transportation", item: "Auto Ride (5km)", avg_price: 100, unit: "ride", area: "Indiranagar", created_at: "2026-05-09T10:00:00Z" },
    { id: "10", category: "Utilities", item: "Electricity", avg_price: 1200, unit: "month", area: "Whitefield", created_at: "2026-05-10T10:00:00Z" },
    { id: "11", category: "Utilities", item: "Internet (100Mbps)", avg_price: 999, unit: "month", area: "HSR Layout", created_at: "2026-05-11T10:00:00Z" },
    { id: "12", category: "Entertainment", item: "Movie Ticket", avg_price: 350, unit: "ticket", area: "MG Road", created_at: "2026-05-12T10:00:00Z" },
    { id: "13", category: "Entertainment", item: "Pub Cover Charge", avg_price: 1500, unit: "person", area: "Indiranagar", created_at: "2026-05-13T10:00:00Z" },
  ];
};
