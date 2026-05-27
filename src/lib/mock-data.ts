export interface CostItem {
  id: string;
  category: string;
  item: string;
  avg_price: number;
  unit: string;
  area: string;
  created_at: string;
}

export const fetchCostData = async (): Promise<CostItem[]> => {
  try {
    const response = await fetch('/data.csv');
    const text = await response.text();
    
    // Simple CSV parser
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const data: CostItem[] = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const item: any = {};
      headers.forEach((header, index) => {
        if (header === 'avg_price') {
          item[header] = Number(values[index]);
        } else {
          item[header] = values[index];
        }
      });
      return item as CostItem;
    });
    
    // Simulate network latency for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return data;
  } catch (error) {
    console.error("Failed to fetch mock CSV data:", error);
    return [];
  }
};
