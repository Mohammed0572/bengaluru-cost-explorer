export interface CostItem {
  id: string;
  category: string;
  item: string;
  avg_price: number;
  unit: string;
  area: string;
  created_at: string;
}

const fallbackCostData: CostItem[] = [
  {
    id: "1",
    category: "Housing",
    item: "1BHK Rent",
    avg_price: 22000,
    unit: "month",
    area: "Indiranagar",
    created_at: "2026-05-01",
  },
  {
    id: "2",
    category: "Housing",
    item: "Shared PG",
    avg_price: 12000,
    unit: "month",
    area: "Koramangala",
    created_at: "2026-05-02",
  },
  {
    id: "3",
    category: "Food",
    item: "Masala Dosa",
    avg_price: 80,
    unit: "plate",
    area: "Jayanagar",
    created_at: "2026-05-03",
  },
  {
    id: "4",
    category: "Transportation",
    item: "Metro Pass",
    avg_price: 1500,
    unit: "month",
    area: "All Areas",
    created_at: "2026-05-04",
  },
  {
    id: "5",
    category: "Utilities",
    item: "Internet Plan",
    avg_price: 999,
    unit: "month",
    area: "Whitefield",
    created_at: "2026-05-05",
  },
  {
    id: "6",
    category: "Entertainment",
    item: "Movie Ticket",
    avg_price: 350,
    unit: "ticket",
    area: "MG Road",
    created_at: "2026-05-06",
  },
];

export const fetchCostData = async (): Promise<CostItem[]> => {
  try {
    const response = await fetch('/data.csv');
    if (!response.ok) {
      return fallbackCostData;
    }

    const text = await response.text();
    const lines = text.trim().split('\n').filter(Boolean);
    const headers = lines[0]?.split(',').map(h => h.trim()) ?? [];

    if (!headers.includes('item') || !headers.includes('category') || !headers.includes('avg_price')) {
      return fallbackCostData;
    }
    
    const data: CostItem[] = lines.slice(1).map((line, rowIndex) => {
      const values = line.split(',').map(v => v.trim());
      const item: Partial<CostItem> = {};
      headers.forEach((header, index) => {
        if (header === 'avg_price') {
          item[header] = Number(values[index]) || 0;
        } else {
          item[header as keyof CostItem] = values[index] as never;
        }
      });
      return {
        id: item.id || String(rowIndex + 1),
        category: item.category || 'Other',
        item: item.item || 'Unknown item',
        avg_price: item.avg_price || 0,
        unit: item.unit || '',
        area: item.area || 'All Areas',
        created_at: item.created_at || new Date().toISOString(),
      };
    }).filter(item => item.avg_price > 0);
    
    // Simulate network latency for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return data.length > 0 ? data : fallbackCostData;
  } catch (error) {
    console.error("Failed to fetch mock CSV data:", error);
    return fallbackCostData;
  }
};
